import React, { useEffect, useState } from 'react';
import {
  Hash,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Shield,
  Layers,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useEHR } from '../context/EHRContext';

export const HashingPage: React.FC = () => {
  const {
    canonicalDoc,
    hashes,
    isHashing,
    generateHashes,
    setCurrentView,
    addToast,
    isGuidedMode,
    advanceGuidedStep,
  } = useEHR();

  const [copiedSha256, setCopiedSha256] = useState(false);
  const [copiedSha3, setCopiedSha3] = useState(false);

  // Auto generate hashes on mount if not yet generated
  useEffect(() => {
    if (!hashes.sha256 && canonicalDoc) {
      generateHashes();
    }
  }, []);

  const handleGenerate = async () => {
    await generateHashes();
    if (isGuidedMode) {
      advanceGuidedStep();
    }
  };

  const copyDigest = (text: string, type: 'sha256' | 'sha3') => {
    navigator.clipboard.writeText(text);
    if (type === 'sha256') {
      setCopiedSha256(true);
      setTimeout(() => setCopiedSha256(false), 2000);
    } else {
      setCopiedSha3(true);
      setTimeout(() => setCopiedSha3(false), 2000);
    }
    addToast('info', 'Digest Copied', 'Cryptographic hash copied to clipboard.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#141414]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#141414] tracking-tight flex items-center gap-2.5">
            <Hash className="w-6 h-6 text-[#141414]" />
            Cryptographic Hashing
          </h1>
          <p className="text-xs text-[#141414]/60 mt-1 max-w-3xl font-sans">
            A cryptographic hash function converts arbitrary data into a deterministic fixed-length digest.
            A small change in the original data produces a significantly different digest (Avalanche Effect).
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isHashing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#141414] hover:bg-[#282828] text-[#E4E3E0] font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer shrink-0 border border-[#141414]"
        >
          {isHashing ? <RefreshCw className="w-4 h-4 animate-spin text-[#E4E3E0]" /> : <Zap className="w-4 h-4 text-[#E4E3E0]" />}
          <span>{isHashing ? 'Computing...' : 'Generate Hashes'}</span>
        </button>
      </div>

      {/* Target Document Bar */}
      <div className="p-4 bg-white rounded-xl border border-[#141414]/15 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2 text-[#141414]">
          <Shield className="w-4 h-4 text-[#141414] shrink-0" />
          <span className="font-bold text-[#141414]">Active Canonical Input:</span>
          <span className="text-[#141414]/60 font-mono truncate max-w-xl">
            {canonicalDoc.replace(/\n/g, ' • ')}
          </span>
        </div>
        <span className="text-[11px] text-[#141414]/80 font-mono shrink-0 font-bold">
          {new Blob([canonicalDoc]).size} bytes payload
        </span>
      </div>

      {/* Side-by-Side Algorithm Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SHA-256 Card */}
        <div className="bg-white rounded-xl p-6 border border-[#141414]/15 shadow-xs space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#141414]/15 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#141414] flex items-center justify-center text-[#E4E3E0] font-bold text-xs font-mono">
                256
              </div>
              <div>
                <h3 className="font-bold text-[#141414] text-sm">SHA-256</h3>
                <p className="text-[10px] text-[#141414]/60 font-mono">NIST FIPS 180-4 Standard</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[#141414]/5 text-[#141414] border border-[#141414]/15 font-bold">
              Merkle-Damgård
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
              <span className="text-[10px] text-[#141414]/50 block font-sans">Output Length</span>
              <span className="font-bold text-[#141414]">256 bits (32 bytes)</span>
            </div>
            <div className="p-2.5 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
              <span className="text-[10px] text-[#141414]/50 block font-sans">Processing Time</span>
              <span className="font-bold text-[#15803D]">
                {hashes.sha256 ? `${hashes.sha256.timeMs.toFixed(4)} ms` : 'Pending...'}
              </span>
            </div>
          </div>

          {/* Digest Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-[#141414]">Cryptographic Digest (Hex):</span>
              {hashes.sha256 && (
                <button
                  onClick={() => copyDigest(hashes.sha256!.digest, 'sha256')}
                  className="text-[#141414] hover:text-black flex items-center gap-1 text-[11px] font-mono font-bold cursor-pointer"
                >
                  {copiedSha256 ? <Check className="w-3 h-3 text-[#15803D]" /> : <Copy className="w-3 h-3 text-[#141414]" />}
                  <span>{copiedSha256 ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="p-3 bg-[#141414] text-[#E4E3E0] rounded-xl border border-[#141414] font-mono text-[11px] break-all leading-relaxed tracking-wide select-all">
              {hashes.sha256 ? hashes.sha256.digest : 'Click "Generate Hashes" to calculate digest'}
            </div>
          </div>

          <div className="text-[11px] text-[#141414]/70 leading-relaxed pt-1 font-sans">
            SHA-256 is the industry-standard cryptographic hash algorithm used in digital signatures, Bitcoin,
            and healthcare data exchange compliance (HIPAA / HL7 FHIR).
          </div>
        </div>

        {/* SHA-3-256 Card */}
        <div className="bg-white rounded-xl p-6 border border-[#141414]/15 shadow-xs space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#141414]/15 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#141414] flex items-center justify-center text-[#E4E3E0] font-bold text-xs font-mono">
                3-256
              </div>
              <div>
                <h3 className="font-bold text-[#141414] text-sm">SHA-3-256</h3>
                <p className="text-[10px] text-[#141414]/60 font-mono">Keccak FIPS 202 Standard</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[#141414]/5 text-[#141414] border border-[#141414]/15 font-bold">
              Sponge Construction
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
              <span className="text-[10px] text-[#141414]/50 block font-sans">Output Length</span>
              <span className="font-bold text-[#141414]">256 bits (32 bytes)</span>
            </div>
            <div className="p-2.5 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
              <span className="text-[10px] text-[#141414]/50 block font-sans">Processing Time</span>
              <span className="font-bold text-[#15803D]">
                {hashes.sha3_256 ? `${hashes.sha3_256.timeMs.toFixed(4)} ms` : 'Pending...'}
              </span>
            </div>
          </div>

          {/* Digest Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-[#141414]">Cryptographic Digest (Hex):</span>
              {hashes.sha3_256 && (
                <button
                  onClick={() => copyDigest(hashes.sha3_256!.digest, 'sha3')}
                  className="text-[#141414] hover:text-black flex items-center gap-1 text-[11px] font-mono font-bold cursor-pointer"
                >
                  {copiedSha3 ? <Check className="w-3 h-3 text-[#15803D]" /> : <Copy className="w-3 h-3 text-[#141414]" />}
                  <span>{copiedSha3 ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="p-3 bg-[#141414] text-[#E4E3E0] rounded-xl border border-[#141414] font-mono text-[11px] break-all leading-relaxed tracking-wide select-all">
              {hashes.sha3_256 ? hashes.sha3_256.digest : 'Click "Generate Hashes" to calculate digest'}
            </div>
          </div>

          <div className="text-[11px] text-[#141414]/70 leading-relaxed pt-1 font-sans">
            SHA-3 (Keccak) features a fundamentally different mathematical design (Sponge function),
            making it immune to length-extension attacks without requiring HMAC constructions.
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl p-6 border border-[#141414]/15 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#141414] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#141414]" />
            Cryptographic Hash Function Comparison Matrix
          </h2>
          <span className="text-[11px] text-[#141414]/60 font-mono">Real-time measured benchmark</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#141414]/15 text-[#141414]/60 font-mono text-[11px]">
                <th className="py-2.5 px-3">Property</th>
                <th className="py-2.5 px-3 text-[#141414] font-bold">SHA-256</th>
                <th className="py-2.5 px-3 text-[#141414] font-bold">SHA-3-256</th>
                <th className="py-2.5 px-3 text-[#141414]/60">Security Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]/10 font-mono">
              <tr className="hover:bg-[#F5F4F0]">
                <td className="py-2.5 px-3 font-semibold text-[#141414]">Digest Size</td>
                <td className="py-2.5 px-3 text-[#141414]">256 bits (64 hex chars)</td>
                <td className="py-2.5 px-3 text-[#141414]">256 bits (64 hex chars)</td>
                <td className="py-2.5 px-3 text-[#141414]/70 font-sans text-[11px]">Standardized fixed-length digest size</td>
              </tr>
              <tr className="hover:bg-[#F5F4F0]">
                <td className="py-2.5 px-3 font-semibold text-[#141414]">Collision Resistance</td>
                <td className="py-2.5 px-3 text-[#15803D] font-bold">Strong (2¹²⁸ operations)</td>
                <td className="py-2.5 px-3 text-[#15803D] font-bold">Strong (2¹²⁸ operations)</td>
                <td className="py-2.5 px-3 text-[#141414]/70 font-sans text-[11px]">Infeasible to find two inputs with same hash</td>
              </tr>
              <tr className="hover:bg-[#F5F4F0]">
                <td className="py-2.5 px-3 font-semibold text-[#141414]">Security Strength</td>
                <td className="py-2.5 px-3 text-[#15803D] font-bold">High</td>
                <td className="py-2.5 px-3 text-[#15803D] font-bold">High</td>
                <td className="py-2.5 px-3 text-[#141414]/70 font-sans text-[11px]">Meets national healthcare confidentiality standards</td>
              </tr>
              <tr className="hover:bg-[#F5F4F0]">
                <td className="py-2.5 px-3 font-semibold text-[#141414]">Construction</td>
                <td className="py-2.5 px-3 text-[#141414]">Merkle-Damgård</td>
                <td className="py-2.5 px-3 text-[#141414]">Sponge (Keccak-f[1600])</td>
                <td className="py-2.5 px-3 text-[#141414]/70 font-sans text-[11px]">Architectural diversity prevents shared vulnerability</td>
              </tr>
              <tr className="hover:bg-[#F5F4F0]">
                <td className="py-2.5 px-3 font-semibold text-[#141414]">Measured Execution Time</td>
                <td className="py-2.5 px-3 text-[#15803D] font-bold">
                  {hashes.sha256 ? `${hashes.sha256.timeMs.toFixed(4)} ms` : '—'}
                </td>
                <td className="py-2.5 px-3 text-[#15803D] font-bold">
                  {hashes.sha3_256 ? `${hashes.sha3_256.timeMs.toFixed(4)} ms` : '—'}
                </td>
                <td className="py-2.5 px-3 text-[#141414]/70 font-sans text-[11px]">Measured from active Node/OpenSSL container</td>
              </tr>
              <tr className="hover:bg-[#F5F4F0]">
                <td className="py-2.5 px-3 font-semibold text-[#141414]">EHR Suitability</td>
                <td className="py-2.5 px-3 text-[#15803D] font-bold">High (Universal)</td>
                <td className="py-2.5 px-3 text-[#15803D] font-bold">High (Next-Gen)</td>
                <td className="py-2.5 px-3 text-[#141414]/70 font-sans text-[11px]">Optimal for tele-health digital signatures</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#F5F4F0] rounded-xl border border-[#141414]/15 text-[11px] text-[#141414]/70 flex items-start gap-2">
          <Info className="w-4 h-4 text-[#141414] shrink-0 mt-0.5" />
          <span className="font-sans">
            <strong>Note on Measured Execution Time:</strong> Execution latency is environment-dependent and
            calculated using high-resolution hardware timers (<code className="text-[#141414] font-mono font-bold">process.hrtime</code>).
            Both algorithms execute in sub-millisecond timeframes, ensuring zero overhead in clinical pipelines.
          </span>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setCurrentView('signature')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-[#F5F4F0] text-[#141414] font-bold text-xs border border-[#141414]/20 transition-all cursor-pointer shadow-xs"
        >
          <span>Proceed to RSA Digital Signature</span>
          <ArrowRight className="w-4 h-4 text-[#141414]" />
        </button>
      </div>
    </div>
  );
};
