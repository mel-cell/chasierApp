<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Menu;
use App\Models\Ingredient;
use App\Models\InventoryLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::today()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::today()->format('Y-m-d'));
        $type = $request->input('type', 'transaksi');

        $data = match ($type) {
            'stok' => $this->getStockReport($startDate, $endDate),
            default => $this->getTransactionReport($startDate, $endDate),
        };

        return Inertia::render('admin/Laporan', [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'reportType' => $type,
            'data' => $data,
        ]);
    }

    public function exportExcel(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::today()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::today()->format('Y-m-d'));
        $type = $request->input('type', 'transaksi');

        $spreadsheet = new Spreadsheet();

        if ($type === 'stok') {
            $data = $this->getStockReport($startDate, $endDate);
            $this->buildStockExcel($spreadsheet, $data, $startDate, $endDate);
        } else {
            $data = $this->getTransactionReport($startDate, $endDate);
            $this->buildTransactionExcel($spreadsheet, $data, $startDate, $endDate);
        }

        $writer = new Xlsx($spreadsheet);

        $filename = "laporan_{$type}_{$startDate}_{$endDate}.xlsx";

        $tempFile = tempnam(sys_get_temp_dir(), 'laporan');
        $writer->save($tempFile);

        return response()->download($tempFile, $filename)->deleteFileAfterSend(true);
    }

    private function getTransactionReport(string $startDate, string $endDate): array
    {
        $transactions = Transaction::with(['user', 'paymentMethod', 'details.menu'])
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->latest()
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'total_amount' => (float) $t->total_amount,
                'user' => $t->user?->name ?? 'Dihapus',
                'payment_method' => $t->paymentMethod?->name ?? '-',
                'items' => $t->details->map(fn ($d) => [
                    'menu' => $d->menu?->name ?? 'Dihapus',
                    'qty' => $d->quantity,
                    'price' => (float) $d->price,
                ]),
                'created_at' => $t->created_at->format('d/m/Y H:i'),
            ]);

        $summary = [
            'total_transactions' => $transactions->count(),
            'total_revenue' => $transactions->sum('total_amount'),
            'total_items' => $transactions->sum(fn ($t) => collect($t['items'])->sum('qty')),
        ];

        return [
            'transactions' => $transactions,
            'summary' => $summary,
        ];
    }

    private function getStockReport(string $startDate, string $endDate): array
    {
        $logs = InventoryLog::with(['ingredient', 'user', 'warehouse'])
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->latest()
            ->get()
            ->map(fn ($l) => [
                'id' => $l->id,
                'type' => $l->type,
                'quantity' => (float) $l->quantity,
                'reason' => $l->reason ?? '-',
                'ingredient' => $l->ingredient?->name ?? 'Dihapus',
                'warehouse' => $l->warehouse?->name ?? 'Dihapus',
                'user' => $l->user?->name ?? 'Sistem',
                'created_at' => $l->created_at->format('d/m/Y H:i'),
            ]);

        $summary = [
            'total_in' => $logs->where('type', 'in')->sum('quantity'),
            'total_out' => $logs->where('type', 'out')->sum('quantity'),
            'total_logs' => $logs->count(),
        ];

        return [
            'logs' => $logs,
            'summary' => $summary,
        ];
    }

    private function buildTransactionExcel(Spreadsheet $spreadsheet, array $data, string $startDate, string $endDate): void
    {
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Laporan Transaksi');

        $sheet->setCellValue('A1', "Laporan Transaksi ({$startDate} - {$endDate})");
        $sheet->mergeCells('A1:F1');

        $headers = ['No', 'ID Transaksi', 'Kasir', 'Metode Bayar', 'Total', 'Tanggal'];
        foreach (range('A', 'F') as $i => $col) {
            $sheet->setCellValue($col . '3', $headers[$i]);
        }

        $row = 4;
        foreach ($data['transactions'] as $i => $t) {
            $sheet->setCellValue('A' . $row, $i + 1);
            $sheet->setCellValue('B' . $row, $t['id']);
            $sheet->setCellValue('C' . $row, $t['user']);
            $sheet->setCellValue('D' . $row, $t['payment_method']);
            $sheet->setCellValue('E' . $row, $t['total_amount']);
            $sheet->setCellValue('F' . $row, $t['created_at']);
            $row++;
        }
    }

    private function buildStockExcel(Spreadsheet $spreadsheet, array $data, string $startDate, string $endDate): void
    {
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Laporan Stok');

        $sheet->setCellValue('A1', "Laporan Stok ({$startDate} - {$endDate})");
        $sheet->mergeCells('A1:G1');

        $headers = ['No', 'Bahan', 'Gudang', 'Tipe', 'Jumlah', 'Alasan', 'Tanggal'];
        foreach (range('A', 'G') as $i => $col) {
            $sheet->setCellValue($col . '3', $headers[$i]);
        }

        $row = 4;
        foreach ($data['logs'] as $i => $l) {
            $sheet->setCellValue('A' . $row, $i + 1);
            $sheet->setCellValue('B' . $row, $l['ingredient']);
            $sheet->setCellValue('C' . $row, $l['warehouse']);
            $sheet->setCellValue('D' . $row, ucfirst($l['type']));
            $sheet->setCellValue('E' . $row, $l['quantity']);
            $sheet->setCellValue('F' . $row, $l['reason']);
            $sheet->setCellValue('G' . $row, $l['created_at']);
            $row++;
        }
    }
}
