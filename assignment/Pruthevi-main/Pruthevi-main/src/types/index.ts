export interface EHRDocument {
  patientId: string;
  patientName: string;
  age: number | string;
  diagnosis: string;
  prescription: string;
  doctorName: string;
  hospital: string;
  date: string;
}

export interface HashResult {
  algorithm: string;
  digest: string;
  bitLength: number;
  timeMs: number;
}

export interface KeyPairResult {
  publicKeyPem: string;
  keySize: number;
  algorithm: string;
  publicKeyFingerprint: string;
  hasPrivateKey: boolean;
  timeMs?: number;
}

export interface SignatureResult {
  algorithm: string;
  signatureBase64: string;
  status: string;
  timeMs: number;
  timestamp: string;
}

export interface VerificationResult {
  valid: boolean;
  integrity: boolean;
  authentication: boolean;
  message: string;
  timeMs: number;
  details: {
    hashAlgorithm: string;
    signatureScheme: string;
    keySize: number;
  };
}

export interface TamperTestResult {
  originalHash: string;
  modifiedHash: string;
  hashMatch: boolean;
  signatureValid: boolean;
  tamperingDetected: boolean;
  integrityValid: boolean;
  authenticationValid: boolean;
  timeMs: number;
  diffSummary?: {
    originalLength: number;
    modifiedLength: number;
    changedFields: string[];
  };
}

export interface BenchmarkMetric {
  algorithm: string;
  operation: string;
  executionTimeMs: number;
  iterations: number;
  category: 'hash' | 'asymmetric';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  result: 'SUCCESS' | 'VALID' | 'INVALID' | 'TAMPERED' | 'INFO';
  details: string;
}

export type AppView =
  | 'dashboard'
  | 'create-ehr'
  | 'hashing'
  | 'signature'
  | 'verification'
  | 'tamper-test'
  | 'evaluation'
  | 'about';
