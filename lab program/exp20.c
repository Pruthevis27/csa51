#include <stdio.h>
#include <string.h>

#define BLOCK 8

void encrypt_ecb(unsigned char *plain, unsigned char *cipher, int len, unsigned char key) {
    for (int i = 0; i < len; i++)
        cipher[i] = plain[i] ^ key;
}

void decrypt_ecb(unsigned char *cipher, unsigned char *plain, int len, unsigned char key) {
    for (int i = 0; i < len; i++)
        plain[i] = cipher[i] ^ key;
}

void encrypt_cbc(unsigned char *plain, unsigned char *cipher, int len, unsigned char key, unsigned char iv) {
    unsigned char prev = iv;
    for (int i = 0; i < len; i++) {
        cipher[i] = (plain[i] ^ prev) ^ key;
        prev = cipher[i];
    }
}

void decrypt_cbc(unsigned char *cipher, unsigned char *plain, int len, unsigned char key, unsigned char iv) {
    unsigned char prev = iv;
    for (int i = 0; i < len; i++) {
        plain[i] = (cipher[i] ^ key) ^ prev;
        prev = cipher[i];
    }
}

int main() {
    unsigned char plaintext[16] = "HELLOWORLD1234";
    unsigned char cipher[16];
    unsigned char decrypted[16];

    unsigned char key = 0xAA;
    unsigned char iv = 0x55;

    encrypt_cbc(plaintext, cipher, 16, key, iv);

    // introduce 1-bit error in first block
    cipher[0] ^= 0x01;

    decrypt_cbc(cipher, decrypted, 16, key, iv);

    return 0;
}
