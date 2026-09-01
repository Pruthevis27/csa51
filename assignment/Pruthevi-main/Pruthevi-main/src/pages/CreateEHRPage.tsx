import React, { useState } from 'react';
import {
  FilePlus2,
  FileText,
  Copy,
  Check,
  ArrowRight,
  User,
  Building2,
  Stethoscope,
  Calendar,
  AlertCircle,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { useEHR } from '../context/EHRContext';
import { EHRDocument } from '../types';
import { PRESET_PATIENTS } from '../utils/canonical';

export const CreateEHRPage: React.FC = () => {
  const {
    ehrDoc,
    canonicalDoc,
    updateEhrDoc,
    setCurrentView,
    addToast,
    advanceGuidedStep,
    isGuidedMode,
  } = useEHR();

  const [formData, setFormData] = useState<EHRDocument>({ ...ehrDoc });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedCanonical, setCopiedCanonical] = useState(false);
  const [copiedFormatted, setCopiedFormatted] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.patientId.trim()) errs.patientId = 'Patient ID is required.';
    if (!formData.patientName.trim()) errs.patientName = 'Patient name is required.';
    if (!formData.age || Number(formData.age) <= 0 || Number(formData.age) > 130) {
      errs.age = 'Enter a valid age (1-130).';
    }
    if (!formData.diagnosis.trim()) errs.diagnosis = 'Diagnosis cannot be empty.';
    if (!formData.prescription.trim()) errs.prescription = 'Prescription cannot be empty.';
    if (!formData.doctorName.trim()) errs.doctorName = 'Doctor name is required.';
    if (!formData.hospital.trim()) errs.hospital = 'Hospital name is required.';
    if (!formData.date.trim()) errs.date = 'Date is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('error', 'Validation Error', 'Please complete all required fields correctly.');
      return;
    }
    await updateEhrDoc(formData);
    if (isGuidedMode) {
      advanceGuidedStep();
    }
  };

  const handlePresetSelect = (presetData: EHRDocument) => {
    setFormData(presetData);
    setErrors({});
    addToast('info', 'Preset Loaded', `Loaded sample data for ${presetData.patientName}.`);
  };

  const copyToClipboard = (text: string, type: 'canonical' | 'formatted') => {
    navigator.clipboard.writeText(text);
    if (type === 'canonical') {
      setCopiedCanonical(true);
      setTimeout(() => setCopiedCanonical(false), 2000);
    } else {
      setCopiedFormatted(true);
      setTimeout(() => setCopiedFormatted(false), 2000);
    }
    addToast('info', 'Copied to Clipboard', 'Document content copied.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#141414]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#141414] tracking-tight flex items-center gap-2.5">
            <FilePlus2 className="w-6 h-6 text-[#141414]" />
            Create Electronic Health Record
          </h1>
          <p className="text-xs text-[#141414]/60 mt-1 font-sans">
            Input fictional telemedicine records to establish canonical structuring for cryptographic signing.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#141414]/60 font-medium font-mono">Sample Presets:</span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_PATIENTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(p.data)}
                className="px-2.5 py-1 rounded-md bg-white hover:bg-[#F5F4F0] text-[#141414] text-xs font-medium border border-[#141414]/20 transition-colors cursor-pointer"
              >
                {p.data.patientName.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-[#141414]/15 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#141414]/15 pb-3">
            <h2 className="text-sm font-bold text-[#141414] flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#141414]" />
              Clinical Patient Record Details
            </h2>
            <span className="text-[11px] text-[#141414]/60 font-mono font-bold">Fictional Sample Data Only</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Patient ID, Patient Name, Age */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#141414] mb-1">
                  Patient ID <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  placeholder="e.g. P1001"
                  className={`w-full px-3 py-2 rounded-lg bg-[#FBFBFA] border ${
                    errors.patientId ? 'border-[#DC2626]' : 'border-[#141414]/20 focus:border-[#141414]'
                  } text-[#141414] text-xs font-mono outline-hidden transition-all`}
                />
                {errors.patientId && <p className="text-[10px] text-[#DC2626] mt-1">{errors.patientId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141414] mb-1">
                  Patient Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="e.g. Arun Kumar"
                  className={`w-full px-3 py-2 rounded-lg bg-[#FBFBFA] border ${
                    errors.patientName ? 'border-[#DC2626]' : 'border-[#141414]/20 focus:border-[#141414]'
                  } text-[#141414] text-xs outline-hidden transition-all`}
                />
                {errors.patientName && <p className="text-[10px] text-[#DC2626] mt-1">{errors.patientName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141414] mb-1">
                  Age <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 45"
                  className={`w-full px-3 py-2 rounded-lg bg-[#FBFBFA] border ${
                    errors.age ? 'border-[#DC2626]' : 'border-[#141414]/20 focus:border-[#141414]'
                  } text-[#141414] text-xs font-mono outline-hidden transition-all`}
                />
                {errors.age && <p className="text-[10px] text-[#DC2626] mt-1">{errors.age}</p>}
              </div>
            </div>

            {/* Row 2: Diagnosis */}
            <div>
              <label className="block text-xs font-semibold text-[#141414] mb-1">
                Clinical Diagnosis <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="e.g. Type 2 Diabetes"
                className={`w-full px-3 py-2 rounded-lg bg-[#FBFBFA] border ${
                  errors.diagnosis ? 'border-[#DC2626]' : 'border-[#141414]/20 focus:border-[#141414]'
                } text-[#141414] text-xs outline-hidden transition-all`}
              />
              {errors.diagnosis && <p className="text-[10px] text-[#DC2626] mt-1">{errors.diagnosis}</p>}
            </div>

            {/* Row 3: Prescription */}
            <div>
              <label className="block text-xs font-semibold text-[#141414] mb-1">
                Prescription / Treatment Plan <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.prescription}
                onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                placeholder="e.g. Metformin 500mg"
                className={`w-full px-3 py-2 rounded-lg bg-[#FBFBFA] border ${
                  errors.prescription ? 'border-[#DC2626]' : 'border-[#141414]/20 focus:border-[#141414]'
                } text-[#141414] text-xs outline-hidden transition-all resize-none`}
              />
              {errors.prescription && <p className="text-[10px] text-[#DC2626] mt-1">{errors.prescription}</p>}
            </div>

            {/* Row 4: Doctor Name, Hospital, Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#141414] mb-1">
                  Doctor Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  placeholder="e.g. Dr. Priya Sharma"
                  className={`w-full px-3 py-2 rounded-lg bg-[#FBFBFA] border ${
                    errors.doctorName ? 'border-[#DC2626]' : 'border-[#141414]/20 focus:border-[#141414]'
                  } text-[#141414] text-xs outline-hidden transition-all`}
                />
                {errors.doctorName && <p className="text-[10px] text-[#DC2626] mt-1">{errors.doctorName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141414] mb-1">
                  Hospital / Facility <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  placeholder="e.g. City Care Hospital"
                  className={`w-full px-3 py-2 rounded-lg bg-[#FBFBFA] border ${
                    errors.hospital ? 'border-[#DC2626]' : 'border-[#141414]/20 focus:border-[#141414]'
                  } text-[#141414] text-xs outline-hidden transition-all`}
                />
                {errors.hospital && <p className="text-[10px] text-[#DC2626] mt-1">{errors.hospital}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141414] mb-1">
                  Date of Record <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g. 01-09-2026"
                  className={`w-full px-3 py-2 rounded-lg bg-[#FBFBFA] border ${
                    errors.date ? 'border-[#DC2626]' : 'border-[#141414]/20 focus:border-[#141414]'
                  } text-[#141414] text-xs font-mono outline-hidden transition-all`}
                />
                {errors.date && <p className="text-[10px] text-[#DC2626] mt-1">{errors.date}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#141414]/15">
              <button
                type="button"
                onClick={() => setFormData({ ...PRESET_PATIENTS[0].data })}
                className="text-xs text-[#141414]/60 hover:text-[#141414] transition-colors cursor-pointer"
              >
                Reset to Default Sample
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#141414] hover:bg-[#282828] text-[#E4E3E0] font-bold text-xs shadow-xs transition-all cursor-pointer border border-[#141414]"
              >
                <FilePlus2 className="w-4 h-4" />
                <span>Create EHR Document</span>
              </button>
            </div>
          </form>
        </div>

        {/* Output Panels (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Formatted Medical Document */}
          <div className="bg-white rounded-xl p-5 border border-[#141414]/15 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#141414]/15 pb-2.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#141414]" />
                <h3 className="font-bold text-[#141414] text-xs uppercase tracking-wider font-mono">
                  Formatted Medical Record
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(canonicalDoc, 'formatted')}
                className="p-1 rounded text-[#141414]/60 hover:text-[#141414] text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Copy formatted text"
              >
                {copiedFormatted ? <Check className="w-3.5 h-3.5 text-[#15803D]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#141414]/15 font-mono text-xs space-y-1.5 text-[#141414]">
              <div className="text-center font-bold text-[#141414] pb-2 border-b border-[#141414]/15 text-[11px] tracking-wide">
                ELECTRONIC HEALTH RECORD
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1">
                <span className="text-[#141414]/60">Patient ID</span>
                <span className="col-span-2 text-[#141414] font-bold">{ehrDoc.patientId}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-[#141414]/60">Patient Name</span>
                <span className="col-span-2 text-[#141414]">{ehrDoc.patientName}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-[#141414]/60">Age</span>
                <span className="col-span-2 text-[#141414]">{ehrDoc.age}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-[#141414]/60">Diagnosis</span>
                <span className="col-span-2 text-[#141414] font-semibold">{ehrDoc.diagnosis}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-[#141414]/60">Prescription</span>
                <span className="col-span-2 text-[#15803D] font-bold">{ehrDoc.prescription}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-[#141414]/60">Doctor</span>
                <span className="col-span-2 text-[#141414]">{ehrDoc.doctorName}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-[#141414]/60">Hospital</span>
                <span className="col-span-2 text-[#141414]">{ehrDoc.hospital}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-[#141414]/60">Date</span>
                <span className="col-span-2 text-[#141414]">{ehrDoc.date}</span>
              </div>
            </div>
          </div>

          {/* Canonical Document String */}
          <div className="bg-white rounded-xl p-5 border border-[#141414]/15 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#141414]/15 pb-2.5">
              <div>
                <h3 className="font-bold text-[#141414] text-xs uppercase tracking-wider font-mono">
                  Deterministic Canonical String
                </h3>
                <p className="text-[10px] text-[#141414]/60 font-sans">Standardized payload hashed by cryptographic engine</p>
              </div>
              <button
                onClick={() => copyToClipboard(canonicalDoc, 'canonical')}
                className="p-1 rounded text-[#141414]/60 hover:text-[#141414] text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Copy canonical string"
              >
                {copiedCanonical ? <Check className="w-3.5 h-3.5 text-[#15803D]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3 bg-[#141414] text-[#E4E3E0] rounded-xl border border-[#141414] font-mono text-[11px] whitespace-pre leading-relaxed overflow-x-auto">
              {canonicalDoc}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-[#141414]/60 font-mono">
                Payload Size: {new Blob([canonicalDoc]).size} bytes
              </span>
              <button
                onClick={() => setCurrentView('hashing')}
                className="flex items-center gap-1.5 text-xs text-[#141414] hover:text-black font-bold transition-colors cursor-pointer"
              >
                <span>Proceed to Hashing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
