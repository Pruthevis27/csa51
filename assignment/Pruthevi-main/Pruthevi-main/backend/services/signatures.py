import time
import base64
from typing import Tuple
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes, serialization

def generate_rsa_keypair(key_size: int = 2048) -> Tuple[str, str, str, float]:
    """
    Generates a cryptographically secure RSA-2048 key pair.
    Returns: (private_key_pem, public_key_pem, public_key_fingerprint, time_ms)
    """
    t0 = time.perf_counter_ns()
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=key_size
    )
    t1 = time.perf_counter_ns()
    time_ms = (t1 - t0) / 1_000_000

    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    ).decode('utf-8')

    public_key = private_key.public_key()
    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode('utf-8')

    # Fingerprint: SHA-256 of DER public key
    pub_der = public_key.public_bytes(
        encoding=serialization.Encoding.DER,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    digest = hashes.Hash(hashes.SHA256())
    digest.update(pub_der)
    raw_fp = digest.finalize().hex().upper()
    fingerprint = ":".join(raw_fp[i:i+2] for i in range(0, len(raw_fp), 2))

    return private_pem, public_pem, fingerprint, time_ms

def sign_document_pss(document: str, private_key_pem: str) -> Tuple[str, float]:
    """
    Signs a canonical document using RSA-2048 + RSA-PSS + SHA-256.
    Returns: (base64_signature, time_ms)
    """
    private_key = serialization.load_pem_private_key(
        private_key_pem.encode('utf-8'),
        password=None
    )

    data = document.encode('utf-8')
    t0 = time.perf_counter_ns()

    signature = private_key.sign(
        data,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.DIGEST_LENGTH
        ),
        hashes.SHA256()
    )

    t1 = time.perf_counter_ns()
    time_ms = (t1 - t0) / 1_000_000
    sig_b64 = base64.b64encode(signature).decode('utf-8')

    return sig_b64, time_ms
