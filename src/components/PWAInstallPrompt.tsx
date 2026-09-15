import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt if user has not dismissed it recently
      const hasDismissed = localStorage.getItem("pwaPromptDismissed");
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Also check if app is already installed
    window.addEventListener("appinstalled", () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember dismissal for a while
    localStorage.setItem("pwaPromptDismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 flex items-start gap-4 animate-in slide-in-from-bottom-5">
      <div className="bg-indigo-100 p-2 rounded-xl shrink-0">
        <Download className="w-6 h-6 text-indigo-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 text-sm">Install App</h3>
        <p className="text-slate-500 text-xs mt-1 leading-snug">
          Install Payment Tracker App to your device for quick access and better experience.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700"
          >
            Install Now
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-200"
          >
            Not now
          </button>
        </div>
      </div>
      <button onClick={handleDismiss} className="text-slate-400 hover:text-slate-600 absolute top-2 right-2 p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
