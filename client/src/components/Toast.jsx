import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

const ToastContext = createContext(null);

// Toast types with corresponding styles and icons
const toastTypes = {
  success: {
    bg: "bg-green-500",
    icon: CheckCircle,
  },
  error: {
    bg: "bg-red-500",
    icon: AlertCircle,
  },
  warning: {
    bg: "bg-amber-500",
    icon: AlertTriangle,
  },
  info: {
    bg: "bg-blue-500",
    icon: Info,
  },
  price: {
    bg: "bg-purple-500",
    icon: AlertTriangle,
  },
};

// Single Toast Component
function ToastItem({ toast, onRemove }) {
  const { type = "info", message, id } = toast;
  const config = toastTypes[type] || toastTypes.info;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div
      className={`${config.bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[400px] animate-slide-in`}
    >
      <Icon size={20} className="shrink-0" />
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// Toast Container Component
export function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-9999 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

// Toast Provider
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => {
      // Limit to 5 toasts max to prevent overflow
      const newToasts = [...prev, { id, message, type }];
      if (newToasts.length > 5) {
        return newToasts.slice(-5);
      }
      return newToasts;
    });
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (message) => addToast(message, "success"),
    error: (message) => addToast(message, "error"),
    warning: (message) => addToast(message, "warning"),
    info: (message) => addToast(message, "info"),
    price: (message) => addToast(message, "price"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export default ToastProvider;
