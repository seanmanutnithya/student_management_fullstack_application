import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import gsap from "gsap";

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  info: Info,
  error: AlertCircle,
};

export function ToastProvider({ children }) {
  const [toastState, setToastState] = useState(null);
  const toastRef = useRef(null);
  const timerRef = useRef(null);

  const show = useCallback((message, type) => {
    setToastState({ message, type });
    clearTimeout(timerRef.current);
    requestAnimationFrame(() => {
      if (!toastRef.current) return;
      gsap.killTweensOf(toastRef.current);
      gsap.fromTo(
        toastRef.current,
        { xPercent: -50, y: 24, opacity: 0 },
        {
          xPercent: -50,
          y: 0,
          opacity: 1,
          duration: 0.32,
          ease: "back.out(1.6)",
        },
      );
    });
    timerRef.current = setTimeout(() => {
      if (!toastRef.current) {
        setToastState(null);
        return;
      }
      gsap.to(toastRef.current, {
        xPercent: -50,
        y: 24,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => setToastState(null),
      });
    }, 2600);
  }, []);

  const toast = useMemo(
    () => ({
      success: (message) => show(message, "success"),
      info: (message) => show(message, "info"),
      error: (message) => show(message, "error"),
    }),
    [show],
  );

  const Icon = toastState ? ICONS[toastState.type] : null;

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {toastState && (
        <div className="toast" ref={toastRef}>
          {Icon && <Icon />}
          <span>{toastState.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used inside <ToastProvider>");
  return { toast };
}
