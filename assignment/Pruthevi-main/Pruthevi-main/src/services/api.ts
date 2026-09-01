import {
  EHRDocument,
  HashResult,
  KeyPairResult,
  SignatureResult,
  VerificationResult,
  TamperTestResult,
} from '../types';

export async function createEhrApi(doc: EHRDocument): Promise<{
  canonicalDocument: string;
  documentData: EHRDocument;
  byteLength: number;
}> {
  const res = await fetch('/api/ehr/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doc),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create EHR document');
  }
  return res.json();
}

export async function computeHashesApi(document: string): Promise<{
  sha256: HashResult;
  sha3_256: HashResult;
  documentByteLength: number;
}> {
  const res = await fetch('/api/hash', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to compute hashes');
  }
  return res.json();
}

export async function generateKeysApi(): Promise<KeyPairResult> {
  const res = await fetch('/api/keys/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate RSA key pair');
  }
  return res.json();
}

export async function signDocumentApi(document: string, customPrivateKey?: string): Promise<SignatureResult> {
  const res = await fetch('/api/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document, customPrivateKey }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create digital signature');
  }
  return res.json();
}

export async function verifySignatureApi(
  document: string,
  signatureBase64: string,
  publicKeyPem?: string
): Promise<VerificationResult> {
  const res = await fetch('/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document, signatureBase64, publicKeyPem }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to verify signature');
  }
  return res.json();
}

export async function runTamperTestApi(
  originalDocument: string,
  modifiedDocument: string,
  signatureBase64: string,
  publicKeyPem?: string
): Promise<TamperTestResult> {
  const res = await fetch('/api/tamper-test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originalDocument,
      modifiedDocument,
      signatureBase64,
      publicKeyPem,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to run tamper test');
  }
  return res.json();
}

export async function runBenchmarkApi(): Promise<{
  sha256: number;
  sha3_256: number;
  rsaKeyGen: number;
  rsaSigning: number;
  rsaVerification: number;
  environment: string;
  measuredAt: string;
}> {
  const res = await fetch('/api/benchmark', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to execute cryptographic benchmark');
  }
  return res.json();
}

export async function checkServerStatusApi(): Promise<any> {
  const res = await fetch('/api/status');
  if (!res.ok) throw new Error('Backend offline');
  return res.json();
}
