import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    variant: ToastVariant;
    duration: number;
    /** true once the dismiss animation has started */
    leaving: boolean;
}

interface ToastContextValue {
    toast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx;
}

// ─── Single Toast Item ────────────────────────────────────────────────────────

const ICONS: Record<ToastVariant, React.ReactNode> = {
    success: <CheckCircle2 size={18} className="text-lime-600 flex-shrink-0" />,
    error: <XCircle size={18} className="text-red-500 flex-shrink-0" />,
    info: <Info size={18} className="text-blue-500 flex-shrink-0" />,
};

const BORDER: Record<ToastVariant, string> = {
    success: "border-lime-200",
    error: "border-red-200",
    info: "border-blue-200",
};

const PROGRESS: Record<ToastVariant, string> = {
    success: "bg-lime-400",
    error: "bg-red-400",
    info: "bg-blue-400",
};

function ToastItem({
    toast,
    onDismiss,
}: {
    toast: Toast;
    onDismiss: (id: string) => void;
}) {
    const [mounted, setMounted] = useState(false);

    // Trigger enter animation on mount
    useEffect(() => {
        const t = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(t);
    }, []);

    return (
        <div
            className={`relative flex items-start gap-3 w-full max-w-sm bg-white rounded-2xl shadow-lg border px-4 py-3.5
        transition-all duration-300 ease-out overflow-hidden
        ${BORDER[toast.variant]}
        ${mounted && !toast.leaving
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-8"
                }`}
            role="alert"
        >
            {/* Icon */}
            <span className="mt-0.5">{ICONS[toast.variant]}</span>

            {/* Message */}
            <p className="flex-1 text-sm font-medium text-gray-800 leading-snug">
                {toast.message}
            </p>

            {/* Close button */}
            <button
                onClick={() => onDismiss(toast.id)}
                className="mt-0.5 p-0.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none flex-shrink-0"
            >
                <X size={14} />
            </button>

            {/* Progress bar */}
            <div
                className={`absolute bottom-0 left-0 h-0.5 ${PROGRESS[toast.variant]} rounded-full`}
                style={{
                    animation: `toast-progress ${toast.duration}ms linear forwards`,
                }}
            />
        </div>
    );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const dismiss = useCallback((id: string) => {
        // Mark as leaving to trigger exit animation
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
        );
        // Remove after animation completes
        const t = setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
            timers.current.delete(id);
        }, 320);
        timers.current.set(id + "_leave", t);
    }, []);

    const toast = useCallback(
        (message: string, variant: ToastVariant = "success", duration = 3500) => {
            const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            setToasts((prev) => [
                ...prev,
                { id, message, variant, duration, leaving: false },
            ]);

            // Auto-dismiss
            const t = setTimeout(() => dismiss(id), duration);
            timers.current.set(id, t);
        },
        [dismiss]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            timers.current.forEach((t) => clearTimeout(t));
        };
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* Toast portal — fixed top-right */}
            <div
                aria-live="polite"
                className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none"
            >
                {toasts.map((t) => (
                    <div key={t.id} className="pointer-events-auto w-full max-w-sm">
                        <ToastItem toast={t} onDismiss={dismiss} />
                    </div>
                ))}
            </div>

            {/* Progress bar keyframe */}
            <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
        </ToastContext.Provider>
    );
}
