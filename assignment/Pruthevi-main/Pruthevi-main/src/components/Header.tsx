import React from 'react';
import {
  ShieldCheck,
  History,
  CheckCircle2,
  AlertCircle,
  FileText,
  Key,
  PenTool,
  Sparkles,
} from 'lucide-react';
import { useEHR } from '../context/EHRContext';

interface HeaderProps {
  onOpenAuditLog: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuditLog }) => {
  const {
    currentView,
    ehrDoc,
    keyPair,
    signatureResult,
    auditLogs,
    isGuidedMode,
    setIsGuidedMode,
  } = useEHR();

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return {
          title: 'Dashboard Overview',
          subtitle: 'Medical Document Integrity & Cryptographic Authentication Architecture',
        };
      case 'create-ehr':
        return {
          title: 'Create Electronic Health Record',
          subtitle: 'Canonical Data Structuring & Clinical Ingestion Form',
        };
      case 'hashing':
        return {
          title: 'Cryptographic Hashing Module',
          subtitle: 'SHA-256 vs SHA-3-256 Digest Analysis and Avalanche Verification',
        };
      case 'signature':
        return {
          title: 'RSA-2048 & RSA-PSS Digital Signature',
          subtitle: 'Asymmetric Key Generation & Authenticated Message Signing',
        };
      case 'verification':
        return {
          title: 'Digital Signature Verification',
          subtitle: 'Mathematical Integrity Check & Provider Identity Authentication',
        };
      case 'tamper-test':
        return {
          title: 'EHR Tamper Detection & Viva Demonstration',
          subtitle: 'Side-by-Side Document Modification & Signature Invalidation Analysis',
        };
      case 'evaluation':
        return {
          title: 'Cryptographic Evaluation & Benchmarking',
          subtitle: 'Security Trade-offs, Performance Timing & Recommended Academic Protocol',
        };
      case 'about':
        return {
          title: 'About Academic Project',
          subtitle: 'Course Outcomes, SDG Alignment & Cryptographic Compliance Matrix',
        };
      default:
        return { title: 'EHR Security System', subtitle: 'Cryptographic Security Dashboard' };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="h-16 bg-[#E4E3E0]/90 backdrop-blur border-b border-[#141414]/15 px-6 flex items-center justify-between z-10 shrink-0">
      {/* Title Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-[#141414]">{title}</h2>
          <span className="text-[#141414]/30 text-xs hidden sm:inline font-mono">|</span>
          <span className="text-xs text-[#141414]/60 font-medium hidden sm:inline font-mono">{subtitle}</span>
        </div>
      </div>

      {/* Live Status Indicators & Actions */}
      <div className="flex items-center gap-3">
        {/* Status Pills */}
        <div className="hidden lg:flex items-center gap-2 bg-white p-1 rounded-lg border border-[#141414]/15 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F5F4F0] text-[#141414]">
            <FileText className="w-3 h-3 text-[#141414]/70" />
            <span>ID: {ehrDoc.patientId}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F5F4F0]">
            <Key className={`w-3 h-3 ${keyPair ? 'text-[#15803D]' : 'text-[#141414]/40'}`} />
            <span className={keyPair ? 'text-[#15803D] font-bold' : 'text-[#141414]/50'}>
              {keyPair ? '2048-bit Key' : 'No Key'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F5F4F0]">
            <PenTool className={`w-3 h-3 ${signatureResult ? 'text-[#15803D]' : 'text-[#141414]/40'}`} />
            <span className={signatureResult ? 'text-[#15803D] font-bold' : 'text-[#141414]/50'}>
              {signatureResult ? 'Signed' : 'Unsigned'}
            </span>
          </div>
        </div>

        {/* Audit Log Trigger */}
        <button
          onClick={onOpenAuditLog}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F5F4F0] text-[#141414] text-xs font-medium border border-[#141414]/20 transition-colors relative cursor-pointer"
          title="Open Cryptographic Audit Log"
        >
          <History className="w-3.5 h-3.5 text-[#141414]/70" />
          <span className="hidden sm:inline">Audit Log</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#141414]/10 text-[#141414] font-mono font-bold">
            {auditLogs.length}
          </span>
        </button>

        {/* Guided Walkthrough Toggle */}
        <button
          onClick={() => setIsGuidedMode(!isGuidedMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            isGuidedMode
              ? 'bg-[#141414] border-[#141414] text-[#E4E3E0] shadow-xs'
              : 'bg-white hover:bg-[#F5F4F0] border-[#141414]/20 text-[#141414]'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isGuidedMode ? 'text-[#E4E3E0]' : 'text-[#141414]'}`} />
          <span className="hidden md:inline">7-Step Guide</span>
        </button>
      </div>
    </header>
  );
};
