import time
import hashlib
from typing import Tuple

def compute_hashes(document: str) -> Tuple[str, str, float, float]:
    """
    Computes real SHA-256 and SHA-3-256 digests of the input document
    and measures execution time in milliseconds.
    """
    data = document.encode('utf-8')

    # SHA-256
    t0 = time.perf_counter_ns()
    sha256_hash = hashlib.sha256(data).hexdigest()
    t1 = time.perf_counter_ns()
    sha256_time_ms = (t1 - t0) / 1_000_000

    # SHA-3-256
    t0_3 = time.perf_counter_ns()
    sha3_hash = hashlib.sha3_256(data).hexdigest()
    t1_3 = time.perf_counter_ns()
    sha3_time_ms = (t1_3 - t0_3) / 1_000_000

    return sha256_hash, sha3_hash, max(0.0001, sha256_time_ms), max(0.0001, sha3_time_ms)
