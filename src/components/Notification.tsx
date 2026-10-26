import React from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import type { NotificationType } from '../types';

const ICON_MAP: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" aria-hidden="true" />,
  info: <Info className="h-5 w-5 text-indigo-600 shrink-0" aria-hidden="true" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" aria-hidden="true" />,
  error: <XCircle className="h-5 w-5 text-rose-600 shrink-0" aria-hidden="true" />,
};

const BORDER_MAP: Record<NotificationType, string> = {
  success: 'border-emerald-200 bg-white/95',
  info: 'border-indigo-200 bg-white/95',
  warning: 'border-amber-200 bg-white/95',
  error: 'border-rose-200 bg-white/95',
};

export const Notification: React.FC = () => {
  const { notifications, dismissNotification } = useCart();

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {notifications.map((item) => (
        <div
          key={item.id}
          role="status"
          className={`pointer-events-auto animate-toast-enter flex items-start gap-3 rounded-2xl border p-4 shadow-xl shadow-slate-900/10 backdrop-blur-md transition-all ${BORDER_MAP[item.type]}`}
        >
          {ICON_MAP[item.type]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="mt-0.5 text-xs text-slate-600 leading-relaxed break-words">
              {item.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => dismissNotification(item.id)}
            aria-label="შეტყობინების დახურვა"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
};
