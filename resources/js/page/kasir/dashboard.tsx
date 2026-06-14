import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Search, 
    Plus, 
    Minus, 
    Trash2, 
    User, 
    Clock, 
    Receipt, 
    CheckCircle2, 
    X, 
    ShoppingBag, 
    ChevronRight,
    Settings,
    LogOut
} from 'lucide-react';

interface MenuItem {
    id: number;
    name: string;
    price: number;
    image: string | null;
    category: string;
    category_id: number | null;
}

interface PaymentMethod {
    id: number;
    name: string;
}

interface ReceiptData {
    message: string;
    transaction: {
        id: number;
        total: number;
        bayar: number;
        kembalian: number;
        items: { menu_id: number; qty: number; harga: number }[];
        created_at: string;
    } | null;
}

interface PageProps {
    menus: MenuItem[];
    categories: string[];
    paymentMethods: PaymentMethod[];
    resepActive: boolean;
    todayCount: number;
    flash: { success: ReceiptData | null; error: string | null };
    auth: { user: { name: string; email: string } | null };
}

export default function Dashboard() {
    const { props } = usePage<PageProps>();
    const { menus, categories, paymentMethods, resepActive, todayCount, flash, auth } = props;
    const receiptData = flash?.success as ReceiptData | null;

    // Search & Category Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('semua');

    // Cart State: maps product.id -> quantity ordered
    const [cart, setCart] = useState<Record<number, number>>({});

    // Discount, Payment, and Receipt
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);
    const [paidAmountInput, setPaidAmountInput] = useState<string>('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number>(paymentMethods[0]?.id || 1);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [transactionNumber, setTransactionNumber] = useState(() => {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.floor(1000 + Math.random() * 9000);
        return `TRX-${dateStr}-${randomStr}`;
    });

    // Update time dynamic
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Generate random transaction number on mount or new transaction
    const generateTransactionId = () => {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.floor(1000 + Math.random() * 9000);
        setTransactionNumber(`TRX-${dateStr}-${randomStr}`);
    };

    // Add 1 to cart
    const handleAddToCart = (productId: number) => {
        const product = menus.find(p => p.id === productId);
        if (!product) return;

        setCart(prev => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1
        }));
    };

    // Subtract 1 from cart
    const handleSubtractFromCart = (productId: number) => {
        setCart(prev => {
            const currentQty = prev[productId] || 0;
            if (currentQty <= 1) {
                const copy = { ...prev };
                delete copy[productId];
                return copy;
            }
            return {
                ...prev,
                [productId]: currentQty - 1
            };
        });
    };

    // Remove item completely
    const handleRemoveFromCart = (productId: number) => {
        setCart(prev => {
            const copy = { ...prev };
            delete copy[productId];
            return copy;
        });
    };

    // Clear cart
    const handleClearCart = () => {
        setCart({});
        setDiscountPercentage(0);
        setPaidAmountInput('');
    };

    // Format currency to IDR
    const formatIDR = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(num);
    };

    const filteredMenus = useMemo(() => {
        return menus.filter(menu => {
            const matchesSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'semua' || menu.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory, menus]);

    // Cart calculation values
    const { subtotal, tax, discountAmount, grandTotal, totalItemsCount } = useMemo(() => {
        let sub = 0;
        let count = 0;
        Object.entries(cart).forEach(([idStr, qty]) => {
            const id = parseInt(idStr);
            const product = menus.find(p => p.id === id);
            if (product) {
                sub += product.price * qty;
                count += qty;
            }
        });

        const disc = (sub * discountPercentage) / 100;
        const tx = (sub - disc) * 0.11; // 11% PPN tax
        const total = sub - disc + tx;

        return {
            subtotal: sub,
            tax: tx,
            discountAmount: disc,
            grandTotal: total,
            totalItemsCount: count
        };
    }, [cart, discountPercentage]);

    // Handle payment
    const paidAmount = paidAmountInput === '' ? 0 : parseFloat(paidAmountInput);
    const changeAmount = Math.max(0, paidAmount - grandTotal);

    // Apply quick cash amounts
    const handleQuickCash = (amount: number) => {
        setPaidAmountInput(amount.toString());
    };

    // Check if checkout button should be active
    const canCheckout = totalItemsCount > 0 && paidAmount >= grandTotal;

    const [submitting, setSubmitting] = useState(false);

    const handleCheckout = () => {
        if (!canCheckout || submitting) return;
        setSubmitting(true);

        const items = Object.entries(cart).map(([menuId, qty]) => {
            const product = menus.find(p => p.id === parseInt(menuId));
            return { menu_id: parseInt(menuId), qty, harga: product?.price || 0 };
        });

        router.post('/kasir/dashboard', {
            items,
            payment_method_id: selectedPaymentMethod,
            bayar: paidAmount,
        }, {
            onSuccess: () => {
                setSubmitting(false);
                setShowReceiptModal(true);
            },
            onError: () => {
                setSubmitting(false);
            },
        });
    };

    const handleResetTransaction = () => {
        handleClearCart();
        generateTransactionId();
        setShowReceiptModal(false);
        router.reload({ only: ['flash'] });
    };

    return (
        <>
            <Head title="Kasir - Dashboard Transaksi" />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans overflow-hidden">
                
                {/* Header (Branding & Cashier Info Only, No Search) */}
                <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-10 shrink-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div>
                            <span className="text-md font-bold tracking-tight text-foreground block mb-1">
                                ChasierApp
                            </span>
                            <span className="text-[10px] text-muted-foreground block -mt-1 font-medium">
                                Point of Sale • UMKM Mode
                            </span>
                        </div>
                    </div>

                    {/* Cashier Info */}
                    <div className="flex items-center gap-4 relative">
                        <div className="hidden sm:flex flex-col text-right select-none">
                            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 justify-end">
                                <User className="h-3.5 w-3.5 text-primary" /> {auth.user?.name || 'Cashier'}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 justify-end">
                                <Clock className="h-3 w-3" /> {currentTime || '--:--:--'}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="h-9 w-9 rounded-sm bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-primary uppercase shadow-inner hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer"
                        >
                            {auth.user?.name?.charAt(0) || 'C'}
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileDropdownOpen && (
                            <>
                                {/* Backdrop to dismiss when clicking outside */}
                                <div 
                                    className="fixed inset-0 z-45"
                                    onClick={() => setIsProfileDropdownOpen(false)}
                                />
                                <div className="absolute right-0 top-11 w-48 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800 dark:text-slate-200">
                                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{auth.user?.name || 'Cashier'}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">{auth.user?.email || ''}</p>
                                    </div>
                                    <Link 
                                        href="/kasir/profile"
                                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 cursor-pointer transition-colors"
                                    >
                                        <User className="h-3.5 w-3.5 text-slate-400" />
                                        <span>Profil Saya</span>
                                    </Link>
                                    <Link 
                                        href="/kasir/settings"
                                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 cursor-pointer transition-colors"
                                    >
                                        <Settings className="h-3.5 w-3.5 text-slate-400" />
                                        <span>Pengaturan</span>
                                    </Link>
                                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                                    <Link 
                                        href="/auth/login"
                                        className="w-full text-left px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/5 flex items-center gap-2 cursor-pointer transition-colors"
                                    >
                                        <LogOut className="h-3.5 w-3.5" />
                                        <span>Keluar (Log Out)</span>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Main Content Layout */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    
                    {/* Left Column: Product Catalog Grid & Aligned Filter */}
                    <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
                        
                        {/* Categories navigation & Search parallel in one row */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                            
                            {/* Categories navigation tabs */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                                {['semua', ...categories].map((cat) => {
                                    const active = selectedCategory === cat;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer select-none ${
                                                active 
                                                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10' 
                                                    : 'bg-white dark:bg-slate-950 text-muted-foreground border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Search bar on the right side, parallel with categories */}
                            <div className="w-full sm:w-64 md:w-80 relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <Search className="h-4 w-4" />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Cari menu di sini..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9 w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-sm"
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Portrait Product Cards Grid container */}
                        <div className="flex-1 overflow-y-auto pr-1">
                            {filteredMenus.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                                    {filteredMenus.map((product) => {
                                        const qty = cart[product.id] || 0;

                                        return (
                                            <div 
                                                key={product.id}
                                                onClick={() => handleAddToCart(product.id)}
                                                className={`group relative aspect-3/4 w-full rounded-[28px] border overflow-hidden select-none transition-all duration-300 shadow-sm bg-slate-100 dark:bg-slate-900 ${
                                                    qty > 0 
                                                        ? 'border-primary ring-4 ring-primary/10 scale-[0.98]' 
                                                        : 'border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md cursor-pointer'
                                                }`}
                                            >
                                                {/* Full Cover Product Image */}
                                                {product.image ? (
                                                    <img 
                                                        src={product.image} 
                                                        alt={product.name} 
                                                        className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105" 
                                                    />
                                                ) : (
                                                    <div className="w-full h-full absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                                        <ShoppingBag className="h-12 w-12 text-slate-400" />
                                                    </div>
                                                )}

                                                {/* Dark Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                                                {/* Blurred Text overlay at the bottom */}
                                                <div className="absolute bottom-0 inset-x-0 p-4 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border-t border-white/20 dark:border-white/5 flex flex-col justify-end">
                                                    <span className="text-[8px] uppercase font-bold text-white tracking-wider mb-0.5">
                                                        {product.category}
                                                    </span>
                                                    <h3 className="text-md font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-sm font-black text-white mt-0.5">
                                                        {formatIDR(product.price)}
                                                    </p>
                                                </div>

                                                {/* Floating Component Overlay for Plus-Minus Controls when Qty > 0 */}
                                                {qty > 0 && (
                                                    <div 
                                                        className="absolute inset-0 bg-slate-950/30 dark:bg-slate-950/50 backdrop-blur-[3px] flex items-center justify-center z-10 transition-all duration-300"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="bg-white dark:bg-slate-900 rounded-full shadow-xl border border-slate-200/50 dark:border-slate-800 p-1.5 flex items-center gap-3 animate-in zoom-in-95 duration-150">
                                                            <button
                                                                onClick={() => handleSubtractFromCart(product.id)}
                                                                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 cursor-pointer transition-colors shadow-sm"
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </button>
                                                            <span className="text-sm font-black text-slate-950 dark:text-white min-w-[20px] text-center">
                                                                {qty}
                                                            </span>
                                                            <button
                                                                onClick={() => handleAddToCart(product.id)}
                                                                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 cursor-pointer transition-colors shadow-sm"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col justify-center items-center text-center p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl">
                                    <ShoppingBag className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
                                    <h3 className="text-sm font-bold text-foreground">Menu tidak ditemukan</h3>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-[260px]">
                                        Silakan ketik kata kunci pencarian lain atau pilih kategori yang berbeda.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Checkout Cart Panel */}
                    <div className="w-full md:w-[350px] lg:w-[400px] bg-white dark:bg-slate-950 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shrink-0 shadow-xl relative">
                        
                        {/* Cart Header */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <Receipt className="h-4.5 w-4.5 text-primary" />
                                <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                                    Daftar Pesanan
                                </h2>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                                    {totalItemsCount}
                                </span>
                            </div>
                            
                            {totalItemsCount > 0 && (
                                <button
                                    onClick={handleClearCart}
                                    className="text-xs text-destructive hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                    <Trash2 className="h-3.5 w-3.5" /> Bersihkan
                                </button>
                            )}
                        </div>

                        {/* Order Item List container */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {totalItemsCount > 0 ? (
                                Object.entries(cart).map(([idStr, qty]) => {
                                    const id = parseInt(idStr);
                                    const product = menus.find(p => p.id === id);
                                    if (!product) return null;

                                    return (
                                        <div 
                                            key={product.id}
                                            className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-xl"
                                        >
                                            <div className="flex-1">
                                                <h4 className="text-xs font-bold text-foreground">
                                                    {product.name}
                                                </h4>
                                                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                                    {formatIDR(product.price)} / unit
                                                </p>
                                                <div className="flex justify-between items-center mt-2">
                                                    {/* Quantity control */}
                                                    <div className="flex items-center gap-2.5">
                                                        <button
                                                            onClick={() => handleSubtractFromCart(product.id)}
                                                            className="h-6 w-6 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-100 cursor-pointer shadow-sm"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[12px] text-center">
                                                            {qty}
                                                        </span>
                                                        <button
                                                            onClick={() => handleAddToCart(product.id)}
                                                            className="h-6 w-6 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-100 cursor-pointer shadow-sm"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>

                                                    {/* Total price for product */}
                                                    <span className="text-xs font-bold text-foreground">
                                                        {formatIDR(product.price * qty)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <button
                                                onClick={() => handleRemoveFromCart(product.id)}
                                                className="text-slate-400 hover:text-destructive shrink-0 self-start p-1 cursor-pointer transition-colors"
                                                title="Hapus item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex flex-col justify-center items-center text-center p-6">
                                    <ShoppingBag className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-3" />
                                    <p className="text-xs text-slate-400 font-medium">Keranjang Belanja Kosong</p>
                                    <p className="text-[11px] text-slate-400 font-light mt-0.5 max-w-[200px]">
                                        Silakan klik produk di sebelah kiri untuk ditambahkan ke pesanan.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Calculations Breakdowns (Fixed at Bottom) */}
                        <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 space-y-3 shrink-0">
                            
                            {/* Summary Numbers */}
                            <div className="space-y-1.5 text-xs text-muted-foreground font-medium">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-foreground">{formatIDR(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Diskon (%)</span>
                                    <div className="flex items-center gap-1.5">
                                        <select 
                                            value={discountPercentage} 
                                            onChange={(e) => setDiscountPercentage(parseInt(e.target.value))}
                                            className="h-6 text-[11px] font-semibold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-1 cursor-pointer"
                                        >
                                            <option value="0">0%</option>
                                            <option value="5">5%</option>
                                            <option value="10">10%</option>
                                            <option value="15">15%</option>
                                            <option value="20">20%</option>
                                        </select>
                                        {discountAmount > 0 && (
                                            <span className="text-destructive font-semibold">
                                                -{formatIDR(discountAmount)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span>Pajak (PPN 11%)</span>
                                    <span className="text-foreground">{formatIDR(tax)}</span>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-800/80 pt-2 flex justify-between text-sm font-bold text-foreground">
                                    <span>Total Bayar</span>
                                    <span className="text-primary text-base font-black">{formatIDR(grandTotal)}</span>
                                </div>
                            </div>

                            {/* Payment Section (Input & Quick Options) */}
                            {totalItemsCount > 0 && (
                                <div className="space-y-2.5 pt-1">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                            Nominal Diterima (Rp)
                                        </label>
                                        <div className="relative group">
                                            <Input
                                                type="number"
                                                placeholder="Masukkan nominal bayar..."
                                                value={paidAmountInput}
                                                onChange={(e) => setPaidAmountInput(e.target.value)}
                                                className="h-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 focus-visible:border-primary font-bold rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Quick Cash selections */}
                                    <div className="grid grid-cols-4 gap-1.5">
                                        <button
                                            onClick={() => handleQuickCash(grandTotal)}
                                            className="py-1 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-[10px] font-bold text-slate-600 dark:text-slate-400 cursor-pointer shadow-sm"
                                        >
                                            Uang Pas
                                        </button>
                                        {[20000, 50000, 100000].map((amt) => (
                                            <button
                                                key={amt}
                                                onClick={() => handleQuickCash(amt)}
                                                className="py-1 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-[10px] font-bold text-slate-600 dark:text-slate-400 cursor-pointer shadow-sm"
                                            >
                                                {formatIDR(amt).replace('Rp', '').trim()}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Change (Kembalian) display */}
                                    {paidAmount > 0 && (
                                        <div className={`flex items-center justify-between p-2 rounded-lg text-xs font-bold ${
                                            paidAmount >= grandTotal 
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                : 'bg-destructive/10 text-destructive'
                                        }`}>
                                            <span>{paidAmount >= grandTotal ? 'Kembalian' : 'Kekurangan'}</span>
                                            <span>
                                                {paidAmount >= grandTotal 
                                                    ? formatIDR(changeAmount) 
                                                    : formatIDR(grandTotal - paidAmount)
                                                }
                                            </span>
                                        </div>
                                    )}

                                    {/* Checkout Button */}
                                    <Button
                                        onClick={handleCheckout}
                                        disabled={!canCheckout}
                                        className="w-full h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-lg shadow-md shadow-primary/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]"
                                    >
                                        <span>Proses Transaksi</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Thermal Receipt Simulator Success Modal */}
                {showReceiptModal && (
                    <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 w-full max-w-[360px] flex flex-col gap-5 select-none relative animate-in fade-in zoom-in-95 duration-200">
                            
                            {/* Success Icon */}
                            <div className="flex flex-col items-center text-center gap-1">
                                <div className="h-11 w-11 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mt-2">
                                    Transaksi Berhasil
                                </h3>
                                <p className="text-[10px] text-slate-500 font-medium">Struk pembayaran dicetak</p>
                            </div>

                            {/* Simulated Receipt paper paper container */}
                            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 text-xs font-mono space-y-4 text-slate-700 shadow-sm relative overflow-hidden">
                                
                                {/* Receipt Header */}
                                <div className="text-center space-y-1">
                                    <h4 className="font-extrabold text-sm text-slate-800">ChasierApp POS</h4>
                                    <p className="text-[9px] text-slate-500">Jl. Raya UMKM Sukses No. 12</p>
                                    <p className="text-[9px] text-slate-500">Telp: 0812-3456-7890</p>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-slate-300 border-dashed" />

                                {/* Meta details */}
                                <div className="text-[9px] space-y-0.5 text-slate-500">
                                    <div className="flex justify-between">
                                        <span>No. Struk</span>
                                        <span className="font-bold text-slate-700">{transactionNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Kasir</span>
                                        <span className="font-bold text-slate-700">{auth.user?.name || 'Cashier'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Waktu</span>
                                        <span className="font-bold text-slate-700">{new Date().toLocaleDateString('id-ID')} {currentTime}</span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-slate-300 border-dashed" />

                                {/* Bought Items */}
                                <div className="space-y-2 text-[10px]">
                                    {receiptData?.transaction ? (
                                        receiptData.transaction.items.map((item, idx) => {
                                            const product = menus.find(m => m.id === item.menu_id);
                                            return (
                                                <div key={idx} className="space-y-0.5">
                                                    <div className="flex justify-between font-bold text-slate-800">
                                                        <span>{product?.name || 'Menu #'+item.menu_id}</span>
                                                        <span>{formatIDR(item.harga * item.qty)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-[9px] text-slate-500 pl-1">
                                                        <span>{item.qty} x {formatIDR(item.harga)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        Object.entries(cart).map(([idStr, qty]) => {
                                            const id = parseInt(idStr);
                                            const product = menus.find(p => p.id === id);
                                            if (!product) return null;

                                            return (
                                                <div key={product.id} className="space-y-0.5">
                                                    <div className="flex justify-between font-bold text-slate-800">
                                                        <span>{product.name}</span>
                                                        <span>{formatIDR(product.price * qty)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-[9px] text-slate-500 pl-1">
                                                        <span>{qty} x {formatIDR(product.price)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-slate-300 border-dashed" />

                                {/* Calculations */}
                                <div className="space-y-1 text-[10px]">
                                    {receiptData?.transaction ? (
                                        <>
                                            <div className="flex justify-between font-extrabold text-slate-900 border-t border-slate-200 border-dashed pt-0 mt-0">
                                                <span>TOTAL</span>
                                                <span>{formatIDR(receiptData.transaction.total)}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex justify-between">
                                                <span>Subtotal</span>
                                                <span>{formatIDR(subtotal)}</span>
                                            </div>
                                            {discountAmount > 0 && (
                                                <div className="flex justify-between text-destructive">
                                                    <span>Diskon ({discountPercentage}%)</span>
                                                    <span>-{formatIDR(discountAmount)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span>PPN (11%)</span>
                                                <span>{formatIDR(tax)}</span>
                                            </div>
                                            <div className="flex justify-between font-extrabold text-slate-900 border-t border-slate-200 border-dashed pt-1 mt-1">
                                                <span>TOTAL</span>
                                                <span>{formatIDR(grandTotal)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-slate-300 border-dashed" />

                                {/* Payment details */}
                                <div className="space-y-1 text-[10px]">
                                    {receiptData?.transaction ? (
                                        <>
                                            <div className="flex justify-between text-slate-600">
                                                <span>Tunai</span>
                                                <span>{formatIDR(receiptData.transaction.bayar)}</span>
                                            </div>
                                            <div className="flex justify-between text-slate-600">
                                                <span>Kembalian</span>
                                                <span>{formatIDR(receiptData.transaction.kembalian)}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex justify-between text-slate-600">
                                                <span>Tunai</span>
                                                <span>{formatIDR(paidAmount)}</span>
                                            </div>
                                            <div className="flex justify-between text-slate-600">
                                                <span>Kembalian</span>
                                                <span>{formatIDR(changeAmount)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Footer message */}
                                <div className="text-center text-[9px] text-slate-500 pt-3 border-t border-slate-200 border-dashed">
                                    Terima kasih atas kunjungan Anda
                                </div>
                            </div>

                            {/* Action Reset Button */}
                            <Button
                                onClick={handleResetTransaction}
                                className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-sm cursor-pointer"
                            >
                                Transaksi Baru
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
