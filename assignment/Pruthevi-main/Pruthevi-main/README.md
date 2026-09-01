# EHR Security System: Medical Document Integrity & Authentication

> **College Cryptography Project**  
> **Topic:** Evaluation of Cryptographic Hash Functions and Digital Signatures in Electronic Health Record Security  
> **Course Outcomes:** CO2 (Asymmetric Public Key Cryptosystems), CO3 (Hash Algorithms & Digital Signatures)  
> **SDG Alignment:** SDG 3 (Good Health & Well-being), SDG 9 (Industry, Innovation & Infrastructure), SDG 16 (Peace, Justice & Strong Institutions)

---

## 1. Executive Summary

In telemedicine workflows, sensitive Electronic Health Records (EHRs) are transmitted across distributed networks between hospitals, clinics, diagnostic laboratories, and insurance portals. Unauthorized modification of diagnoses or medication dosages during transit can directly endanger patient life. 

This project implements a secure full-stack cryptographic architecture that guarantees:
1. **Data Integrity:** Ensuring medical records have not been altered or corrupted in transit using SHA-256 and SHA-3-256.
2. **Source Authentication:** Proving the clinical record originated from the legitimate registered healthcare provider via RSA-2048 and RSA-PSS.
3. **Non-Repudiation:** Preventing the originating doctor from denying authorship of the signed medical order.
4. **Instant Tamper Detection:** Demonstrating that even a single-character or single-bit change during transit invalidates signature verification.

---

## 2. Cryptographic Architecture & Flow

```text
[ Patient Medical Form ] 
          │
          ▼
[ Canonical Serialization ] ──► Standardized UTF-8 String (Deterministic)
          │
          ▼
[ SHA-256 / SHA-3-256 ] ────► 256-bit Cryptographic Hash Digest
          │
          ▼
[ RSA-PSS + SHA-256 ] ──────► Digital Signature (2048-bit Private Key)
          │
          ▼
   [ Transit Channel ]  ◄──── Simulated Malicious Interception & Tampering
          │
          ▼
[ RSA-PSS Verification ] ───► Public Key Verification & Avalanche Analysis
          │
     ┌────┴──────────────────────────┐
     ▼                               ▼
[ ✓ VALID ]                     [ ✗ TAMPERING DETECTED ]
Integrity Preserved             Signature Invalidation
Authentication Confirmed        Integrity Violated
```

---

## 3. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend API & Crypto Engine:** Node.js Express (Built-in WebCrypto / OpenSSL) & Python 3 FastAPI (`cryptography` library)
- **Hashing Algorithms:** SHA-256 (NIST FIPS 180-4) and SHA-3-256 (NIST FIPS 202)
- **Signature Scheme:** RSA-2048 with Probabilistic Signature Scheme (RSA-PSS) padding and SHA-256 digest
- **Key Format:** SPKI / PKCS#8 PEM Encoding with SHA-256 fingerprinting

---

## 4. Key Application Features

1. **EHR Document Creator & Canonicalizer:**
   - Interactive medical form with sample patient presets (Arun Kumar, Maya Patel, Vikram Sengupta).
   - Strict field validation (patient ID, age, diagnosis, dosage, doctor, hospital, date).
   - Deterministic newline-separated canonical string generator.

2. **Dual Hash Engine & Live Benchmark:**
   - Real-time SHA-256 and SHA-3-256 digest generation with hardware execution latency measurements.
   - Comparative evaluation matrix contrasting Merkle-Damgård vs. Sponge constructions.

3. **RSA-2048 Key Pair Manager:**
   - Cryptographically secure 2048-bit prime pair generation.
   - Public key SPKI PEM viewer with SHA-256 key fingerprinting.
   - Private key safety guarantee (secure in-memory residency, never exposed in plaintext).

4. **RSA-PSS Digital Signature Generator:**
   - Standardized probabilistic signing pipeline with Base64 output.
   - Comprehensive status badges and execution timer.

5. **Signature Verification Interface:**
   - Independent 3-parameter verification: received canonical EHR payload, Base64 signature, and provider public key.
   - Real-time diagnostic cards for Document Integrity, Provider Authentication, and Signature Validity.

6. **Viva Tamper Detection Sandbox:**
   - Dual-panel comparison: Original Signed Record vs. Modified Record.
   - 1-click attack injections: Alter diagnosis (Type 2 → Type 1 Diabetes), alter dosage (500mg → 2000mg), forge doctor name, or modify hospital.
   - Direct hash difference visualization with mismatch indicators and theoretical explanation.

7. **Cryptographic Evaluation & Benchmark Dashboard:**
   - Live hardware execution time benchmarks for hashing, key generation, signing, and verification.
   - Security mechanism breakdowns and formal academic protocol recommendations.

8. **Security Audit Log & Guided Walkthrough:**
   - Real-time chronological audit drawer tracking every cryptographic event.
   - Interactive 7-step guided workflow bar for college project demonstrations.

---

## 5. Running the Application

### Option A: Complete Full-Stack Web Application (Node + React)

```bash
# Install dependencies (if not already installed)
npm install

# Start development server on port 3000
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open `http://localhost:3000` in your web browser.

### Option B: Running the Python FastAPI Backend & Unit Tests

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install fastapi uvicorn pydantic cryptography pytest httpx

# Run the automated cryptographic unit test suite
pytest tests/test_crypto.py -v

# Run the FastAPI server directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 6. Verification Test Cases & Expected Outcomes

| Test Case | EHR Document | Signature | Public Key | Expected Result | Cryptographic Explanation |
|---|---|---|---|---|---|
| **1. Authentic Record** | Original Canonical String | Original Base64 Signature | Matching Provider Public Key | `✓ VALID` | SHA-256 hash matches signed digest; RSA-PSS verifies successfully. |
| **2. Altered Dosage** | "Metformin 1000mg" | Original Base64 Signature | Matching Provider Public Key | `✗ TAMPERING DETECTED` | Avalanche effect alters hash; original signature invalid for new digest. |
| **3. Altered Diagnosis** | "Type 1 Diabetes" | Original Base64 Signature | Matching Provider Public Key | `✗ TAMPERING DETECTED` | Hash mismatch; integrity check fails. |
| **4. Corrupted Signature** | Original Canonical String | Mutated Base64 String | Matching Provider Public Key | `✗ INVALID SIGNATURE` | RSA-PSS mathematical verification fails. |
| **5. Wrong Public Key** | Original Canonical String | Original Base64 Signature | Alternate Doctor Public Key | `✗ AUTHENTICATION FAILED` | Signature cannot be verified with non-matching public key. |

---

## 7. Recommended Academic Protocol

**Recommendation:** **SHA-256 + RSA-2048 using RSA-PSS**

- **Integrity:** SHA-256 provides strong 128-bit collision resistance against brute-force attacks.
- **Authentication:** RSA-2048 ensures high computational hardness against unauthorized signature forgery.
- **Security:** RSA-PSS eliminates deterministic signature vulnerabilities present in textbook RSA or PKCS#1 v1.5 padding.
- **Performance:** Sub-millisecond hashing and verification overhead suitable for real-time telemedicine systems.

---

## 8. Academic Disclaimer

*This application is developed strictly for educational demonstration and laboratory evaluation as part of a college cryptography curriculum. All patient names, identifiers, and clinical records are purely fictional.*
