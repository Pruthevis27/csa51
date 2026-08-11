#include <stdio.h>
#include <string.h>
#include <openssl/des.h>

int main() {
    DES_cblock key1 = {0x01,0x23,0x45,0x67,0x89,0xAB,0xCD,0xEF};
    DES_cblock key2 = {0xFE,0xDC,0xBA,0x98,0x76,0x54,0x32,0x10};
    DES_cblock key3 = {0x89,0xAB,0xCD,0xEF,0x01,0x23,0x45,0x67};

    DES_key_schedule ks1, ks2, ks3;

    DES_set_key_unchecked(&key1, &ks1);
    DES_set_key_unchecked(&key2, &ks2);
    DES_set_key_unchecked(&key3, &ks3);

    DES_cblock iv = {0x12,0x34,0x56,0x78,0x90,0xAB,0xCD,0xEF};

    unsigned char plaintext[16] = "HELLOWORLD1234";
    unsigned char ciphertext[16];

    DES_ede3_cbc_encrypt(
        plaintext,
        ciphertext,
        16,
        &ks1, &ks2, &ks3,
        &iv,
        DES_ENCRYPT
    );

    return 0;
}
