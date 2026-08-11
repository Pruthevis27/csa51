#include <stdio.h>
#include <stdint.h>

uint8_t sdes_encrypt(uint8_t pt, uint16_t key) {
    return pt ^ (key & 0xFF);   // simplified core for lab
}

void cbc_encrypt(uint8_t *data, int len, uint16_t key, uint8_t iv) {
    uint8_t prev = iv;
    for (int i = 0; i < len; i++) {
        data[i] ^= prev;
        data[i] = sdes_encrypt(data[i], key);
        prev = data[i];
    }
}

int main() {
    uint8_t data[] = {0x01,0x23};
    cbc_encrypt(data, 2, 0x7BD, 0xAA);
    return 0;
}
