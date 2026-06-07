import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="POS UMKM" />
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-primary">POS UMKM</h1>
                    <p className="text-muted-foreground">Point of Sale untuk UMKM</p>
                    <a
                        href="/login"
                        className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition"
                    >
                        Login
                    </a>
                </div>
            </div>
        </>
    );
}
