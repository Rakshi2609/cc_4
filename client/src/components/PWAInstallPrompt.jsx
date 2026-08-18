import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Sparkles, Check } from 'lucide-react';

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
            setIsInstalled(true);
            return;
        }

        const handleBeforeInstall = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Wait 3 seconds before showing the non-intrusive prompt
            setTimeout(() => {
                setShowPrompt(true);
            }, 3000);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    if (!showPrompt || isInstalled) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white/95 backdrop-blur-xl border border-orange-200/90 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-orange-500/10 text-slate-900"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-tr from-[#ea580c] to-[#f97316] rounded-2xl flex items-center justify-center text-white shadow-md shadow-orange-500/25 flex-shrink-0">
                            <Smartphone size={20} />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                                <Sparkles size={10} />
                                <span>PWA App Ready</span>
                            </div>
                            <h4 className="text-sm font-extrabold text-[#0F172A]">Install CivicPlus</h4>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowPrompt(false)}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Dismiss install prompt"
                    >
                        <X size={16} />
                    </button>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 mb-4 leading-relaxed">
                    Install CivicPlus on your device for instant offline access, camera GPS reporting, and push notifications.
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleInstallClick}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md shadow-orange-500/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Download size={14} />
                        <span>Install App</span>
                    </button>

                    <button
                        onClick={() => setShowPrompt(false)}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                        Later
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
