import pytest
from backend.services.hashing import compute_hashes
from backend.services.signatures import generate_rsa_keypair, sign_document_pss
from backend.services.verification import verify_document_pss

SAMPLE_DOC = """Patient ID: P1001
Patient Name: Arun Kumar
Age: 45
Diagnosis: Type 2 Diabetes
Prescription: Metformin 500mg
Doctor: Dr. Priya Sharma
Hospital: City Care Hospital
Date: 01-09-2026"""

def test_1_original_ehr_integrity_and_signature():
    """Test 1 — Original EHR: Hash generated, signature created, verification valid."""
    sha256, sha3_256, t1, t2 = compute_hashes(SAMPLE_DOC)
    assert len(sha256) == 64
    assert len(sha3_256) == 64

    priv, pub, fp, _ = generate_rsa_keypair(2048)
    sig_b64, _ = sign_document_pss(SAMPLE_DOC, priv)
    assert sig_b64 is not None

    valid, msg, _ = verify_document_pss(SAMPLE_DOC, sig_b64, pub)
    assert valid is True
    assert "verified" in msg.lower()

def test_2_modified_diagnosis_tamper_detection():
    """Test 2 — Modified Diagnosis: Hash changed, signature verification failed."""
    priv, pub, _, _ = generate_rsa_keypair(2048)
    sig_b64, _ = sign_document_pss(SAMPLE_DOC, priv)

    tampered_doc = SAMPLE_DOC.replace("Diagnosis: Type 2 Diabetes", "Diagnosis: Type 1 Diabetes")
    orig_sha, _, _, _ = compute_hashes(SAMPLE_DOC)
    mod_sha, _, _, _ = compute_hashes(tampered_doc)

    assert orig_sha != mod_sha

    valid, msg, _ = verify_document_pss(tampered_doc, sig_b64, pub)
    assert valid is False

def test_3_modified_prescription_tamper_detection():
    """Test 3 — Modified Prescription: Hash changed, signature verification failed."""
    priv, pub, _, _ = generate_rsa_keypair(2048)
    sig_b64, _ = sign_document_pss(SAMPLE_DOC, priv)

    tampered_doc = SAMPLE_DOC.replace("Prescription: Metformin 500mg", "Prescription: Metformin 1000mg")
    orig_sha, _, _, _ = compute_hashes(SAMPLE_DOC)
    mod_sha, _, _, _ = compute_hashes(tampered_doc)

    assert orig_sha != mod_sha

    valid, msg, _ = verify_document_pss(tampered_doc, sig_b64, pub)
    assert valid is False

def test_4_wrong_signature():
    """Test 4 — Wrong Signature: Verification failed."""
    _, pub, _, _ = generate_rsa_keypair(2048)
    # Tampered signature bytes
    wrong_sig = "A" * 344  # Corrupted Base64
    valid, _, _ = verify_document_pss(SAMPLE_DOC, wrong_sig, pub)
    assert valid is False

def test_5_wrong_public_key():
    """Test 5 — Wrong Public Key: Verification failed."""
    priv1, pub1, _, _ = generate_rsa_keypair(2048)
    priv2, pub2, _, _ = generate_rsa_keypair(2048)

    sig_b64, _ = sign_document_pss(SAMPLE_DOC, priv1)
    # Verify using another provider's public key (pub2)
    valid, _, _ = verify_document_pss(SAMPLE_DOC, sig_b64, pub2)
    assert valid is False

def test_6_sha256_vs_sha3_256_lengths():
    """Test 6 — SHA-256 vs SHA-3-256: Both produce 256-bit (32 bytes = 64 hex chars) digests."""
    sha256, sha3_256, _, _ = compute_hashes(SAMPLE_DOC)
    assert len(bytes.fromhex(sha256)) * 8 == 256
    assert len(bytes.fromhex(sha3_256)) * 8 == 256
    assert sha256 != sha3_256
