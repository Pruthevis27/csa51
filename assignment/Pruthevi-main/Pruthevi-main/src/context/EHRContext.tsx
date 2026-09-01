import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  EHRDocument,
  HashResult,
  KeyPairResult,
  SignatureResult,
  VerificationResult,
  TamperTestResult,
  AuditLogEntry,
  AppView,
} from '../types';
import { SAMPLE_EHR, generateCanonicalDocument } from '../utils/canonical';
import {
  createEhrApi,
  computeHashesApi,
  generateKeysApi,
  signDocumentApi,
  verifySignatureApi,
  runTamperTestApi,
  checkServerStatusApi,
} from '../services/api';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface EHRContextType {
  // Current view
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // EHR Data
  ehrDoc: EHRDocument;
  setEhrDoc: React.Dispatch<React.SetStateAction<EHRDocument>>;
  canonicalDoc: string;
  updateEhrDoc: (doc: EHRDocument) => Promise<void>;

  // Hashing
  hashes: {
    sha256: HashResult | null;
    sha3_256: HashResult | null;
  };
  isHashing: boolean;
  generateHashes: (docOverride?: string) => Promise<void>;

  // RSA Key Pair
  keyPair: KeyPairResult | null;
  isGeneratingKeys: boolean;
  generateKeyPair: () => Promise<KeyPairResult | null>;

  // Digital Signature
  signatureResult: SignatureResult | null;
  isSigning: boolean;
  createSignature: (docOverride?: string) => Promise<SignatureResult | null>;

  // Verification
  verificationResult: VerificationResult | null;
  isVerifying: boolean;
  verifyDocument: (
    docOverride?: string,
    signatureOverride?: string,
    keyOverride?: string
  ) => Promise<VerificationResult | null>;

  // Tamper Testing
  modifiedEhrDoc: EHRDocument;
  setModifiedEhrDoc: React.Dispatch<React.SetStateAction<EHRDocument>>;
  tamperResult: TamperTestResult | null;
  isTamperTesting: boolean;
  runTamperTest: (tamperedDocOverride?: EHRDocument) => Promise<void>;
  resetTamperDoc: () => void;

  // Audit Logs
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, result: AuditLogEntry['result'], details: string) => void;
  clearAuditLogs: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (type: Toast['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Guided Walkthrough
  isGuidedMode: boolean;
  setIsGuidedMode: (val: boolean) => void;
  guidedStep: number;
  setGuidedStep: (step: number) => void;
  advanceGuidedStep: () => void;

  // Server health
  isBackendConnected: boolean;
  resetAllState: () => void;
}

const EHRContext = createContext<EHRContextType | undefined>(undefined);

export const EHRProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  // EHR Document state
  const [ehrDoc, setEhrDoc] = useState<EHRDocument>(SAMPLE_EHR);
  const [canonicalDoc, setCanonicalDoc] = useState<string>(generateCanonicalDocument(SAMPLE_EHR));

  // Hashing state
  const [hashes, setHashes] = useState<{
    sha256: HashResult | null;
    sha3_256: HashResult | null;
  }>({ sha256: null, sha3_256: null });
  const [isHashing, setIsHashing] = useState<boolean>(false);

  // Key Pair state
  const [keyPair, setKeyPair] = useState<KeyPairResult | null>(null);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState<boolean>(false);

  // Digital Signature state
  const [signatureResult, setSignatureResult] = useState<SignatureResult | null>(null);
  const [isSigning, setIsSigning] = useState<boolean>(false);

  // Verification state
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Tamper state
  const [modifiedEhrDoc, setModifiedEhrDoc] = useState<EHRDocument>({
    ...SAMPLE_EHR,
    diagnosis: 'Type 1 Diabetes', // Default tampering example
  });
  const [tamperResult, setTamperResult] = useState<TamperTestResult | null>(null);
  const [isTamperTesting, setIsTamperTesting] = useState<boolean>(false);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      action: 'System Initialized',
      result: 'INFO',
      details: 'Cryptographic security module initialized. Ready for EHR ingestion.',
    },
  ]);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Guided Walkthrough
  const [isGuidedMode, setIsGuidedMode] = useState<boolean>(false);
  const [guidedStep, setGuidedStep] = useState<number>(1);

  // Backend connection status
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);

  const addToast = (type: Toast['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (action: string, result: AuditLogEntry['result'], details: string) => {
    const newEntry: AuditLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      action,
      result,
      details,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    addToast('info', 'Audit Logs Cleared', 'The session event log has been reset.');
  };

  // Heartbeat check on mount
  useEffect(() => {
    checkServerStatusApi()
      .then(() => setIsBackendConnected(true))
      .catch(() => setIsBackendConnected(false));
  }, []);

  // Update canonical doc whenever ehrDoc changes
  useEffect(() => {
    setCanonicalDoc(generateCanonicalDocument(ehrDoc));
  }, [ehrDoc]);

  // Create EHR Action
  const updateEhrDoc = async (doc: EHRDocument) => {
    try {
      const res = await createEhrApi(doc);
      setEhrDoc(doc);
      setCanonicalDoc(res.canonicalDocument);
      setModifiedEhrDoc({ ...doc, diagnosis: `${doc.diagnosis} (Altered)` });
      // Invalidate downstream cryptographic state
      setHashes({ sha256: null, sha3_256: null });
      setSignatureResult(null);
      setVerificationResult(null);
      setTamperResult(null);

      addAuditLog('EHR Created', 'SUCCESS', `Patient ID: ${doc.patientId} — ${doc.patientName}`);
      addToast('success', 'EHR Created', `Canonical document generated (${res.byteLength} bytes).`);
    } catch (err: any) {
      addToast('error', 'Creation Failed', err.message || 'Failed to create EHR');
    }
  };

  // Generate Hashes Action
  const generateHashes = async (docOverride?: string) => {
    setIsHashing(true);
    try {
      const targetDoc = docOverride || canonicalDoc;
      const res = await computeHashesApi(targetDoc);
      setHashes({
        sha256: res.sha256,
        sha3_256: res.sha3_256,
      });

      addAuditLog(
        'Hashes Generated',
        'SUCCESS',
        `SHA-256 (${res.sha256.timeMs.toFixed(3)}ms) & SHA-3-256 (${res.sha3_256.timeMs.toFixed(3)}ms)`
      );
      addToast('success', 'Digests Generated', 'SHA-256 and SHA-3-256 computed on canonical record.');
    } catch (err: any) {
      addToast('error', 'Hashing Error', err.message || 'Failed to compute hashes');
    } finally {
      setIsHashing(false);
    }
  };

  // Generate RSA Key Pair Action
  const generateKeyPair = async (): Promise<KeyPairResult | null> => {
    setIsGeneratingKeys(true);
    try {
      const res = await generateKeysApi();
      setKeyPair(res);
      // Invalidate signature
      setSignatureResult(null);
      setVerificationResult(null);
      setTamperResult(null);

      addAuditLog(
        'RSA-2048 Key Pair Generated',
        'SUCCESS',
        `Public Key Fingerprint: ${res.publicKeyFingerprint.substring(0, 17)}... (${res.timeMs?.toFixed(2)}ms)`
      );
      addToast('success', 'RSA Keys Generated', '2048-bit key pair generated securely. Private key protected.');
      return res;
    } catch (err: any) {
      addToast('error', 'Key Generation Failed', err.message || 'Error generating RSA keys');
      return null;
    } finally {
      setIsGeneratingKeys(false);
    }
  };

  // Sign Document Action
  const createSignature = async (docOverride?: string): Promise<SignatureResult | null> => {
    if (!keyPair) {
      addToast('warning', 'Key Pair Required', 'Please generate an RSA key pair before signing.');
      return null;
    }

    setIsSigning(true);
    try {
      const targetDoc = docOverride || canonicalDoc;
      const res = await signDocumentApi(targetDoc);
      setSignatureResult(res);
      setVerificationResult(null);
      setTamperResult(null);

      addAuditLog('RSA Signature Created', 'SUCCESS', `RSA-PSS + SHA-256 (${res.timeMs.toFixed(3)}ms)`);
      addToast('success', 'Document Signed', 'Cryptographic signature generated via RSA-PSS.');
      return res;
    } catch (err: any) {
      addToast('error', 'Signing Error', err.message || 'Failed to sign document');
      return null;
    } finally {
      setIsSigning(false);
    }
  };

  // Verify Document Action
  const verifyDocument = async (
    docOverride?: string,
    signatureOverride?: string,
    keyOverride?: string
  ): Promise<VerificationResult | null> => {
    const targetDoc = docOverride !== undefined ? docOverride : canonicalDoc;
    const targetSig = signatureOverride !== undefined ? signatureOverride : signatureResult?.signatureBase64;
    const targetKey = keyOverride !== undefined ? keyOverride : keyPair?.publicKeyPem;

    if (!targetSig) {
      addToast('warning', 'Signature Required', 'Please sign the document before verification.');
      return null;
    }
    if (!targetKey) {
      addToast('warning', 'Public Key Required', 'Public key is required to verify the signature.');
      return null;
    }

    setIsVerifying(true);
    try {
      const res = await verifySignatureApi(targetDoc, targetSig, targetKey);
      setVerificationResult(res);

      if (res.valid) {
        addAuditLog('Signature Verification', 'VALID', `Integrity: VALID | Provider: VERIFIED (${res.timeMs.toFixed(3)}ms)`);
        addToast('success', 'Verification Success', 'Signature is authentic. Document unmodified.');
      } else {
        addAuditLog('Signature Verification', 'INVALID', 'Integrity: FAILED | Tampering or Key Mismatch Detected');
        addToast('error', 'Verification Failed', 'Signature mismatch. Document has been altered.');
      }
      return res;
    } catch (err: any) {
      addToast('error', 'Verification Error', err.message || 'Error executing verification');
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  // Run Tamper Test Action
  const runTamperTest = async (tamperedDocOverride?: EHRDocument) => {
    if (!signatureResult || !keyPair) {
      addToast('warning', 'Prerequisites Missing', 'Please generate keys and sign the original EHR first.');
      return;
    }

    const modifiedDocToTest = tamperedDocOverride || modifiedEhrDoc;
    const origCanonical = canonicalDoc;
    const modCanonical = generateCanonicalDocument(modifiedDocToTest);

    setIsTamperTesting(true);
    try {
      const res = await runTamperTestApi(
        origCanonical,
        modCanonical,
        signatureResult.signatureBase64,
        keyPair.publicKeyPem
      );
      setTamperResult(res);

      if (res.tamperingDetected) {
        addAuditLog(
          'Tampering Detected',
          'TAMPERED',
          `Original Hash ≠ Modified Hash (${res.originalHash.substring(0, 8)}... ≠ ${res.modifiedHash.substring(0, 8)}...)`
        );
        addToast('error', 'Tampering Detected!', 'Modified document failed signature verification.');
      } else {
        addAuditLog('Tamper Test', 'VALID', 'No modifications detected between documents.');
        addToast('success', 'Documents Identical', 'Hashes match and signature is valid.');
      }
    } catch (err: any) {
      addToast('error', 'Tamper Test Error', err.message || 'Failed to execute tamper test');
    } finally {
      setIsTamperTesting(false);
    }
  };

  const resetTamperDoc = () => {
    setModifiedEhrDoc({ ...ehrDoc });
    setTamperResult(null);
    addToast('info', 'Reset', 'Modified EHR restored to original values.');
  };

  const advanceGuidedStep = () => {
    if (guidedStep < 7) {
      setGuidedStep((s) => s + 1);
    }
  };

  const resetAllState = () => {
    setEhrDoc(SAMPLE_EHR);
    setCanonicalDoc(generateCanonicalDocument(SAMPLE_EHR));
    setHashes({ sha256: null, sha3_256: null });
    setKeyPair(null);
    setSignatureResult(null);
    setVerificationResult(null);
    setModifiedEhrDoc({ ...SAMPLE_EHR, diagnosis: 'Type 1 Diabetes' });
    setTamperResult(null);
    setGuidedStep(1);
    addAuditLog('System Reset', 'INFO', 'All cryptographic states cleared.');
    addToast('info', 'System Reset', 'Reset back to initial state.');
  };

  return (
    <EHRContext.Provider
      value={{
        currentView,
        setCurrentView,
        ehrDoc,
        setEhrDoc,
        canonicalDoc,
        updateEhrDoc,
        hashes,
        isHashing,
        generateHashes,
        keyPair,
        isGeneratingKeys,
        generateKeyPair,
        signatureResult,
        isSigning,
        createSignature,
        verificationResult,
        isVerifying,
        verifyDocument,
        modifiedEhrDoc,
        setModifiedEhrDoc,
        tamperResult,
        isTamperTesting,
        runTamperTest,
        resetTamperDoc,
        auditLogs,
        addAuditLog,
        clearAuditLogs,
        toasts,
        addToast,
        removeToast,
        isGuidedMode,
        setIsGuidedMode,
        guidedStep,
        setGuidedStep,
        advanceGuidedStep,
        isBackendConnected,
        resetAllState,
      }}
    >
      {children}
    </EHRContext.Provider>
  );
};

export const useEHR = () => {
  const context = useContext(EHRContext);
  if (!context) {
    throw new Error('useEHR must be used within an EHRProvider');
  }
  return context;
};
