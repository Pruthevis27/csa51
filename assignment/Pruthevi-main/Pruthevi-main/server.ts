import express, { Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

interface SessionKeys {
  privateKeyPem: string;
  publicKeyPem: string;
  keySize: number;
  generatedAt: string;
}

// In-memory key store for session
let currentKeyPair: SessionKeys | null = null;

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

/**
 * Utility: Compute SHA-256 fingerprint of a public key
 */
function getPublicKeyFingerprint(publicKeyPem: string): string {
  const clean = publicKeyPem
    .replace(/-----BEGIN PUBLIC KEY-----/g, '')
    .replace(/-----END PUBLIC KEY-----/g, '')
    .replace(/\s+/g, '');
  const buffer = Buffer.from(clean, 'base64');
  return crypto.createHash('sha256').update(buffer).digest('hex').match(/.{1,2}/g)?.join(':').toUpperCase() || '';
}

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

/**
 * GET /api/status
 */
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    system: 'EHR Security System Cryptographic Engine',
    algorithms: {
      hash: ['SHA-256', 'SHA-3-256'],
      asymmetric: 'RSA-2048',
      signature: 'RSA-PSS (salt=digest, hash=SHA-256)',
    },
    hasActiveKeyPair: !!currentKeyPair,
    keySize: currentKeyPair ? currentKeyPair.keySize : null,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/ehr/create
 */
app.post('/api/ehr/create', (req: Request, res: Response) => {
  try {
    const { patientId, patientName, age, diagnosis, prescription, doctorName, hospital, date } = req.body;

    if (!patientId || !patientName || !diagnosis || !prescription || !doctorName || !hospital || !date) {
      return res.status(400).json({ error: 'All medical fields are required.' });
    }

    const canonicalDocument = [
      `Patient ID: ${String(patientId).trim()}`,
      `Patient Name: ${String(patientName).trim()}`,
      `Age: ${age}`,
      `Diagnosis: ${String(diagnosis).trim()}`,
      `Prescription: ${String(prescription).trim()}`,
      `Doctor: ${String(doctorName).trim()}`,
      `Hospital: ${String(hospital).trim()}`,
      `Date: ${String(date).trim()}`,
    ].join('\n');

    res.json({
      status: 'success',
      canonicalDocument,
      documentData: {
        patientId,
        patientName,
        age,
        diagnosis,
        prescription,
        doctorName,
        hospital,
        date,
      },
      byteLength: Buffer.byteLength(canonicalDocument, 'utf8'),
      createdAt: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error processing EHR creation' });
  }
});

/**
 * POST /api/hash
 * Generates real SHA-256 and SHA-3-256 digests with precise timing
 */
app.post('/api/hash', (req: Request, res: Response) => {
  try {
    const { document } = req.body;
    if (typeof document !== 'string') {
      return res.status(400).json({ error: 'Document string is required.' });
    }

    const docBuffer = Buffer.from(document, 'utf8');

    // SHA-256 timing
    const t0_sha256 = process.hrtime.bigint();
    const sha256Hash = crypto.createHash('sha256').update(docBuffer).digest('hex');
    const t1_sha256 = process.hrtime.bigint();
    const sha256TimeMs = Number(t1_sha256 - t0_sha256) / 1_000_000;

    // SHA-3-256 timing
    const t0_sha3 = process.hrtime.bigint();
    const sha3Hash = crypto.createHash('sha3-256').update(docBuffer).digest('hex');
    const t1_sha3 = process.hrtime.bigint();
    const sha3TimeMs = Number(t1_sha3 - t0_sha3) / 1_000_000;

    res.json({
      sha256: {
        algorithm: 'SHA-256',
        digest: sha256Hash,
        bitLength: 256,
        timeMs: Math.max(0.001, Number(sha256TimeMs.toFixed(4))),
      },
      sha3_256: {
        algorithm: 'SHA-3-256',
        digest: sha3Hash,
        bitLength: 256,
        timeMs: Math.max(0.001, Number(sha3TimeMs.toFixed(4))),
      },
      documentByteLength: docBuffer.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error computing hashes' });
  }
});

/**
 * POST /api/keys/generate
 * Generates real RSA-2048 key pair
 */
app.post('/api/keys/generate', (req: Request, res: Response) => {
  try {
    const keySize = 2048;
    const t0 = process.hrtime.bigint();

    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: keySize,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    const t1 = process.hrtime.bigint();
    const timeMs = Number(t1 - t0) / 1_000_000;

    currentKeyPair = {
      privateKeyPem: privateKey,
      publicKeyPem: publicKey,
      keySize,
      generatedAt: new Date().toISOString(),
    };

    const fingerprint = getPublicKeyFingerprint(publicKey);

    res.json({
      status: 'success',
      algorithm: 'RSA-2048',
      keySize,
      publicKeyPem: publicKey,
      publicKeyFingerprint: fingerprint,
      hasPrivateKey: true,
      timeMs: Number(timeMs.toFixed(3)),
      generatedAt: currentKeyPair.generatedAt,
      securityNote: 'Private key is securely stored in backend session memory and never exposed in plaintext.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error generating RSA key pair' });
  }
});

/**
 * POST /api/sign
 * Signs the canonical EHR document using RSA-2048 + RSA-PSS + SHA-256
 */
app.post('/api/sign', (req: Request, res: Response) => {
  try {
    const { document, customPrivateKey } = req.body;
    if (!document || typeof document !== 'string') {
      return res.status(400).json({ error: 'Document string is required for signing.' });
    }

    const privateKeyToUse = customPrivateKey || (currentKeyPair ? currentKeyPair.privateKeyPem : null);

    if (!privateKeyToUse) {
      return res.status(400).json({
        error: 'No private key available. Please generate an RSA key pair first.',
      });
    }

    const docBuffer = Buffer.from(document, 'utf8');
    const t0 = process.hrtime.bigint();

    // RSA-PSS with SHA-256 digest
    const signature = crypto.sign(
      'sha256',
      docBuffer,
      {
        key: privateKeyToUse,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      }
    );

    const t1 = process.hrtime.bigint();
    const timeMs = Number(t1 - t0) / 1_000_000;
    const signatureBase64 = signature.toString('base64');

    res.json({
      algorithm: 'RSA-2048 + RSA-PSS + SHA-256',
      signatureBase64,
      status: '✓ Signature created successfully',
      timeMs: Number(timeMs.toFixed(4)),
      byteLength: signature.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: `Signing failed: ${err.message}` });
  }
});

/**
 * POST /api/verify
 * Verifies digital signature with document and RSA public key
 */
app.post('/api/verify', (req: Request, res: Response) => {
  try {
    const { document, signatureBase64, publicKeyPem } = req.body;

    if (!document || typeof document !== 'string') {
      return res.status(400).json({ error: 'Document string is required for verification.' });
    }
    if (!signatureBase64 || typeof signatureBase64 !== 'string') {
      return res.status(400).json({ error: 'Digital signature is required for verification.' });
    }

    const pubKey = publicKeyPem || (currentKeyPair ? currentKeyPair.publicKeyPem : null);
    if (!pubKey) {
      return res.status(400).json({ error: 'Public key is required for verification.' });
    }

    const docBuffer = Buffer.from(document, 'utf8');
    const sigBuffer = Buffer.from(signatureBase64, 'base64');

    const t0 = process.hrtime.bigint();
    let isValid = false;

    try {
      isValid = crypto.verify(
        'sha256',
        docBuffer,
        {
          key: pubKey,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
        },
        sigBuffer
      );
    } catch (verifyErr) {
      isValid = false;
    }

    const t1 = process.hrtime.bigint();
    const timeMs = Number(t1 - t0) / 1_000_000;

    res.json({
      valid: isValid,
      integrity: isValid,
      authentication: isValid,
      message: isValid
        ? 'The EHR matches the signed content. Document integrity and provider authentication verified.'
        : 'The document may have been modified or the signature/public key is incorrect.',
      timeMs: Number(timeMs.toFixed(4)),
      details: {
        hashAlgorithm: 'SHA-256',
        signatureScheme: 'RSA-PSS',
        keySize: 2048,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: `Verification failed: ${err.message}` });
  }
});

/**
 * POST /api/tamper-test
 * Tests tampering detection by comparing hashes and attempting signature verification
 */
app.post('/api/tamper-test', (req: Request, res: Response) => {
  try {
    const { originalDocument, modifiedDocument, signatureBase64, publicKeyPem } = req.body;

    if (!originalDocument || !modifiedDocument) {
      return res.status(400).json({ error: 'Both original and modified documents are required.' });
    }

    const origBuffer = Buffer.from(originalDocument, 'utf8');
    const modBuffer = Buffer.from(modifiedDocument, 'utf8');

    const t0 = process.hrtime.bigint();

    const originalHash = crypto.createHash('sha256').update(origBuffer).digest('hex');
    const modifiedHash = crypto.createHash('sha256').update(modBuffer).digest('hex');
    const hashMatch = originalHash === modifiedHash;

    const pubKey = publicKeyPem || (currentKeyPair ? currentKeyPair.publicKeyPem : null);
    let signatureValid = false;

    if (signatureBase64 && pubKey) {
      try {
        signatureValid = crypto.verify(
          'sha256',
          modBuffer,
          {
            key: pubKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
          },
          Buffer.from(signatureBase64, 'base64')
        );
      } catch (e) {
        signatureValid = false;
      }
    }

    const t1 = process.hrtime.bigint();
    const timeMs = Number(t1 - t0) / 1_000_000;

    const tamperingDetected = !hashMatch || !signatureValid;

    res.json({
      originalHash,
      modifiedHash,
      hashMatch,
      signatureValid,
      tamperingDetected,
      integrityValid: !tamperingDetected,
      authenticationValid: signatureValid,
      timeMs: Number(timeMs.toFixed(4)),
      diffSummary: {
        originalLength: origBuffer.length,
        modifiedLength: modBuffer.length,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: `Tamper test error: ${err.message}` });
  }
});

/**
 * POST /api/benchmark
 * Real execution performance measurement across algorithms
 */
app.post('/api/benchmark', (req: Request, res: Response) => {
  try {
    const testDoc = 'Patient ID: P1001\nPatient Name: Arun Kumar\nAge: 45\nDiagnosis: Type 2 Diabetes\nPrescription: Metformin 500mg\nDoctor: Dr. Priya Sharma\nHospital: City Care Hospital\nDate: 01-09-2026';
    const docBuffer = Buffer.from(testDoc, 'utf8');

    // Benchmark SHA-256 (1000 iterations)
    const iters = 500;
    const t0_sha256 = process.hrtime.bigint();
    for (let i = 0; i < iters; i++) {
      crypto.createHash('sha256').update(docBuffer).digest('hex');
    }
    const t1_sha256 = process.hrtime.bigint();
    const sha256AvgMs = Number(t1_sha256 - t0_sha256) / (iters * 1_000_000);

    // Benchmark SHA-3-256 (500 iterations)
    const t0_sha3 = process.hrtime.bigint();
    for (let i = 0; i < iters; i++) {
      crypto.createHash('sha3-256').update(docBuffer).digest('hex');
    }
    const t1_sha3 = process.hrtime.bigint();
    const sha3AvgMs = Number(t1_sha3 - t0_sha3) / (iters * 1_000_000);

    // Benchmark RSA KeyGen (3 iterations for responsiveness)
    const keyIters = 3;
    const t0_keygen = process.hrtime.bigint();
    let tempPair;
    for (let i = 0; i < keyIters; i++) {
      tempPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
    }
    const t1_keygen = process.hrtime.bigint();
    const keygenAvgMs = Number(t1_keygen - t0_keygen) / (keyIters * 1_000_000);

    // Benchmark RSA Signing (50 iterations)
    const signIters = 50;
    const t0_sign = process.hrtime.bigint();
    let sigBuf: Buffer = Buffer.alloc(0);
    for (let i = 0; i < signIters; i++) {
      sigBuf = crypto.sign('sha256', docBuffer, {
        key: tempPair!.privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      });
    }
    const t1_sign = process.hrtime.bigint();
    const signAvgMs = Number(t1_sign - t0_sign) / (signIters * 1_000_000);

    // Benchmark RSA Verification (50 iterations)
    const t0_verify = process.hrtime.bigint();
    for (let i = 0; i < signIters; i++) {
      crypto.verify(
        'sha256',
        docBuffer,
        {
          key: tempPair!.publicKey,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
        },
        sigBuf
      );
    }
    const t1_verify = process.hrtime.bigint();
    const verifyAvgMs = Number(t1_verify - t0_verify) / (signIters * 1_000_000);

    res.json({
      sha256: Number(sha256AvgMs.toFixed(4)),
      sha3_256: Number(sha3AvgMs.toFixed(4)),
      rsaKeyGen: Number(keygenAvgMs.toFixed(3)),
      rsaSigning: Number(signAvgMs.toFixed(4)),
      rsaVerification: Number(verifyAvgMs.toFixed(4)),
      environment: `Node ${process.version} / OpenSSL ${process.versions.openssl}`,
      measuredAt: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: `Benchmark error: ${err.message}` });
  }
});

// ----------------------------------------------------
// VITE DEV / PRODUCTION MIDDLEWARE
// ----------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EHR Security System] Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
