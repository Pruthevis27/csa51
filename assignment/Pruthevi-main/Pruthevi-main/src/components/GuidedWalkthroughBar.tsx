import React from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Sparkles,
  X,
  FilePlus2,
  Hash,
  KeyRound,
  PenTool,
  ShieldCheck,
  Edit3,
  AlertTriangle,
} from 'lucide-react';
import { useEHR } from '../context/EHRContext';
import { AppView } from '../types';

export const GuidedWalkthroughBar: React.FC = () => {
  const {
    isGuidedMode,
    setIsGuidedMode,
    guidedStep,
    setGuidedStep,
    setCurrentView,
    hashes,
    keyPair,
    signatureResult,
    verificationResult,
    tamperResult,
  } = useEHR();

  if (!isGuidedMode) return null;

  const steps = [
    {
      id: 1,
      title: 'Create EHR',
      desc: 'Formulate canonical health record',
      view: 'create-ehr' as AppView,
      isDone: true,
      icon: FilePlus2,
    },
    {
      id: 2,
      title: 'Generate Hashes',
      desc: 'Compute SHA-256 & SHA-3-256',
      view: 'hashing' as AppView,
      isDone: !!hashes.sha256,
      icon: Hash,
    },
    {
      id: 3,
      title: 'Generate RSA Keys',
      desc: 'Create RSA-2048 provider key pair',
      view: 'signature' as AppView,
      isDone: !!keyPair,
      icon: KeyRound,
    },
    {
      id: 4,
      title: 'Sign EHR',
      desc: 'Sign digest with RSA-PSS',
      view: 'signature' as AppView,
      isDone: !!signatureResult,
      icon: PenTool,
    },
    {
      id: 5,
      title: 'Verify Original',
      desc: 'Confirm valid signature & integrity',
      view: 'verification' as AppView,
      isDone: verificationResult?.valid === true,
      icon: ShieldCheck,
    },
    {
      id: 6,
      title: 'Modify EHR',
      desc: 'Simulate transit tamper attack',
      view: 'tamper-test' as AppView,
      isDone: true,
      icon: Edit3,
    },
    {
      id: 7,
      title: 'Detect Tampering',
      desc: 'Verify altered EHR & detect forgery',
      view: 'tamper-test' as AppView,
      isDone: tamperResult?.tamperingDetected === true,
      icon: AlertTriangle,
    },
  ];

  const handleStepClick = (stepIndex: number, view: AppView) => {
    setGuidedStep(stepIndex);
    setCurrentView(view);
  };

  const currentStepObj = steps[guidedStep - 1] || steps[0];

  return (
    <div className="bg-[#D6D4CF] border-b border-[#141414]/15 px-6 py-2.5 flex items-center justify-between text-xs text-[#141414]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-bold text-[#141414]">
          <Sparkles className="w-4 h-4 text-[#141414]" />
          <span className="tracking-wide font-mono">7-STEP VIVA WALKTHROUGH</span>
        </div>
        <span className="text-[#141414]/30 hidden lg:inline font-mono">|</span>
        <span className="text-[#141414]/70 font-medium hidden lg:inline">
          Step {guidedStep} of 7: <strong className="text-[#141414] font-bold">{currentStepObj.title}</strong> — {currentStepObj.desc}
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {steps.map((step) => {
          const isActive = guidedStep === step.id;
          const isDone = step.isDone;

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id, step.view)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer font-mono ${
                isActive
                  ? 'bg-[#141414] text-[#E4E3E0] font-bold shadow-xs'
                  : isDone
                  ? 'bg-white text-[#15803D] border border-[#15803D]/30 hover:bg-[#F5F4F0]'
                  : 'bg-white/60 text-[#141414]/60 hover:text-[#141414] border border-[#141414]/15'
              }`}
            >
              <span>{step.id}.</span>
              <span className="hidden sm:inline font-sans">{step.title}</span>
              {isDone && !isActive && <CheckCircle2 className="w-3 h-3 text-[#15803D]" />}
            </button>
          );
        })}

        <button
          onClick={() => setIsGuidedMode(false)}
          className="ml-2 p-1 rounded hover:bg-[#141414]/10 text-[#141414]/60 hover:text-[#141414] cursor-pointer"
          title="Exit Guided Mode"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
