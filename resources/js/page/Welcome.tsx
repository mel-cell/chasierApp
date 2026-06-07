import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Welcome() {
    const [letterIdx, setLetterIdx] = useState(0);
    const [showSubtitle, setShowSubtitle] = useState(false);
    const fullText = 'ChasierApp';

    useEffect(() => {
        if (letterIdx < fullText.length) {
            const t = setTimeout(() => setLetterIdx((i) => i + 1), 70);
            return () => clearTimeout(t);
        }
        if (letterIdx === fullText.length) {
            const t = setTimeout(() => setShowSubtitle(true), 300);
            return () => clearTimeout(t);
        }
    }, [letterIdx]);

    useEffect(() => {
        if (showSubtitle) {
            const t = setTimeout(() => router.visit('/auth/login'), 1200);
            return () => clearTimeout(t);
        }
    }, [showSubtitle]);

    return (
        <>
            <Head title="ChasierApp" />
            <div className="min-h-screen bg-gradient-to-br from-primary/95 via-primary to-primary/85 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-white font-sans tracking-tight mb-4">
                        {fullText.split('').map((char, i) => (
                            <span
                                key={i}
                                className="inline-block"
                                style={{
                                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                                    opacity: i < letterIdx ? 1 : 0,
                                    transform: i < letterIdx ? 'translateY(0)' : 'translateY(12px)',
                                }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </h1>

                    <div
                        style={{
                            transition: 'opacity 0.8s ease, transform 0.8s ease',
                            opacity: showSubtitle ? 1 : 0,
                            transform: showSubtitle ? 'translateY(0)' : 'translateY(10px)',
                        }}
                    >
                        <p className="text-white/65 text-lg font-light tracking-wide">
                            Point of Sale Modern untuk UMKM
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
