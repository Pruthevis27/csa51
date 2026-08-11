#include <stdio.h>
#include <stdint.h>

uint8_t encrypt_core(uint8_t input, uint16_t key) {
    return input ^ (key & 0xFF);
}

void ctr_encrypt(uint8_t *data, int len, uint16_t key) {
    uint8_t counter = 0;
    for (int i = 0; i < len; i++) {
        uint8_t keystream = encrypt_core(counter++, key);
        data[i] ^= keystream;
    }
}

int main() {
    uint8_t data[] = {0x01,0x02,0x04};
    ctr_encrypt(data, 3, 0x7BD);
    return 0;
}
