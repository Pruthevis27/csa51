import React, { useState } from 'react';
import {
  KeyRound,
  PenTool,
  Copy,
  Check,
  Shield,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Info,
} from 'lucide-react';
import { useEHR } from '../context/EHRContext';

export const DigitalSignaturePage: React.FC = () => {
  const {
    canonicalDoc,
    keyPair,
    isGeneratingKeys,
    generateKeyPair,
    signatureResult,
    isSigning,
    createSignature,
    setCurrentView,
    addToast,
    isGuidedMode,
    advanceGuidedStep,
  } = useEHR();

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSig, setCopiedSig] = useState(false);
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);

  const handleKeyGen = async () => {
    await generateKeyPair();
    if (isGuidedMode) {
      advanceGuidedStep();
    }
  };

  const handleSign = async () => {
    await createSignature();
    if (isGuidedMode) {
      advanceGuidedStep();
    }
  };

  const copyText = (text: string, type: 'key' | 'sig' | 'fp') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else if (type === 'sig') {
      setCopiedSig(true);
      setTimeout(() => setCopiedSig(false), 2000);
    } else {
      setCopiedFingerprint(true);
      setTimeout(() => setCopiedFingerprint(false), 2000);
    }
    addToast('info', 'Copied', 'Content copied to clipboard.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#141414]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#141414] tracking-tight flex items-center gap-2.5">
          <KeyRound className="w-6 h-6 text-[#141414]" />
          RSA Key Generation & Digital Signature
        </h1>
        <p className="text-xs text-[#141414]/60 mt-1 max-w-3xl font-sans">
          Generate an asymmetric RSA-2048 key pair and create an authenticated digital signature
          using the probabilistic <strong>RSA-PSS</strong> scheme with <strong>SHA-256</strong> message digest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 1: RSA-2048 Key Pair Generation (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl p-6 border border-[#141414]/15 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#141414]/15 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#141414] flex items-center justify-center text-[#E4E3E0]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[#141414] text-sm font-mono">RSA-2048 Key Pair</h3>
                  <p className="text-[10px] text-[#141414]/60 font-sans">Asymmetric Healthcare Cryptosystem</p>
                </div>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  keyPair
                    ? 'bg-[#15803D]/10 text-[#15803D] border-[#15803D]/20'
                    : 'bg-[#141414]/5 text-[#141414]/60 border-[#141414]/15'
                }`}
              >
                {keyPair ? 'Active Key Pair' : 'No Keys Generated'}
              </span>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
                <span className="text-[10px] text-[#141414]/50 block font-sans">Key Modulus Size</span>
                <span className="font-bold text-[#141414]">2048 bits</span>
              </div>
              <div className="p-2.5 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
                <span className="text-[10px] text-[#141414]/50 block font-sans">Public Exponent (e)</span>
                <span className="font-bold text-[#141414]">65537 (0x10001)</span>
              </div>
            </div>

            {/* Private Key Security Guarantee */}
            <div className="p-3 bg-[#F5F4F0] rounded-xl border border-[#141414]/15 flex items-start gap-2.5 text-xs">
              <Lock className="w-4 h-4 text-[#141414] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#141414] block text-[11px]">
                  Private Key Security Architecture
                </span>
                <p className="text-[11px] text-[#141414]/70 leading-relaxed mt-0.5 font-sans">
                  The RSA private key is securely managed inside backend session memory and{' '}
                  <strong className="text-[#141414] font-bold">never exposed in plaintext</strong> to the client
                  or transmitted over public networks.
                </p>
              </div>
            </div>

            {/* Public Key Display */}
            {keyPair ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#141414]">Public Key (SPKI / PEM):</span>
                  <button
                    onClick={() => copyText(keyPair.publicKeyPem, 'key')}
                    className="text-[#141414] hover:text-black flex items-center gap-1 font-mono font-bold cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3 h-3 text-[#15803D]" /> : <Copy className="w-3 h-3 text-[#141414]" />}
                    <span>{copiedKey ? 'Copied' : 'Copy PEM'}</span>
                  </button>
                </div>

                <div className="p-3 bg-[#141414] text-[#E4E3E0] rounded-xl border border-[#141414] font-mono text-[10px] h-28 overflow-y-auto leading-relaxed whitespace-pre select-all">
                  {keyPair.publicKeyPem}
                </div>

                {/* Fingerprint */}
                <div className="p-2.5 bg-[#F5F4F0] rounded-lg border border-[#141414]/10 text-[10px] font-mono flex items-center justify-between">
                  <div className="truncate mr-2">
                    <span className="text-[#141414]/60">SHA-256 Fingerprint: </span>
                    <span className="text-[#141414] font-bold">{keyPair.publicKeyFingerprint}</span>
                  </div>
                  <button
                    onClick={() => copyText(keyPair.publicKeyFingerprint, 'fp')}
                    className="text-[#141414]/60 hover:text-[#141414] cursor-pointer"
                    title="Copy Fingerprint"
                  >
                    {copiedFingerprint ? <Check className="w-3 h-3 text-[#15803D]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-[#F5F4F0] rounded-xl border border-dashed border-[#141414]/20 text-center text-xs text-[#141414]/60 font-sans">
                Click below to generate a cryptographically secure RSA-2048 key pair.
              </div>
            )}
          </div>

          {/* Button */}
          <button
            onClick={handleKeyGen}
            disabled={isGeneratingKeys}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#141414] hover:bg-[#282828] text-[#E4E3E0] font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer border border-[#141414] mt-4"
          >
            {isGeneratingKeys ? <RefreshCw className="w-4 h-4 animate-spin text-[#E4E3E0]" /> : <KeyRound className="w-4 h-4 text-[#E4E3E0]" />}
            <span>{isGeneratingKeys ? 'Generating 2048-bit Key...' : 'Generate RSA Key Pair'}</span>
          </button>
        </div>

        {/* Section 2: RSA-PSS Digital Signing (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl p-6 border border-[#141414]/15 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#141414]/15 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#141414] flex items-center justify-center text-[#E4E3E0]">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[#141414] text-sm font-mono">RSA-PSS Digital Signature</h3>
                  <p className="text-[10px] text-[#141414]/60 font-sans">Probabilistic Signature Scheme</p>
                </div>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  signatureResult
                    ? 'bg-[#15803D]/10 text-[#15803D] border-[#15803D]/20'
                    : 'bg-[#141414]/5 text-[#141414]/60 border-[#141414]/15'
                }`}
              >
                {signatureResult ? 'Signed' : 'Unsigned'}
              </span>
            </div>

            {/* Pipeline Flow Diagram */}
            <div className="p-3 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 text-[11px] font-mono space-y-1.5">
              <div className="text-[10px] text-[#141414]/60 uppercase font-semibold">Signing Pipeline</div>
              <div className="flex items-center justify-between text-[#141414]">
                <span className="font-bold">Canonical EHR</span>
                <span className="text-[#141414]/40">→</span>
                <span className="font-bold">SHA-256</span>
                <span className="text-[#141414]/40">→</span>
                <span className="font-bold">RSA-PSS PrivKey</span>
                <span className="text-[#141414]/40">→</span>
                <span className="text-[#15803D] font-bold">Signature</span>
              </div>
            </div>

            {/* Signature Specs */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
                <span className="text-[10px] text-[#141414]/50 block font-sans">Algorithm Stack</span>
                <span className="font-bold text-[#141414] text-[11px]">RSA-PSS + SHA-256</span>
              </div>
              <div className="p-2.5 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
                <span className="text-[10px] text-[#141414]/50 block font-sans">Signing Time</span>
                <span className="font-bold text-[#15803D]">
                  {signatureResult ? `${signatureResult.timeMs.toFixed(4)} ms` : '—'}
                </span>
              </div>
            </div>

            {/* Output Signature Display */}
            {signatureResult ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#141414]">Base64 Encoded Signature (256 bytes):</span>
                  <button
                    onClick={() => copyText(signatureResult.signatureBase64, 'sig')}
                    className="text-[#141414] hover:text-black flex items-center gap-1 font-mono font-bold cursor-pointer"
                  >
                    {copiedSig ? <Check className="w-3 h-3 text-[#15803D]" /> : <Copy className="w-3 h-3 text-[#141414]" />}
                    <span>{copiedSig ? 'Copied' : 'Copy Signature'}</span>
                  </button>
                </div>

                <div className="p-3 bg-[#141414] text-[#E4E3E0] rounded-xl border border-[#141414] font-mono text-[10px] break-all h-28 overflow-y-auto leading-relaxed select-all">
                  {signatureResult.signatureBase64}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#15803D] font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span>{signatureResult.status}</span>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-[#F5F4F0] rounded-xl border border-dashed border-[#141414]/20 text-center text-xs text-[#141414]/60 font-sans">
                {keyPair
                  ? 'Ready to sign. Click below to sign the active EHR document.'
                  : 'Please generate an RSA key pair first before signing.'}
              </div>
            )}
          </div>

          {/* Sign Button */}
          <div className="space-y-2 mt-4">
            <button
              onClick={handleSign}
              disabled={isSigning || !keyPair}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#141414] hover:bg-[#282828] text-[#E4E3E0] font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer border border-[#141414]"
            >
              {isSigning ? <RefreshCw className="w-4 h-4 animate-spin text-[#E4E3E0]" /> : <PenTool className="w-4 h-4 text-[#E4E3E0]" />}
              <span>{isSigning ? 'Signing Payload...' : 'Sign EHR Document with RSA-PSS'}</span>
            </button>

            {signatureResult && (
              <button
                onClick={() => setCurrentView('verification')}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-[#141414] hover:text-black font-bold py-1 transition-colors cursor-pointer"
              >
                <span>Proceed to Signature Verification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
