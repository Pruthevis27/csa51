import React from 'react';
import { X, Trash2, CheckCircle2, AlertCircle, ShieldAlert, Info, Clock } from 'lucide-react';
import { useEHR } from '../context/EHRContext';

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({ isOpen, onClose }) => {
  const { auditLogs, clearAuditLogs } = useEHR();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#F5F4F0] border-l border-[#141414]/20 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 text-[#141414]">
        {/* Header */}
        <div className="p-4 border-b border-[#141414]/15 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#141414]" />
            <div>
              <h3 className="font-bold text-[#141414] text-sm">Security Audit History</h3>
              <p className="text-[11px] text-[#141414]/60 font-mono">Chronological cryptographic operations log</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {auditLogs.length > 0 && (
              <button
                onClick={clearAuditLogs}
                className="p-1.5 rounded-lg bg-[#F5F4F0] hover:bg-[#EAE8E3] text-[#141414]/70 hover:text-[#141414] text-xs transition-colors border border-[#141414]/15 cursor-pointer"
                title="Clear Logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#F5F4F0] hover:bg-[#EAE8E3] text-[#141414]/70 hover:text-[#141414] text-xs transition-colors border border-[#141414]/15 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {auditLogs.length === 0 ? (
            <div className="text-center py-12 text-[#141414]/50 text-xs font-mono">
              No cryptographic operations logged yet.
            </div>
          ) : (
            auditLogs.map((log) => {
              let badgeColor = 'bg-[#141414]/10 text-[#141414] border-[#141414]/20';
              let Icon = Info;
              if (log.result === 'VALID' || log.result === 'SUCCESS') {
                badgeColor = 'bg-[#DCFCE7] text-[#15803D] border-[#15803D]/30';
                Icon = CheckCircle2;
              } else if (log.result === 'INVALID') {
                badgeColor = 'bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]/30';
                Icon = AlertCircle;
              } else if (log.result === 'TAMPERED') {
                badgeColor = 'bg-[#FEF3C7] text-[#B45309] border-[#B45309]/30';
                Icon = ShieldAlert;
              }

              return (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-white border border-[#141414]/15 text-xs space-y-1.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-[#141414]">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{log.action}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border font-mono font-bold ${badgeColor}`}
                    >
                      {log.result}
                    </span>
                  </div>
                  <p className="text-[#141414]/70 text-[11px] font-mono break-all">{log.details}</p>
                  <div className="text-[10px] text-[#141414]/50 font-mono text-right">{log.timestamp}</div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#141414]/15 text-[11px] text-[#141414]/60 text-center bg-white font-mono">
          Stored in academic session state for viva inspection.
        </div>
      </div>
    </div>
  );
};
