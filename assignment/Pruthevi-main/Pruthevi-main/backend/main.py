import time
import hashlib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.models.schemas import (
    EHRDocumentModel,
    HashRequest,
    HashResponse,
    KeyGenResponse,
    SignRequest,
    SignResponse,
    VerifyRequest,
    VerifyResponse,
    TamperTestRequest,
    TamperTestResponse,
)
from backend.services.hashing import compute_hashes
from backend.services.signatures import generate_rsa_keypair, sign_document_pss
from backend.services.verification import verify_document_pss

app = FastAPI(
    title="EHR Security System API",
    description="Medical Document Integrity & Authentication using Cryptographic Hashes and RSA-PSS Digital Signatures",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session key pair
_session_keys = {}

@app.get("/api/status")
def get_status():
    return {
        "status": "online",
        "system": "EHR Security System Cryptographic Engine (FastAPI / Cryptography)",
        "algorithms": {
            "hash": ["SHA-256", "SHA-3-256"],
            "asymmetric": "RSA-2048",
            "signature": "RSA-PSS (salt=digest, hash=SHA-256)",
        },
        "has_active_key_pair": "private_pem" in _session_keys,
    }

@app.post("/api/ehr/create")
def create_ehr(doc: EHRDocumentModel):
    canonical = (
        f"Patient ID: {doc.patient_id.strip()}\n"
        f"Patient Name: {doc.patient_name.strip()}\n"
        f"Age: {doc.age}\n"
        f"Diagnosis: {doc.diagnosis.strip()}\n"
        f"Prescription: {doc.prescription.strip()}\n"
        f"Doctor: {doc.doctor_name.strip()}\n"
        f"Hospital: {doc.hospital.strip()}\n"
        f"Date: {doc.date.strip()}"
    )
    return {
        "status": "success",
        "canonical_document": canonical,
        "document_data": doc.dict(),
    }

@app.post("/api/hash", response_model=HashResponse)
def hash_document(req: HashRequest):
    if not req.document:
        raise HTTPException(status_code=400, detail="Document string is required.")
    sha256, sha3_256, t_sha256, t_sha3 = compute_hashes(req.document)
    return HashResponse(
        sha256=sha256,
        sha3_256=sha3_256,
        sha256_time_ms=t_sha256,
        sha3_256_time_ms=t_sha3,
    )

@app.post("/api/keys/generate", response_model=KeyGenResponse)
def generate_keys():
    try:
        priv, pub, fp, t_ms = generate_rsa_keypair(2048)
        _session_keys["private_pem"] = priv
        _session_keys["public_pem"] = pub
        return KeyGenResponse(
            public_key_pem=pub,
            public_key_fingerprint=fp,
            has_private_key=True,
            time_ms=t_ms,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sign", response_model=SignResponse)
def sign_document(req: SignRequest):
    priv_pem = req.private_key_pem or _session_keys.get("private_pem")
    if not priv_pem:
        raise HTTPException(status_code=400, detail="No RSA private key available. Generate keys first.")
    try:
        sig_b64, t_ms = sign_document_pss(req.document, priv_pem)
        return SignResponse(
            algorithm="RSA-2048 + RSA-PSS + SHA-256",
            signature=sig_b64,
            status="✓ Signature created successfully",
            time_ms=t_ms,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signing failed: {str(e)}")

@app.post("/api/verify", response_model=VerifyResponse)
def verify_document(req: VerifyRequest):
    pub_pem = req.public_key_pem or _session_keys.get("public_pem")
    if not pub_pem:
        raise HTTPException(status_code=400, detail="Public key is required for verification.")
    valid, msg, t_ms = verify_document_pss(req.document, req.signature, pub_pem)
    return VerifyResponse(
        valid=valid,
        integrity=valid,
        authentication=valid,
        message=msg,
        time_ms=t_ms,
    )

@app.post("/api/tamper-test", response_model=TamperTestResponse)
def test_tampering(req: TamperTestRequest):
    orig_hash = hashlib.sha256(req.original_document.encode('utf-8')).hexdigest()
    mod_hash = hashlib.sha256(req.modified_document.encode('utf-8')).hexdigest()
    hash_match = (orig_hash == mod_hash)

    valid, _, t_ms = verify_document_pss(req.modified_document, req.signature, req.public_key_pem)

    return TamperTestResponse(
        original_hash=orig_hash,
        modified_hash=mod_hash,
        hash_match=hash_match,
        signature_valid=valid,
        tampering_detected=not (hash_match and valid),
        integrity_valid=(hash_match and valid),
        time_ms=t_ms,
    )
