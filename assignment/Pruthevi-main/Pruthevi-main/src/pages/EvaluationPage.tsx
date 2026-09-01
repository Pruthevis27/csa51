import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  RefreshCw,
  Zap,
  Shield,
  Layers,
  Award,
  CheckCircle2,
  Lock,
  Key,
  PenTool,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  Activity,
} from 'lucide-react';
import { runBenchmarkApi } from '../services/api';
import { useEHR } from '../context/EHRContext';

export const EvaluationPage: React.FC = () => {
  const { addToast } = useEHR();
  const [isRunningBenchmark, setIsRunningBenchmark] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState<{
    sha256: number;
    sha3_256: number;
    rsaKeyGen: number;
    rsaSigning: number;
    rsaVerification: number;
    environment: string;
    measuredAt: string;
  } | null>(null);

  const executeBenchmark = async () => {
    setIsRunningBenchmark(true);
    try {
      const data = await runBenchmarkApi();
      setBenchmarkData(data);
      addToast('success', 'Benchmark Complete', 'Cryptographic operations timed on hardware.');
    } catch (err: any) {
      addToast('error', 'Benchmark Failed', err.message || 'Error executing benchmark');
    } finally {
      setIsRunningBenchmark(false);
    }
  };

  useEffect(() => {
    executeBenchmark();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-[#141414]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#141414] tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-[#141414]" />
            Cryptographic Evaluation & Benchmarking
          </h1>
          <p className="text-xs text-[#141414]/60 mt-1 max-w-3xl font-sans">
            Empirical runtime performance measurements, theoretical security evaluation, and academic protocol recommendations.
          </p>
        </div>

        <button
          onClick={executeBenchmark}
          disabled={isRunningBenchmark}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#141414] hover:bg-[#282828] text-[#E4E3E0] font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer shrink-0 border border-[#141414]"
        >
          {isRunningBenchmark ? <RefreshCw className="w-4 h-4 animate-spin text-[#E4E3E0]" /> : <Zap className="w-4 h-4 text-[#E4E3E0]" />}
          <span>{isRunningBenchmark ? 'Measuring Latency...' : 'Run Live Benchmark'}</span>
        </button>
      </div>

      {/* Live Performance Benchmark Section */}
      <div className="bg-white rounded-xl p-6 border border-[#141414]/15 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#141414] flex items-center gap-2 font-mono">
              <Activity className="w-4 h-4 text-[#141414]" />
              Empirical Performance Measurements
            </h2>
            <p className="text-xs text-[#141414]/60 font-sans">
              Live hardware execution latency measured directly from active backend environment
            </p>
          </div>
          {benchmarkData && (
            <span className="text-[11px] text-[#141414]/70 font-mono hidden sm:inline">
              Env: {benchmarkData.environment}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
          {/* SHA-256 */}
          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-1">
            <span className="text-[10px] text-[#141414]/60 uppercase block">SHA-256 Digest</span>
            <div className="text-lg font-black text-[#141414]">
              {benchmarkData ? `${benchmarkData.sha256} ms` : '—'}
            </div>
            <span className="text-[10px] text-[#141414]/50 font-sans block">Avg over 500 ops</span>
          </div>

          {/* SHA-3-256 */}
          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-1">
            <span className="text-[10px] text-[#141414]/60 uppercase block">SHA-3-256 Digest</span>
            <div className="text-lg font-black text-[#141414]">
              {benchmarkData ? `${benchmarkData.sha3_256} ms` : '—'}
            </div>
            <span className="text-[10px] text-[#141414]/50 font-sans block">Avg over 500 ops</span>
          </div>

          {/* RSA KeyGen */}
          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-1">
            <span className="text-[10px] text-[#141414]/60 uppercase block">RSA Key Generation</span>
            <div className="text-lg font-black text-[#141414]">
              {benchmarkData ? `${benchmarkData.rsaKeyGen} ms` : '—'}
            </div>
            <span className="text-[10px] text-[#141414]/50 font-sans block">2048-bit prime pairs</span>
          </div>

          {/* RSA Signing */}
          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-1">
            <span className="text-[10px] text-[#141414]/60 uppercase block">RSA-PSS Signing</span>
            <div className="text-lg font-black text-[#15803D]">
              {benchmarkData ? `${benchmarkData.rsaSigning} ms` : '—'}
            </div>
            <span className="text-[10px] text-[#141414]/50 font-sans block">SHA-256 + salt</span>
          </div>

          {/* RSA Verification */}
          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-1">
            <span className="text-[10px] text-[#141414]/60 uppercase block">RSA Verification</span>
            <div className="text-lg font-black text-[#141414]">
              {benchmarkData ? `${benchmarkData.rsaVerification} ms` : '—'}
            </div>
            <span className="text-[10px] text-[#141414]/50 font-sans block">Public key check</span>
          </div>
        </div>

        <div className="p-3 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 text-[11px] text-[#141414]/70 flex items-center gap-2 font-sans">
          <Info className="w-4 h-4 text-[#141414] shrink-0" />
          <span>
            Measurements reflect current container CPU execution cycles and are not hardcoded. All values are calculated via microsecond hardware timers.
          </span>
        </div>
      </div>

      {/* Comparison Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: Hash Functions */}
        <div className="bg-white rounded-xl p-6 border border-[#141414]/15 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#141414]/15 pb-3">
            <Layers className="w-4 h-4 text-[#141414]" />
            <h2 className="text-sm font-bold text-[#141414] font-mono">Hash Function Comparison</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#141414]/15 text-[#141414]/60 font-mono text-[11px]">
                  <th className="py-2 px-2.5">Criterion</th>
                  <th className="py-2 px-2.5 text-[#141414] font-bold">SHA-256</th>
                  <th className="py-2 px-2.5 text-[#141414] font-bold">SHA-3-256</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]/10 font-mono text-[11px]">
                <tr>
                  <td className="py-2 px-2.5 text-[#141414]/60">Digest Length</td>
                  <td className="py-2 px-2.5 text-[#141414]">256-bit</td>
                  <td className="py-2 px-2.5 text-[#141414]">256-bit</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[#141414]/60">Collision Resistance</td>
                  <td className="py-2 px-2.5 text-[#15803D] font-bold">Strong</td>
                  <td className="py-2 px-2.5 text-[#15803D] font-bold">Strong</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[#141414]/60">Preimage Resistance</td>
                  <td className="py-2 px-2.5 text-[#15803D] font-bold">Strong</td>
                  <td className="py-2 px-2.5 text-[#15803D] font-bold">Strong</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[#141414]/60">Security</td>
                  <td className="py-2 px-2.5 text-[#15803D] font-bold">High</td>
                  <td className="py-2 px-2.5 text-[#15803D] font-bold">High</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[#141414]/60">Performance</td>
                  <td className="py-2 px-2.5 text-[#141414]">Fast</td>
                  <td className="py-2 px-2.5 text-[#141414]">Fast</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[#141414]/60">Implementation</td>
                  <td className="py-2 px-2.5 text-[#141414]">Widely supported</td>
                  <td className="py-2 px-2.5 text-[#141414]">Modern alternative</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[#141414]/60">EHR Suitability</td>
                  <td className="py-2 px-2.5 text-[#15803D] font-bold">Excellent</td>
                  <td className="py-2 px-2.5 text-[#15803D] font-bold">Excellent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Digital Signature Scheme */}
        <div className="bg-white rounded-xl p-6 border border-[#141414]/15 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#141414]/15 pb-3">
            <PenTool className="w-4 h-4 text-[#141414]" />
            <h2 className="text-sm font-bold text-[#141414] font-mono">Digital Signature Evaluation</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#141414]/15 text-[#141414]/60 font-mono text-[11px]">
                  <th className="py-2 px-2.5">Criterion</th>
                  <th className="py-2 px-2.5 text-[#15803D] font-bold">RSA-2048 + RSA-PSS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]/10 font-mono text-[11px]">
                <tr>
                  <td className="py-2 px-2.5 text-[#141414]/60">Integrity</td>
                  <td className="py-2 px-2.5 text-[#15803D] font-bold">Strong</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[#141414]/60">Authentication</td>
                  <td className="py-2 px-2.5 text-[#15803D] font-bold">Strong</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[#141414]/60">Non-Repudiation</td>
                  <td className="py-2 px-2.5 text-[#15803D] font-bold">Supported</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[#141414]/60">Signature Verification</td>
                  <td className="py-2 px-2.5 text-[#141414]">Efficient</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[#141414]/60">Security</td>
                  <td className="py-2 px-2.5 text-[#15803D] font-bold">Strong</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[#141414]/60">Key Management</td>
                  <td className="py-2 px-2.5 text-[#141414]">Required (PKI / Certificates)</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[#141414]/60">Computational Overhead</td>
                  <td className="py-2 px-2.5 text-[#141414]">Moderate</td>
                </tr>
                <tr>
                  <td className="py-2 px-2.5 text-[#141414]/60">EHR Suitability</td>
                  <td className="py-2 px-2.5 text-[#15803D] font-bold">High</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Security Mechanism Explanations */}
      <div className="bg-white rounded-xl p-6 border border-[#141414]/15 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#141414] flex items-center gap-2 font-mono">
          <Lock className="w-4 h-4 text-[#141414]" />
          Security Mechanism Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-1.5">
            <span className="font-bold text-[#141414] block font-mono">SHA-256 / SHA-3-256</span>
            <p className="text-[#141414]/70 leading-relaxed font-sans">
              Used to detect changes in EHR content. Compresses arbitrary clinical data into a fixed 256-bit digest with high collision resistance.
            </p>
          </div>

          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-1.5">
            <span className="font-bold text-[#141414] block font-mono">RSA-2048</span>
            <p className="text-[#141414]/70 leading-relaxed font-sans">
              Provides asymmetric cryptographic keys based on integer factorization hardness, separating public verification from private signing.
            </p>
          </div>

          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-1.5">
            <span className="font-bold text-[#141414] block font-mono">Private Key</span>
            <p className="text-[#141414]/70 leading-relaxed font-sans">
              Used by the healthcare provider to create the signature. Must remain confidential within secure enclave memory.
            </p>
          </div>

          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-1.5">
            <span className="font-bold text-[#141414] block font-mono">Public Key</span>
            <p className="text-[#141414]/70 leading-relaxed font-sans">
              Used by authorized receivers (hospitals, pharmacies, insurance) to verify the authenticity of the signature.
            </p>
          </div>

          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-1.5">
            <span className="font-bold text-[#15803D] block font-mono">Digital Signature</span>
            <p className="text-[#141414]/70 leading-relaxed font-sans">
              Simultaneously delivers data integrity, source authentication, and non-repudiation in healthcare records.
            </p>
          </div>

          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-1.5">
            <span className="font-bold text-[#DC2626] block font-mono">Tampering Detection</span>
            <p className="text-[#141414]/70 leading-relaxed font-sans">
              Changing any EHR field yields a mismatched hash, guaranteeing that signature verification fails instantly upon interception attacks.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Academic Protocol (Section 26) */}
      <div className="bg-white rounded-xl p-6 border-2 border-[#141414] shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#141414] flex items-center justify-center text-[#E4E3E0]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#141414]">Recommended Academic Protocol</h2>
            <p className="text-xs text-[#141414]/60 font-mono">Formal College Project Conclusion</p>
          </div>
        </div>

        <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-3 text-xs text-[#141414] leading-relaxed font-sans">
          <p>
            For this project, the recommended cryptographic protocol is:
          </p>
          <div className="p-3 bg-white rounded-lg border border-[#141414]/20 font-mono text-sm font-bold text-[#141414] text-center shadow-xs">
            SHA-256 + RSA-2048 using RSA-PSS
          </div>
          <p className="font-medium">
            This protocol is recommended because it provides:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <li className="flex items-center gap-2 text-[#141414]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Strong integrity protection</span>
            </li>
            <li className="flex items-center gap-2 text-[#141414]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Digital source authentication</span>
            </li>
            <li className="flex items-center gap-2 text-[#141414]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Non-repudiation guarantees</span>
            </li>
            <li className="flex items-center gap-2 text-[#141414]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Established cryptographic support</span>
            </li>
            <li className="flex items-center gap-2 text-[#141414] sm:col-span-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Practical verification performance in telemedicine workflows</span>
            </li>
          </ul>

          <p className="text-[#141414]/70 pt-2 text-[11px] leading-relaxed">
            <strong>SHA-3-256</strong> serves as a robust alternative hash function providing structural diversity via its sponge construction.
            While RSA-2048 is well-suited for this academic analysis, production healthcare deployments must continually adhere to
            current regulatory standards (such as NIST SP 800-57, HIPAA, and post-quantum migration roadmaps) and organizational key-management policies.
          </p>
        </div>
      </div>
    </div>
  );
};
