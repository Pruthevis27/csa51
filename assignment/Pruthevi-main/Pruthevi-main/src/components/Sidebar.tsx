import React from 'react';
import {
  LayoutDashboard,
  FilePlus2,
  Hash,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  Info,
  Shield,
  CheckCircle2,
  Lock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useEHR } from '../context/EHRContext';
import { AppView } from '../types';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    keyPair,
    signatureResult,
    ehrDoc,
    resetAllState,
    isGuidedMode,
    setIsGuidedMode,
  } = useEHR();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create-ehr', label: 'Create EHR', icon: FilePlus2, badge: ehrDoc.patientId },
    { id: 'hashing', label: 'Hashing', icon: Hash },
    { id: 'signature', label: 'Digital Signature', icon: KeyRound, badge: signatureResult ? 'Signed' : undefined, badgeColor: 'bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20' },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'tamper-test', label: 'Tamper Test', icon: AlertTriangle, badge: 'Viva Demo', badgeColor: 'bg-[#B45309]/10 text-[#B45309] border border-[#B45309]/20' },
    { id: 'evaluation', label: 'Evaluation', icon: BarChart3 },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <aside className="w-64 bg-[#DCDAD5] border-r border-[#141414]/15 flex flex-col h-screen shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#141414]/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#141414] flex items-center justify-center shadow-xs">
            <Shield className="w-5 h-5 text-[#E4E3E0]" />
          </div>
          <div>
            <h1 className="font-bold text-[#141414] text-sm tracking-tight leading-none">
              EHR Security System
            </h1>
            <p className="text-[11px] text-[#141414]/60 font-medium tracking-wide mt-1 font-mono">
              Medical Integrity & Auth
            </p>
          </div>
        </div>
      </div>

      {/* Guided Walkthrough Quick Button */}
      <div className="px-3 pt-3">
        <button
          onClick={() => setIsGuidedMode(!isGuidedMode)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            isGuidedMode
              ? 'bg-[#141414] text-[#E4E3E0] shadow-xs'
              : 'bg-white hover:bg-[#F5F4F0] text-[#141414] border border-[#141414]/20'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${isGuidedMode ? 'text-[#E4E3E0]' : 'text-[#141414]'}`} />
            <span>Guided 7-Step Demo</span>
          </div>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
              isGuidedMode ? 'bg-[#282828] text-[#E4E3E0]' : 'bg-[#E4E3E0] text-[#141414]'
            }`}
          >
            {isGuidedMode ? 'Active' : 'Start'}
          </span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold tracking-wider text-[#141414]/50 uppercase px-3 py-1 font-mono">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                isActive
                  ? 'bg-[#141414] text-[#E4E3E0] font-semibold shadow-xs'
                  : 'text-[#141414]/70 hover:text-[#141414] hover:bg-[#141414]/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E4E3E0]' : 'text-[#141414]/60'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeColor || 'bg-white text-[#141414] border border-[#141414]/20'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Cryptographic Session Summary Card */}
      <div className="p-3 border-t border-[#141414]/15 bg-[#DCDAD5]">
        <div className="bg-white rounded-lg p-2.5 border border-[#141414]/15 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#141414]/70">
            <span className="flex items-center gap-1.5 font-semibold text-[#141414]">
              <Lock className="w-3.5 h-3.5 text-[#141414]" />
              Crypto Engine
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-[#15803D] font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
              RSA-2048/PSS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono">
            <div className="bg-[#F5F4F0] p-1.5 rounded border border-[#141414]/10 flex flex-col">
              <span className="text-[#141414]/50">Key Pair</span>
              <span className={keyPair ? 'text-[#15803D] font-bold' : 'text-[#141414]/40'}>
                {keyPair ? 'Generated' : 'Pending'}
              </span>
            </div>
            <div className="bg-[#F5F4F0] p-1.5 rounded border border-[#141414]/10 flex flex-col">
              <span className="text-[#141414]/50">Signature</span>
              <span className={signatureResult ? 'text-[#15803D] font-bold' : 'text-[#141414]/40'}>
                {signatureResult ? 'Signed' : 'None'}
              </span>
            </div>
          </div>

          <button
            onClick={resetAllState}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] py-1.5 px-2 rounded bg-[#F5F4F0] hover:bg-[#EAE8E3] text-[#141414] transition-colors border border-[#141414]/15 font-medium"
          >
            <RotateCcw className="w-3 h-3 text-[#141414]/60" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
