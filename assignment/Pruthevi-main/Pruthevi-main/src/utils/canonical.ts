import { EHRDocument } from '../types';

/**
 * Generates an unambiguous, deterministic canonical representation of an EHR document.
 * The exact same canonical representation MUST be used whenever the document is hashed or signed.
 */
export function generateCanonicalDocument(doc: EHRDocument): string {
  return [
    `Patient ID: ${doc.patientId?.trim() || ''}`,
    `Patient Name: ${doc.patientName?.trim() || ''}`,
    `Age: ${doc.age}`,
    `Diagnosis: ${doc.diagnosis?.trim() || ''}`,
    `Prescription: ${doc.prescription?.trim() || ''}`,
    `Doctor: ${doc.doctorName?.trim() || ''}`,
    `Hospital: ${doc.hospital?.trim() || ''}`,
    `Date: ${doc.date?.trim() || ''}`,
  ].join('\n');
}

export const SAMPLE_EHR: EHRDocument = {
  patientId: 'P1001',
  patientName: 'Arun Kumar',
  age: 45,
  diagnosis: 'Type 2 Diabetes',
  prescription: 'Metformin 500mg',
  doctorName: 'Dr. Priya Sharma',
  hospital: 'City Care Hospital',
  date: '01-09-2026',
};

export const PRESET_PATIENTS: { label: string; data: EHRDocument }[] = [
  {
    label: 'Arun Kumar (Standard Sample)',
    data: {
      patientId: 'P1001',
      patientName: 'Arun Kumar',
      age: 45,
      diagnosis: 'Type 2 Diabetes',
      prescription: 'Metformin 500mg',
      doctorName: 'Dr. Priya Sharma',
      hospital: 'City Care Hospital',
      date: '01-09-2026',
    },
  },
  {
    label: 'Maya Patel (Cardiology)',
    data: {
      patientId: 'P1002',
      patientName: 'Maya Patel',
      age: 58,
      diagnosis: 'Essential Hypertension',
      prescription: 'Amlodipine 5mg OD, Atorvastatin 20mg HS',
      doctorName: 'Dr. Rajesh Verma',
      hospital: 'Metro Heart Institute',
      date: '01-09-2026',
    },
  },
  {
    label: 'Vikram Sengupta (Critical Care)',
    data: {
      patientId: 'P1003',
      patientName: 'Vikram Sengupta',
      age: 34,
      diagnosis: 'Acute Bronchial Asthma Exacerbation',
      prescription: 'Salbutamol Inhaler 100mcg PRN, Budesonide 200mcg BD',
      doctorName: 'Dr. Ananya Ray',
      hospital: 'Apollo Apex Hospital',
      date: '01-09-2026',
    },
  },
];
