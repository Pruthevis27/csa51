import React from 'react';
import {
  ShieldCheck,
  Fingerprint,
  FileCheck,
  AlertTriangle,
  FilePlus2,
  Hash,
  KeyRound,
  PenTool,
  ArrowRight,
  Shield,
  Lock,
  Sparkles,
  Server,
  Zap,
  Activity,
} from 'lucide-react';
import { useEHR } from '../context/EHRContext';

export const DashboardPage: React.FC = () => {
  const {
    setCurrentView,
    ehrDoc,
    hashes,
    keyPair,
    signatureResult,
    verificationResult,
    tamperResult,
    generateHashes,
    generateKeyPair,
    createSignature,
    setIsGuidedMode,
    setGuidedStep,
  } = useEHR();

  const handleStartDemo = () => {
    setIsGuidedMode(true);
    setGuidedStep(1);
    setCurrentView('create-ehr');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-[#141414]">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-xl bg-white p-8 border border-[#141414]/15 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#141414]/5 border border-[#141414]/15 text-[#141414] text-xs font-mono font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Telemedicine & Cryptographic Security Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#141414] tracking-tight">
            EHR Security System
          </h1>
          <p className="text-base font-semibold text-[#141414]/80">
            Medical Document Integrity & Authentication
          </p>
          <p className="text-[#141414]/70 text-sm leading-relaxed pt-1 font-sans">
            Protect electronic health records using cryptographic hash functions and digital signatures.
            Ensuring patient diagnoses and prescription documents remain unaltered during transit while
            cryptographically verifying provider origin.
          </p>

          <div className="flex flex-wrap gap-3 pt-3">
            <button
              onClick={handleStartDemo}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#141414] hover:bg-[#282828] text-[#E4E3E0] font-bold text-xs shadow-xs transition-all cursor-pointer border border-[#141414]"
            >
              <Sparkles className="w-4 h-4 text-[#E4E3E0]" />
              <span>Launch 7-Step Viva Walkthrough</span>
            </button>
            <button
              onClick={() => setCurrentView('tamper-test')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-[#F5F4F0] text-[#141414] font-semibold text-xs border border-[#141414]/20 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <span>Tamper Detection Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Cryptographic Security */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#141414] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#141414]" />
            Core Security Guarantees
          </h2>
          <span className="text-xs text-[#141414]/50 font-mono">Academic Security Model</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Data Integrity */}
          <div className="bg-white rounded-xl p-5 border border-[#141414]/15 hover:border-[#141414]/40 transition-all space-y-3 group shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#141414]/5 border border-[#141414]/15 flex items-center justify-center text-[#141414] group-hover:scale-105 transition-transform">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#141414] text-sm">Data Integrity</h3>
              <p className="text-xs text-[#141414]/70 mt-1 leading-relaxed">
                Ensures that medical records have not been modified. Cryptographic hashes (SHA-256 / SHA-3) change dramatically upon single-bit alterations.
              </p>
            </div>
            <div className="text-[11px] text-[#141414]/80 font-mono flex items-center gap-1 pt-1 font-bold">
              <span>SHA-256 / SHA-3-256</span>
            </div>
          </div>

          {/* Card 2: Provider Authentication */}
          <div className="bg-white rounded-xl p-5 border border-[#141414]/15 hover:border-[#141414]/40 transition-all space-y-3 group shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#141414]/5 border border-[#141414]/15 flex items-center justify-center text-[#141414] group-hover:scale-105 transition-transform">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#141414] text-sm">Provider Authentication</h3>
              <p className="text-xs text-[#141414]/70 mt-1 leading-relaxed">
                Verifies the identity of the healthcare provider through digital signatures created using their secure private key.
              </p>
            </div>
            <div className="text-[11px] text-[#141414]/80 font-mono flex items-center gap-1 pt-1 font-bold">
              <span>RSA-2048 + SPKI</span>
            </div>
          </div>

          {/* Card 3: Non-Repudiation */}
          <div className="bg-white rounded-xl p-5 border border-[#141414]/15 hover:border-[#141414]/40 transition-all space-y-3 group shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#141414]/5 border border-[#141414]/15 flex items-center justify-center text-[#141414] group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#141414] text-sm">Non-Repudiation</h3>
              <p className="text-xs text-[#141414]/70 mt-1 leading-relaxed">
                Provides indisputable mathematical evidence that the document was signed using the provider's private key and cannot be denied.
              </p>
            </div>
            <div className="text-[11px] text-[#141414]/80 font-mono flex items-center gap-1 pt-1 font-bold">
              <span>RSA-PSS Scheme</span>
            </div>
          </div>

          {/* Card 4: Tamper Detection */}
          <div className="bg-white rounded-xl p-5 border border-[#141414]/15 hover:border-[#141414]/40 transition-all space-y-3 group shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#141414]/5 border border-[#141414]/15 flex items-center justify-center text-[#141414] group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#141414] text-sm">Tamper Detection</h3>
              <p className="text-xs text-[#141414]/70 mt-1 leading-relaxed">
                Detects unauthorized modifications to medical documents during transit across clinics, labs, and pharmacies.
              </p>
            </div>
            <div className="text-[11px] text-[#141414]/80 font-mono flex items-center gap-1 pt-1 font-bold">
              <span>Verification Pipeline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Security Workflow */}
      <div className="bg-white rounded-xl p-6 border border-[#141414]/15 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#141414] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#141414]" />
              Cryptographic Security Pipeline
            </h2>
            <p className="text-xs text-[#141414]/60 font-sans">
              End-to-end mathematical data flow from document creation to verification
            </p>
          </div>
          <span className="text-[11px] bg-[#F5F4F0] px-2.5 py-1 rounded-md text-[#141414] font-mono border border-[#141414]/15 font-bold">
            Real Backend Execution
          </span>
        </div>

        {/* Workflow Diagram Node Flow */}
        <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/15 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[760px] gap-2 text-xs">
            {/* Step 1: EHR Doc */}
            <div className="flex flex-col items-center p-3 rounded-lg bg-white border border-[#141414]/15 w-32 text-center shadow-xs">
              <span className="text-[10px] text-[#141414]/60 font-mono font-bold uppercase mb-1">Source</span>
              <span className="font-bold text-[#141414]">EHR DOCUMENT</span>
              <span className="text-[10px] text-[#141414]/60 font-mono mt-1 truncate max-w-full">
                ID: {ehrDoc.patientId}
              </span>
            </div>

            <ArrowRight className="w-4 h-4 text-[#141414]/40 shrink-0" />

            {/* Step 2: SHA */}
            <div className="flex flex-col items-center p-3 rounded-lg bg-white border border-[#141414]/15 w-36 text-center shadow-xs">
              <span className="text-[10px] text-[#141414]/60 font-mono font-bold uppercase mb-1">Hashing</span>
              <span className="font-bold text-[#141414]">SHA-256 / SHA-3</span>
              <span className="text-[10px] text-[#141414]/60 font-mono mt-1">256-bit Digest</span>
            </div>

            <ArrowRight className="w-4 h-4 text-[#141414]/40 shrink-0" />

            {/* Step 3: Private Key */}
            <div className="flex flex-col items-center p-3 rounded-lg bg-white border border-[#141414]/15 w-36 text-center shadow-xs">
              <span className="text-[10px] text-[#141414]/60 font-mono font-bold uppercase mb-1">Asymmetric</span>
              <span className="font-bold text-[#141414]">RSA-2048 PRIV</span>
              <span className="text-[10px] text-[#15803D] font-mono mt-1 font-bold">RSA-PSS Padding</span>
            </div>

            <ArrowRight className="w-4 h-4 text-[#141414]/40 shrink-0" />

            {/* Step 4: Digital Signature */}
            <div className="flex flex-col items-center p-3 rounded-lg bg-white border border-[#141414]/15 w-36 text-center shadow-xs">
              <span className="text-[10px] text-[#141414]/60 font-mono font-bold uppercase mb-1">Sign</span>
              <span className="font-bold text-[#141414]">DIGITAL SIGNATURE</span>
              <span className="text-[10px] text-[#141414]/60 font-mono mt-1">Base64 Encoded</span>
            </div>

            <ArrowRight className="w-4 h-4 text-[#141414]/40 shrink-0" />

            {/* Step 5: Public Key Verify */}
            <div className="flex flex-col items-center p-3 rounded-lg bg-white border border-[#141414]/15 w-36 text-center shadow-xs">
              <span className="text-[10px] text-[#141414]/60 font-mono font-bold uppercase mb-1">Verify</span>
              <span className="font-bold text-[#141414]">PUBLIC KEY</span>
              <span className="text-[10px] text-[#141414]/60 font-mono mt-1">SPKI Match</span>
            </div>

            <ArrowRight className="w-4 h-4 text-[#141414]/40 shrink-0" />

            {/* Step 6: Outcome */}
            <div className="flex flex-col items-center p-3 rounded-lg bg-white border border-[#15803D]/40 w-32 text-center shadow-xs">
              <span className="text-[10px] text-[#15803D] font-mono font-bold uppercase mb-1">Result</span>
              <span className="font-bold text-[#15803D]">VALID / TAMPERED</span>
              <span className="text-[10px] text-[#141414]/60 font-mono mt-1">Integrity Pass</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Grid */}
      <div>
        <h2 className="text-sm font-bold text-[#141414] mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#141414]" />
          Quick-Action Cryptographic Controls
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Action 1: Create EHR */}
          <button
            onClick={() => setCurrentView('create-ehr')}
            className="flex flex-col items-start p-4 rounded-xl bg-white hover:bg-[#F5F4F0] border border-[#141414]/15 hover:border-[#141414]/40 transition-all text-left group shadow-xs cursor-pointer"
          >
            <div className="p-2 rounded-lg bg-[#141414]/5 text-[#141414] mb-2 group-hover:scale-105 transition-transform border border-[#141414]/10">
              <FilePlus2 className="w-4 h-4" />
            </div>
            <span className="font-bold text-[#141414] text-xs">Create EHR</span>
            <span className="text-[11px] text-[#141414]/60 mt-1">Edit clinical fields & canonical form</span>
          </button>

          {/* Action 2: Hash Document */}
          <button
            onClick={() => {
              generateHashes();
              setCurrentView('hashing');
            }}
            className="flex flex-col items-start p-4 rounded-xl bg-white hover:bg-[#F5F4F0] border border-[#141414]/15 hover:border-[#141414]/40 transition-all text-left group shadow-xs cursor-pointer"
          >
            <div className="p-2 rounded-lg bg-[#141414]/5 text-[#141414] mb-2 group-hover:scale-105 transition-transform border border-[#141414]/10">
              <Hash className="w-4 h-4" />
            </div>
            <span className="font-bold text-[#141414] text-xs">Hash Document</span>
            <span className="text-[11px] text-[#141414]/60 mt-1">Generate SHA-256 & SHA-3 digests</span>
          </button>

          {/* Action 3: Sign Document */}
          <button
            onClick={() => {
              if (!keyPair) generateKeyPair();
              setCurrentView('signature');
            }}
            className="flex flex-col items-start p-4 rounded-xl bg-white hover:bg-[#F5F4F0] border border-[#141414]/15 hover:border-[#141414]/40 transition-all text-left group shadow-xs cursor-pointer"
          >
            <div className="p-2 rounded-lg bg-[#141414]/5 text-[#141414] mb-2 group-hover:scale-105 transition-transform border border-[#141414]/10">
              <PenTool className="w-4 h-4" />
            </div>
            <span className="font-bold text-[#141414] text-xs">Sign Document</span>
            <span className="text-[11px] text-[#141414]/60 mt-1">RSA-PSS with private key</span>
          </button>

          {/* Action 4: Verify Document */}
          <button
            onClick={() => setCurrentView('verification')}
            className="flex flex-col items-start p-4 rounded-xl bg-white hover:bg-[#F5F4F0] border border-[#141414]/15 hover:border-[#141414]/40 transition-all text-left group shadow-xs cursor-pointer"
          >
            <div className="p-2 rounded-lg bg-[#141414]/5 text-[#141414] mb-2 group-hover:scale-105 transition-transform border border-[#141414]/10">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-[#141414] text-xs">Verify Document</span>
            <span className="text-[11px] text-[#141414]/60 mt-1">Validate signature authenticity</span>
          </button>

          {/* Action 5: Test Tampering */}
          <button
            onClick={() => setCurrentView('tamper-test')}
            className="flex flex-col items-start p-4 rounded-xl bg-white hover:bg-[#F5F4F0] border border-[#141414]/15 hover:border-[#141414]/40 transition-all text-left group sm:col-span-2 lg:col-span-1 shadow-xs cursor-pointer"
          >
            <div className="p-2 rounded-lg bg-[#141414]/5 text-[#D97706] mb-2 group-hover:scale-105 transition-transform border border-[#141414]/10">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="font-bold text-[#141414] text-xs">Test Tampering</span>
            <span className="text-[11px] text-[#141414]/60 mt-1">Modify records & detect attacks</span>
          </button>
        </div>
      </div>
    </div>
  );
};
