import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Edit3,
  RotateCcw,
  ArrowRight,
  Shield,
  FileText,
  Flame,
  Zap,
  Info,
} from 'lucide-react';
import { useEHR } from '../context/EHRContext';
import { generateCanonicalDocument } from '../utils/canonical';
import { EHRDocument } from '../types';

export const TamperTestPage: React.FC = () => {
  const {
    ehrDoc,
    canonicalDoc,
    hashes,
    signatureResult,
    keyPair,
    modifiedEhrDoc,
    setModifiedEhrDoc,
    tamperResult,
    isTamperTesting,
    runTamperTest,
    resetTamperDoc,
    generateHashes,
    generateKeyPair,
    createSignature,
    setCurrentView,
    addToast,
    isGuidedMode,
    advanceGuidedStep,
  } = useEHR();

  // Local state for modified document inputs
  const [tamperedData, setTamperedData] = useState<EHRDocument>({ ...modifiedEhrDoc });

  // Ensure original prerequisites exist reliably in sequence
  useEffect(() => {
    const initPrereqs = async () => {
      if (!hashes.sha256) {
        await generateHashes();
      }
      let currentKey = keyPair;
      if (!currentKey) {
        currentKey = await generateKeyPair();
      }
      if (!signatureResult && currentKey) {
        await createSignature();
      }
    };
    initPrereqs();
  }, []);

  const handleApplyTamperPreset = (field: keyof EHRDocument, alteredValue: string, label: string) => {
    const updated = { ...tamperedData, [field]: alteredValue };
    setTamperedData(updated);
    setModifiedEhrDoc(updated);
    addToast('warning', 'Tamper Scenario Applied', `Altered ${field} to "${alteredValue}".`);
  };

  const handleFieldChange = (field: keyof EHRDocument, value: string) => {
    const updated = { ...tamperedData, [field]: value };
    setTamperedData(updated);
    setModifiedEhrDoc(updated);
  };

  const handleExecuteTamperTest = async () => {
    await runTamperTest(tamperedData);
    if (isGuidedMode) {
      advanceGuidedStep();
    }
  };

  const handleReset = () => {
    setTamperedData({ ...ehrDoc });
    resetTamperDoc();
  };

  const modifiedCanonical = generateCanonicalDocument(tamperedData);

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#141414]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#141414] tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-[#141414]" />
            EHR Tamper Detection & Viva Demonstration
          </h1>
          <p className="text-xs text-[#141414]/60 mt-1 max-w-3xl font-sans">
            Demonstrates how unauthorized alterations during transit invalidate the cryptographic hash digest,
            causing instant RSA-PSS signature verification failure.
          </p>
        </div>

        <button
          onClick={handleExecuteTamperTest}
          disabled={isTamperTesting || !signatureResult || !keyPair}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#141414] hover:bg-[#282828] text-[#E4E3E0] font-extrabold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer shrink-0 border border-[#141414]"
        >
          {isTamperTesting ? <RefreshCw className="w-4 h-4 animate-spin text-[#E4E3E0]" /> : <ShieldAlert className="w-4 h-4 text-[#E4E3E0]" />}
          <span>{isTamperTesting ? 'Verifying Integrity...' : 'Verify Modified Document'}</span>
        </button>
      </div>

      {/* Preset Attacks Bar */}
      <div className="p-4 bg-white rounded-xl border border-[#141414]/15 space-y-2 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#141414] flex items-center gap-1.5 font-mono">
            <Flame className="w-4 h-4 text-[#141414]" />
            Simulate Attack Scenarios (1-Click Tamper Injections)
          </span>
          <button
            onClick={handleReset}
            className="text-xs text-[#141414]/60 hover:text-[#141414] flex items-center gap-1 transition-colors cursor-pointer font-sans"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Original</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleApplyTamperPreset('diagnosis', 'Type 1 Diabetes', 'Diagnosis')}
            className="px-3 py-1.5 rounded-lg bg-[#F5F4F0] hover:bg-[#ECEBE6] text-[#141414] border border-[#141414]/20 text-xs font-medium transition-all cursor-pointer"
          >
            1. Alter Diagnosis (Type 2 → Type 1 Diabetes)
          </button>

          <button
            type="button"
            onClick={() => handleApplyTamperPreset('prescription', 'Metformin 2000mg TDS', 'Prescription')}
            className="px-3 py-1.5 rounded-lg bg-[#F5F4F0] hover:bg-[#ECEBE6] text-[#141414] border border-[#141414]/20 text-xs font-medium transition-all cursor-pointer"
          >
            2. Alter Dosage (500mg → 2000mg)
          </button>

          <button
            type="button"
            onClick={() => handleApplyTamperPreset('doctorName', 'Dr. Malicious Forger', 'Doctor')}
            className="px-3 py-1.5 rounded-lg bg-[#F5F4F0] hover:bg-[#ECEBE6] text-[#DC2626] border border-[#DC2626]/30 text-xs font-medium transition-all cursor-pointer"
          >
            3. Forge Doctor Name
          </button>

          <button
            type="button"
            onClick={() => handleApplyTamperPreset('hospital', 'Counterfeit Clinic', 'Hospital')}
            className="px-3 py-1.5 rounded-lg bg-[#F5F4F0] hover:bg-[#ECEBE6] text-[#DC2626] border border-[#DC2626]/30 text-xs font-medium transition-all cursor-pointer"
          >
            4. Alter Hospital Facility
          </button>
        </div>
      </div>

      {/* Two Panels: Original Signed EHR vs Modified EHR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Original EHR */}
        <div className="bg-white rounded-xl p-6 border border-[#141414]/15 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#141414]/15 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#141414] flex items-center justify-center text-[#E4E3E0]">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#141414] text-sm font-mono">ORIGINAL SIGNED EHR</h3>
                <p className="text-[10px] text-[#141414]/60 font-sans">Authentic Healthcare Record</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20">
              Provider Signed
            </span>
          </div>

          {/* Formatted Medical Document Display */}
          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 font-mono text-xs space-y-1.5 text-[#141414]">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-[#141414]/60">Patient ID:</span>
              <span className="col-span-2 text-[#141414] font-bold">{ehrDoc.patientId}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-[#141414]/60">Patient Name:</span>
              <span className="col-span-2 text-[#141414]">{ehrDoc.patientName}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-[#141414]/60">Age:</span>
              <span className="col-span-2 text-[#141414]">{ehrDoc.age}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-[#141414]/60">Diagnosis:</span>
              <span className="col-span-2 text-[#141414] font-bold">{ehrDoc.diagnosis}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-[#141414]/60">Prescription:</span>
              <span className="col-span-2 text-[#15803D] font-bold">{ehrDoc.prescription}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-[#141414]/60">Doctor:</span>
              <span className="col-span-2 text-[#141414]">{ehrDoc.doctorName}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-[#141414]/60">Hospital:</span>
              <span className="col-span-2 text-[#141414]">{ehrDoc.hospital}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-[#141414]/60">Date:</span>
              <span className="col-span-2 text-[#141414]">{ehrDoc.date}</span>
            </div>
          </div>

          {/* Original SHA-256 Box */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-[#141414]">Original SHA-256 Hash Digest:</span>
            <div className="p-3 bg-[#141414] text-[#E4E3E0] rounded-xl border border-[#141414] font-mono text-[11px] break-all leading-relaxed">
              {hashes.sha256 ? hashes.sha256.digest : 'Generating...'}
            </div>
          </div>

          {/* Original Signature Summary */}
          <div className="p-3 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 text-[11px] font-mono text-[#141414]">
            <span className="text-[#141414]/60">Original RSA-PSS Signature: </span>
            <span className="text-[#15803D] font-bold truncate block">
              {signatureResult ? signatureResult.signatureBase64.substring(0, 48) + '...' : 'Pending...'}
            </span>
          </div>
        </div>

        {/* Panel 2: Modified EHR (Editable) */}
        <div className="bg-white rounded-xl p-6 border border-[#141414]/15 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#141414]/15 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#141414] flex items-center justify-center text-[#E4E3E0]">
                <Edit3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#141414] text-sm font-mono">MODIFIED EHR (IN TRANSIT)</h3>
                <p className="text-[10px] text-[#141414]/60 font-sans">Edit fields below to simulate attacks</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#141414]/5 text-[#141414] border border-[#141414]/20">
              Tamper Sandbox
            </span>
          </div>

          {/* Editable Fields Form */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-[#141414] mb-1">
                Diagnosis (Editable):
              </label>
              <input
                type="text"
                value={tamperedData.diagnosis}
                onChange={(e) => handleFieldChange('diagnosis', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg bg-[#FBFBFA] border ${
                  tamperedData.diagnosis !== ehrDoc.diagnosis
                    ? 'border-[#DC2626] text-[#DC2626] font-bold'
                    : 'border-[#141414]/20 text-[#141414]'
                } font-mono outline-hidden`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#141414] mb-1">
                Prescription (Editable):
              </label>
              <input
                type="text"
                value={tamperedData.prescription}
                onChange={(e) => handleFieldChange('prescription', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg bg-[#FBFBFA] border ${
                  tamperedData.prescription !== ehrDoc.prescription
                    ? 'border-[#DC2626] text-[#DC2626] font-bold'
                    : 'border-[#141414]/20 text-[#141414]'
                } font-mono outline-hidden`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#141414] mb-1">
                  Doctor Name:
                </label>
                <input
                  type="text"
                  value={tamperedData.doctorName}
                  onChange={(e) => handleFieldChange('doctorName', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg bg-[#FBFBFA] border ${
                    tamperedData.doctorName !== ehrDoc.doctorName
                      ? 'border-[#DC2626] text-[#DC2626] font-bold'
                      : 'border-[#141414]/20 text-[#141414]'
                  } font-mono outline-hidden`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#141414] mb-1">
                  Hospital Facility:
                </label>
                <input
                  type="text"
                  value={tamperedData.hospital}
                  onChange={(e) => handleFieldChange('hospital', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg bg-[#FBFBFA] border ${
                    tamperedData.hospital !== ehrDoc.hospital
                      ? 'border-[#DC2626] text-[#DC2626] font-bold'
                      : 'border-[#141414]/20 text-[#141414]'
                  } font-mono outline-hidden`}
                />
              </div>
            </div>
          </div>

          {/* Modified Canonical String Preview */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-[#141414]">Modified Canonical Payload:</span>
            <div className="p-2.5 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 font-mono text-[10px] text-[#141414] whitespace-pre max-h-24 overflow-y-auto leading-relaxed">
              {modifiedCanonical}
            </div>
          </div>

          <button
            onClick={handleExecuteTamperTest}
            disabled={isTamperTesting}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#141414] hover:bg-[#282828] text-[#E4E3E0] font-bold text-xs shadow-xs transition-all cursor-pointer border border-[#141414]"
          >
            {isTamperTesting ? <RefreshCw className="w-4 h-4 animate-spin text-[#E4E3E0]" /> : <ShieldAlert className="w-4 h-4 text-[#E4E3E0]" />}
            <span>Execute Tamper Detection & Verify Original Signature</span>
          </button>
        </div>
      </div>

      {/* Hash Difference Visualization (Section 12) */}
      {tamperResult && (
        <div
          className={`rounded-xl p-6 border shadow-xs space-y-6 animate-in fade-in duration-300 ${
            tamperResult.tamperingDetected
              ? 'bg-white border-[#DC2626]'
              : 'bg-white border-[#15803D]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#141414]/15 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  tamperResult.tamperingDetected
                    ? 'bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20'
                    : 'bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20'
                }`}
              >
                {tamperResult.tamperingDetected ? (
                  <AlertCircle className="w-7 h-7" />
                ) : (
                  <CheckCircle2 className="w-7 h-7" />
                )}
              </div>
              <div>
                <h2
                  className={`text-xl font-black tracking-tight ${
                    tamperResult.tamperingDetected ? 'text-[#DC2626]' : 'text-[#15803D]'
                  }`}
                >
                  {tamperResult.tamperingDetected
                    ? '✗ TAMPERING DETECTED'
                    : '✓ INTEGRITY VERIFIED (NO TAMPERING)'}
                </h2>
                <p className="text-xs text-[#141414]/60 font-mono">
                  Execution Latency: {tamperResult.timeMs.toFixed(4)} ms
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#141414]">Hash Match:</span>
              <span
                className={`px-3 py-1 rounded text-xs font-bold font-mono ${
                  tamperResult.hashMatch
                    ? 'bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20'
                    : 'bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20'
                }`}
              >
                {tamperResult.hashMatch ? '✓ YES' : '✗ NO'}
              </span>
            </div>
          </div>

          {/* Side by side Hash Comparison */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#141414] font-mono">
              Cryptographic Hash Comparison (Avalanche Breakdown)
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {/* Original Hash */}
              <div className="p-3 bg-[#141414] text-[#E4E3E0] rounded-xl border border-[#141414] space-y-1">
                <span className="text-[10px] text-[#E4E3E0]/70 uppercase font-semibold block">
                  ORIGINAL HASH (256 bits):
                </span>
                <span className="break-all leading-relaxed block select-all">
                  {tamperResult.originalHash}
                </span>
              </div>

              {/* Not Equal Symbol */}
              <div className="text-center font-bold text-[#DC2626] text-lg">
                {tamperResult.hashMatch ? '=' : '≠'}
              </div>

              {/* Modified Hash */}
              <div className="p-3 bg-[#141414] text-[#E4E3E0] rounded-xl border border-[#141414] space-y-1">
                <span className="text-[10px] text-[#DC2626] uppercase font-bold block">
                  MODIFIED HASH (256 bits):
                </span>
                <span className="break-all leading-relaxed block select-all">
                  {tamperResult.modifiedHash}
                </span>
              </div>
            </div>
          </div>

          {/* Status Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 bg-[#F5F4F0] rounded-xl border border-[#141414]/10">
              <span className="text-[#141414]/60 text-[10px] block font-sans">Hash Match</span>
              <span
                className={`font-bold text-sm ${
                  tamperResult.hashMatch ? 'text-[#15803D]' : 'text-[#DC2626]'
                }`}
              >
                {tamperResult.hashMatch ? 'YES' : 'NO'}
              </span>
            </div>

            <div className="p-3 bg-[#F5F4F0] rounded-xl border border-[#141414]/10">
              <span className="text-[#141414]/60 text-[10px] block font-sans">Digital Signature</span>
              <span
                className={`font-bold text-sm ${
                  tamperResult.signatureValid ? 'text-[#15803D]' : 'text-[#DC2626]'
                }`}
              >
                {tamperResult.signatureValid ? 'VALID' : 'INVALID'}
              </span>
            </div>

            <div className="p-3 bg-[#F5F4F0] rounded-xl border border-[#141414]/10">
              <span className="text-[#141414]/60 text-[10px] block font-sans">Document Integrity</span>
              <span
                className={`font-bold text-sm ${
                  tamperResult.integrityValid ? 'text-[#15803D]' : 'text-[#DC2626]'
                }`}
              >
                {tamperResult.integrityValid ? 'VALID' : 'FAILED'}
              </span>
            </div>
          </div>

          {/* Cryptographic Explanation for Viva */}
          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 text-xs text-[#141414] space-y-1.5 leading-relaxed font-sans">
            <div className="flex items-center gap-1.5 font-bold text-[#141414]">
              <Info className="w-4 h-4 text-[#141414]" />
              <span>Viva Explanation & Theoretical Foundation</span>
            </div>
            <p>
              Even a single character or bit modification to the EHR payload causes the SHA-256 cryptographic
              hash function to produce a completely pseudorandom, uncorrelated 256-bit digest (the{' '}
              <strong className="font-bold">Avalanche Effect</strong>).
            </p>
            <p className="text-[#141414]/70">
              Because the original RSA-PSS digital signature was computed exclusively over the hash of the authentic
              original record, mathematical verification against the modified digest fails unconditionally,
              preventing fraud, dosage errors, or forged clinical orders.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
