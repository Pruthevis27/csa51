from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class EHRDocumentModel(BaseModel):
    patient_id: str = Field(..., example="P1001")
    patient_name: str = Field(..., example="Arun Kumar")
    age: int = Field(..., ge=0, le=150, example=45)
    diagnosis: str = Field(..., example="Type 2 Diabetes")
    prescription: str = Field(..., example="Metformin 500mg")
    doctor_name: str = Field(..., example="Dr. Priya Sharma")
    hospital: str = Field(..., example="City Care Hospital")
    date: str = Field(..., example="01-09-2026")

class HashRequest(BaseModel):
    document: str

class HashResponse(BaseModel):
    sha256: str
    sha3_256: str
    sha256_time_ms: float
    sha3_256_time_ms: float

class KeyGenResponse(BaseModel):
    algorithm: str = "RSA-2048"
    public_key_pem: str
    public_key_fingerprint: str
    has_private_key: bool = True
    time_ms: float

class SignRequest(BaseModel):
    document: str
    private_key_pem: Optional[str] = None

class SignResponse(BaseModel):
    algorithm: str = "RSA-2048 + RSA-PSS + SHA-256"
    signature: str
    status: str
    time_ms: float

class VerifyRequest(BaseModel):
    document: str
    signature: str
    public_key_pem: str

class VerifyResponse(BaseModel):
    valid: bool
    integrity: bool
    authentication: bool
    message: str
    time_ms: float

class TamperTestRequest(BaseModel):
    original_document: str
    modified_document: str
    signature: str
    public_key_pem: str

class TamperTestResponse(BaseModel):
    original_hash: str
    modified_hash: str
    hash_match: bool
    signature_valid: bool
    tampering_detected: bool
    integrity_valid: bool
    time_ms: float
