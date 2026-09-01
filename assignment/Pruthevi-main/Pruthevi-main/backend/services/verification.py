import time
import base64
from typing import Tuple
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.exceptions import InvalidSignature

def verify_document_pss(document: str, signature_b64: str, public_key_pem: str) -> Tuple[bool, str, float]:
    """
    Verifies an RSA-PSS + SHA-256 signature against the canonical document.
    Returns: (is_valid, message, time_ms)
    """
    try:
        public_key = serialization.load_pem_public_key(
            public_key_pem.encode('utf-8')
        )
        signature = base64.b64decode(signature_b64)
        data = document.encode('utf-8')

        t0 = time.perf_counter_ns()
        public_key.verify(
            signature,
            data,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.DIGEST_LENGTH
            ),
            hashes.SHA256()
        )
        t1 = time.perf_counter_ns()
        time_ms = (t1 - t0) / 1_000_000

        return True, "The EHR matches the signed content. Document integrity and provider authentication verified.", time_ms

    except InvalidSignature:
        return False, "The document may have been modified or the signature/public key is incorrect.", 0.0
    except Exception as e:
        return False, f"Verification failed due to cryptographic error: {str(e)}", 0.0
