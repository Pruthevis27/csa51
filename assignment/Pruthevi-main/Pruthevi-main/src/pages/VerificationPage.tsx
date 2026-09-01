import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Key,
  PenTool,
  FileText,
  Zap,
  RotateCcw,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useEHR } from '../context/EHRContext';

export const VerificationPage: React.FC = () => {
  const {
    canonicalDoc,
    signatureResult,
    keyPair,
    verificationResult,
    isVerifying,
    verifyDocument,
    setCurrentView,
    addToast,
    isGuidedMode,
    advanceGuidedStep,
  } = useEHR();

  const [inputDoc, setInputDoc] = useState(canonicalDoc);
  const [inputSig, setInputSig] = useState(signatureResult?.signatureBase64 || '');
  const [inputPubKey, setInputPubKey] = useState(keyPair?.publicKeyPem || '');

  // Keep state in sync with context if updated externally
  useEffect(() => {
    setInputDoc(canonicalDoc);
  }, [canonicalDoc]);

  useEffect(() => {
    if (signatureResult) setInputSig(signatureResult.signatureBase64);
  }, [signatureResult]);

  useEffect(() => {
    if (keyPair) setInputPubKey(keyPair.publicKeyPem);
  }, [keyPair]);

  const handleVerify = async () => {
    if (!inputSig) {
      addToast('warning', 'Missing Signature', 'Please sign the document or paste a valid signature.');
      return;
    }
    if (!inputPubKey) {
      addToast('warning', 'Missing Public Key', 'Please generate or paste an RSA public key.');
      return;
    }

    const res = await verifyDocument(inputDoc, inputSig, inputPubKey);
    if (res?.valid && isGuidedMode) {
      advanceGuidedStep();
    }
  };

  const handleResetToOriginal = () => {
    setInputDoc(canonicalDoc);
    setInputSig(signatureResult?.signatureBase64 || '');
    setInputPubKey(keyPair?.publicKeyPem || '');
    addToast('info', 'Reset', 'Restored verified inputs to authentic values.');
  };

  const handleCorruptSignature = () => {
    if (!inputSig) return;
    // Mutate signature characters
    const corrupted = inputSig.substring(0, 10) + 'XXXX' + inputSig.substring(14);
    setInputSig(corrupted);
    addToast('warning', 'Signature Corrupted', 'Injected 4 corrupted bytes into signature string.');
  };

  const handleTamperDocText = () => {
    setInputDoc((prev) => prev.replace('Metformin 500mg', 'Metformin 2000mg (Unverified)'));
    addToast('warning', 'Payload Altered', 'Modified prescription text in the verification input.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#141414]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#141414] tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-[#141414]" />
          Digital Signature Verification
        </h1>
        <p className="text-xs text-[#141414]/60 mt-1 max-w-3xl font-sans">
          Verifies document authenticity and integrity by reconstructing the SHA-256 digest and executing
          mathematical RSA-PSS verification against the provider&apos;s public key.
        </p>
      </div>

      {/* Verification Pipeline Diagram */}
      <div className="p-4 bg-white rounded-xl border border-[#141414]/15 shadow-xs flex items-center justify-between overflow-x-auto text-xs font-mono">
        <div className="flex items-center gap-3 min-w-[680px]">
          <span className="text-[#141414]/60 font-bold uppercase text-[10px]">Verification Process:</span>
          <span className="px-2 py-1 bg-[#F5F4F0] rounded border border-[#141414]/10 text-[#141414] font-bold">
            Received EHR
          </span>
          <span className="text-[#141414]/40">→</span>
          <span className="px-2 py-1 bg-[#F5F4F0] rounded border border-[#141414]/10 text-[#141414] font-bold">
            SHA-256 Digest
          </span>
          <span className="text-[#141414]/40">→</span>
          <span className="px-2 py-1 bg-[#F5F4F0] rounded border border-[#141414]/10 text-[#141414] font-bold">
            RSA-PSS + Public Key
          </span>
          <span className="text-[#141414]/40">→</span>
          <span className="px-2 py-1 bg-[#141414] rounded border border-[#141414] text-[#E4E3E0] font-bold">
            VALID / INVALID
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-[#141414]/15 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#141414]/15 pb-3">
            <h2 className="text-sm font-bold text-[#141414] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#141414]" />
              Incoming Verification Parameters
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleResetToOriginal}
                className="px-2.5 py-1 rounded bg-white hover:bg-[#F5F4F0] text-[#141414] text-[10px] font-mono font-semibold border border-[#141414]/20 flex items-center gap-1 transition-colors cursor-pointer"
                title="Restore Original Valid Inputs"
              >
                <RotateCcw className="w-3 h-3 text-[#141414]" />
                <span>Original State</span>
              </button>
            </div>
          </div>

          {/* Test Injection Buttons */}
          <div className="p-2.5 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-1.5">
            <span className="text-[10px] font-semibold text-[#141414]/60 uppercase tracking-wider block font-mono">
              Quick Test Injections (Failure Scenarios)
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleTamperDocText}
                className="px-2.5 py-1 rounded-md bg-white hover:bg-[#F5F4F0] text-[#141414] border border-[#141414]/20 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Alter EHR Text
              </button>
              <button
                type="button"
                onClick={handleCorruptSignature}
                className="px-2.5 py-1 rounded-md bg-white hover:bg-[#F5F4F0] text-[#DC2626] border border-[#DC2626]/30 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Corrupt Signature Bytes
              </button>
            </div>
          </div>

          {/* Parameter 1: Canonical EHR Payload */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#141414]">
              1. Received Canonical EHR Document:
            </label>
            <textarea
              rows={5}
              value={inputDoc}
              onChange={(e) => setInputDoc(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#FBFBFA] border border-[#141414]/20 focus:border-[#141414] text-[#141414] text-xs font-mono outline-hidden resize-none leading-relaxed"
            />
          </div>

          {/* Parameter 2: Digital Signature */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#141414]">
              2. Digital Signature (Base64 Encoded):
            </label>
            <textarea
              rows={3}
              value={inputSig}
              onChange={(e) => setInputSig(e.target.value)}
              placeholder="Base64 RSA-PSS signature string..."
              className="w-full px-3 py-2 rounded-lg bg-[#FBFBFA] border border-[#141414]/20 focus:border-[#141414] text-[#141414] text-xs font-mono outline-hidden resize-none break-all"
            />
          </div>

          {/* Parameter 3: Public Key */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#141414]">
              3. Provider RSA-2048 Public Key (SPKI PEM):
            </label>
            <textarea
              rows={3}
              value={inputPubKey}
              onChange={(e) => setInputPubKey(e.target.value)}
              placeholder="-----BEGIN PUBLIC KEY-----..."
              className="w-full px-3 py-2 rounded-lg bg-[#FBFBFA] border border-[#141414]/20 focus:border-[#141414] text-[#141414] text-[10px] font-mono outline-hidden resize-none"
            />
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isVerifying || !inputSig || !inputPubKey}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#141414] hover:bg-[#282828] text-[#E4E3E0] font-extrabold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer border border-[#141414] mt-2"
          >
            {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin text-[#E4E3E0]" /> : <ShieldCheck className="w-4 h-4 text-[#E4E3E0]" />}
            <span>{isVerifying ? 'Executing RSA-PSS Verification...' : 'Verify Signature'}</span>
          </button>
        </div>

        {/* Verification Results Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {verificationResult ? (
            <div
              className={`rounded-xl p-6 border shadow-xs space-y-5 transition-all animate-in fade-in duration-300 ${
                verificationResult.valid
                  ? 'bg-white border-[#15803D]'
                  : 'bg-white border-[#DC2626]'
              }`}
            >
              {/* Status Header */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${
                    verificationResult.valid
                      ? 'bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20'
                      : 'bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20'
                  }`}
                >
                  {verificationResult.valid ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <AlertCircle className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <h2
                    className={`text-lg font-black tracking-tight ${
                      verificationResult.valid ? 'text-[#15803D]' : 'text-[#DC2626]'
                    }`}
                  >
                    {verificationResult.valid ? '✓ SIGNATURE VALID' : '✗ SIGNATURE INVALID'}
                  </h2>
                  <p className="text-[11px] text-[#141414]/60 font-mono">
                    Latency: {verificationResult.timeMs.toFixed(4)} ms
                  </p>
                </div>
              </div>

              {/* Status Matrix */}
              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 flex items-center justify-between">
                  <span className="text-[#141414] font-medium">Document Integrity:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      verificationResult.integrity
                        ? 'bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20'
                        : 'bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20'
                    }`}
                  >
                    {verificationResult.integrity ? 'VALID' : 'FAILED'}
                  </span>
                </div>

                <div className="p-3 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 flex items-center justify-between">
                  <span className="text-[#141414] font-medium">Provider Authentication:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      verificationResult.authentication
                        ? 'bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20'
                        : 'bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20'
                    }`}
                  >
                    {verificationResult.authentication ? 'VERIFIED' : 'NOT VERIFIED'}
                  </span>
                </div>

                <div className="p-3 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 flex items-center justify-between">
                  <span className="text-[#141414] font-medium">Signature Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      verificationResult.valid
                        ? 'bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20'
                        : 'bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20'
                    }`}
                  >
                    {verificationResult.valid ? 'VALID' : 'INVALID'}
                  </span>
                </div>
              </div>

              {/* Message Explanation */}
              <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 text-xs text-[#141414] leading-relaxed font-sans">
                {verificationResult.message}
              </div>

              {/* Next Step CTA */}
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('tamper-test')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-[#F5F4F0] text-[#141414] border border-[#141414]/20 font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  <span>Proceed to Viva Tamper Detection Demo</span>
                  <ArrowRight className="w-4 h-4 text-[#141414]" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 border border-[#141414]/15 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#F5F4F0] flex items-center justify-center mx-auto text-[#141414]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#141414] text-sm">Awaiting Verification</h3>
              <p className="text-xs text-[#141414]/60 leading-relaxed max-w-sm mx-auto font-sans">
                Click &quot;Verify Signature&quot; to execute real backend RSA-PSS mathematical verification.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
