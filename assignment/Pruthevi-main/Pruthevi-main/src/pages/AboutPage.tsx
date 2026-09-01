import React from 'react';
import {
  Info,
  GraduationCap,
  Globe2,
  ShieldCheck,
  Code2,
  Lock,
  Layers,
  HeartPulse,
  Building,
  Scale,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto text-[#141414]">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-[#141414]/15 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#141414] text-[#E4E3E0] text-xs font-semibold uppercase tracking-wider font-mono">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>College Cryptography Capstone Project</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141414] tracking-tight">
          Evaluation of Cryptographic Hash Functions and Digital Signatures in Electronic Health Record Security
        </h1>
        <p className="text-sm text-[#141414]/70 font-medium font-sans">
          A Telemedicine Framework for Medical Document Integrity, Source Authentication, and Non-Repudiation
        </p>
      </div>

      {/* Problem Statement Card */}
      <div className="bg-white rounded-xl p-6 border border-[#141414]/15 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-[#141414] flex items-center gap-2 font-mono">
          <HeartPulse className="w-4 h-4 text-[#DC2626]" />
          Problem Statement & Clinical Context
        </h2>
        <p className="text-xs text-[#141414]/70 leading-relaxed font-sans">
          A telemedicine healthcare provider manages sensitive Electronic Health Records (EHRs) transmitted
          between medical facilities, doctors, diagnostic laboratories, and insurance portals. The system must
          ensure that patient diagnoses and prescription documents remain unaltered during transit and that the
          originating healthcare provider&apos;s identity is cryptographically verified.
        </p>
      </div>

      {/* Course Outcomes (CO) Mapping */}
      <div className="bg-white rounded-xl p-6 border border-[#141414]/15 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#141414] flex items-center gap-2 font-mono">
          <GraduationCap className="w-4 h-4 text-[#141414]" />
          Course Outcomes (CO) Mapping
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-2">
            <span className="px-2.5 py-1 rounded bg-[#141414] text-[#E4E3E0] font-bold inline-block">
              CO2
            </span>
            <p className="text-[#141414] font-sans text-xs leading-relaxed font-medium">
              Analyze public key cryptosystem strategies using asymmetric key architectures.
            </p>
            <div className="text-[11px] text-[#141414]/60 font-mono pt-1">
              Demonstrated via RSA-2048 key pair generation, SPKI public key encoding, and mathematical signature verification.
            </div>
          </div>

          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-2">
            <span className="px-2.5 py-1 rounded bg-[#141414] text-[#E4E3E0] font-bold inline-block">
              CO3
            </span>
            <p className="text-[#141414] font-sans text-xs leading-relaxed font-medium">
              Examine cryptographic hash algorithms, digital signature schemes, and authentication frameworks
              for ensuring data integrity, origin authentication, and non-repudiation.
            </p>
            <div className="text-[11px] text-[#141414]/60 font-mono pt-1">
              Demonstrated via comparative SHA-256 vs. SHA-3-256 benchmarking and RSA-PSS signature verification.
            </div>
          </div>
        </div>
      </div>

      {/* SDG Mapping */}
      <div className="bg-white rounded-xl p-6 border border-[#141414]/15 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#141414] flex items-center gap-2 font-mono">
          <Globe2 className="w-4 h-4 text-[#141414]" />
          UN Sustainable Development Goals (SDG) Alignment
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* SDG 3 */}
          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#15803D] text-white font-bold flex items-center justify-center font-mono text-xs">
                3
              </span>
              <span className="font-bold text-[#141414]">SDG 3</span>
            </div>
            <p className="font-semibold text-[#15803D] text-xs">Good Health and Well-being</p>
            <p className="text-[#141414]/70 leading-relaxed text-[11px] font-sans">
              Protects patient medical safety by eliminating medication dosage tampering and diagnostic forgery across telemedicine channels.
            </p>
          </div>

          {/* SDG 9 */}
          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#141414] text-white font-bold flex items-center justify-center font-mono text-xs">
                9
              </span>
              <span className="font-bold text-[#141414]">SDG 9</span>
            </div>
            <p className="font-semibold text-[#141414] text-xs">Industry, Innovation & Infrastructure</p>
            <p className="text-[#141414]/70 leading-relaxed text-[11px] font-sans">
              Strengthens critical digital health infrastructure with standards-compliant cryptographic integrity checks.
            </p>
          </div>

          {/* SDG 16 */}
          <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white font-bold flex items-center justify-center font-mono text-xs">
                16
              </span>
              <span className="font-bold text-[#141414]">SDG 16</span>
            </div>
            <p className="font-semibold text-[#4F46E5] text-xs">Peace, Justice & Strong Institutions</p>
            <p className="text-[#141414]/70 leading-relaxed text-[11px] font-sans">
              Enforces legal non-repudiation and forensic auditability in clinical malpractice and insurance verification processes.
            </p>
          </div>
        </div>
      </div>

      {/* Technologies & Algorithms */}
      <div className="bg-white rounded-xl p-6 border border-[#141414]/15 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#141414] flex items-center gap-2 font-mono">
          <Code2 className="w-4 h-4 text-[#141414]" />
          Technical Stack & Cryptographic Specifications
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
            <span className="text-[#141414]/60 block text-[10px]">Frontend</span>
            <span className="text-[#141414] font-bold">React 19 + TypeScript</span>
          </div>
          <div className="p-3 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
            <span className="text-[#141414]/60 block text-[10px]">Styling</span>
            <span className="text-[#141414] font-bold">Tailwind CSS</span>
          </div>
          <div className="p-3 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
            <span className="text-[#141414]/60 block text-[10px]">Backend Engine</span>
            <span className="text-[#141414] font-bold">Node.js + Python FastAPI</span>
          </div>
          <div className="p-3 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
            <span className="text-[#141414]/60 block text-[10px]">Crypto Library</span>
            <span className="text-[#141414] font-bold">Python Cryptography / OpenSSL</span>
          </div>
          <div className="p-3 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
            <span className="text-[#141414]/60 block text-[10px]">Primary Hash</span>
            <span className="text-[#141414] font-bold">SHA-256 (FIPS 180-4)</span>
          </div>
          <div className="p-3 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
            <span className="text-[#141414]/60 block text-[10px]">Alternative Hash</span>
            <span className="text-[#141414] font-bold">SHA-3-256 (FIPS 202)</span>
          </div>
          <div className="p-3 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
            <span className="text-[#141414]/60 block text-[10px]">Asymmetric Scheme</span>
            <span className="text-[#141414] font-bold">RSA-2048 (PKCS#8/SPKI)</span>
          </div>
          <div className="p-3 bg-[#F5F4F0] rounded-lg border border-[#141414]/10">
            <span className="text-[#141414]/60 block text-[10px]">Signature Padding</span>
            <span className="text-[#15803D] font-bold">RSA-PSS (PKCS#1 v2.1)</span>
          </div>
        </div>
      </div>

      {/* Academic Integrity & Compliance Check */}
      <div className="p-4 bg-white rounded-xl border-2 border-[#141414] space-y-2 text-xs text-[#141414]/70 leading-relaxed font-sans shadow-xs">
        <div className="flex items-center gap-2 text-[#141414] font-bold font-mono">
          <ShieldCheck className="w-4 h-4 text-[#15803D]" />
          <span>Academic Security Standards Compliance</span>
        </div>
        <p>
          This application strictly adheres to rigorous academic and cryptographic guidelines: no hardcoded hashes or signatures,
          no textbook RSA implementations, zero usage of obsolete algorithms (MD5 / SHA-1 banned), full separation of hashing from signing,
          and complete isolation of the provider private key.
        </p>
        <p className="text-[11px] text-[#141414]/60 pt-1">
          * <strong>Disclaimer:</strong> This application is designed exclusively for academic demonstration and laboratory evaluation.
          All patient names, diagnosis descriptions, and identification numbers are purely fictional.
        </p>
      </div>
    </div>
  );
};
