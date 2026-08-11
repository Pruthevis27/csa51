#include <stdio.h>
#include <string.h>

#define BLOCK 8

void pad(unsigned char *data, int *len) {
    int pad_len = BLOCK - (*len % BLOCK);
    data[*len] = 0x80;   // 10000000 (1 followed by zeros)
    for (int i = 1; i < pad_len; i++)
        data[*len + i] = 0x00;
    *len += pad_len;
}

void ecb_encrypt(unsigned char *data, int len, unsigned char key) {
    for (int i = 0; i < len; i++)
        data[i] ^= key;
}

void cbc_encrypt(unsigned char *data, int len, unsigned char key, unsigned char iv) {
    unsigned char prev = iv;
    for (int i = 0; i < len; i++) {
        data[i] ^= prev;
        data[i] ^= key;
        prev = data[i];
    }
}

void cfb_encrypt(unsigned char *data, int len, unsigned char key, unsigned char iv) {
    unsigned char prev = iv;
    for (int i = 0; i < len; i++) {
        unsigned char temp = prev ^ key;
        unsigned char cipher = data[i] ^ temp;
        prev = cipher;
        data[i] = cipher;
    }
}

int main() {
    unsigned char data[64] = "HELLOCRYPTO";
    int len = strlen((char*)data);

    pad(data, &len);

    ecb_encrypt(data, len, 0xAA);

    return 0;
}
