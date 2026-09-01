import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useEHR } from '../context/EHRContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useEHR();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderColor = 'border-[#15803D]/40';
        let bgColor = 'bg-white';
        let iconColor = 'text-[#15803D]';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderColor = 'border-[#DC2626]/40';
          iconColor = 'text-[#DC2626]';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderColor = 'border-[#D97706]/40';
          iconColor = 'text-[#D97706]';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderColor = 'border-[#141414]/30';
          iconColor = 'text-[#141414]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${borderColor} ${bgColor} shadow-xl text-[#141414] text-xs transition-all animate-in slide-in-from-bottom-2 duration-200`}
          >
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[#141414]">{toast.title}</div>
              <div className="text-[#141414]/70 mt-0.5 break-words font-mono text-[11px]">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#141414]/40 hover:text-[#141414] p-0.5 rounded transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
