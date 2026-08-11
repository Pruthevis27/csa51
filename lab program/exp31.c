#include <stdio.h>
#include <stdint.h>
#include <string.h>

void leftShift(uint8_t *in, uint8_t *out, int size) {
    uint8_t carry = 0;
    for (int i = size - 1; i >= 0; i--) {
        out[i] = (in[i] << 1) | carry;
        carry = (in[i] & 0x80) ? 1 : 0;
    }
}

void generateSubkeys(uint8_t *L, uint8_t *K1, uint8_t *K2) {
    uint8_t Rb[16] = {0};
    Rb[15] = 0x87;

    leftShift(L, K1, 16);
    if (L[0] & 0x80)
        for (int i = 0; i < 16; i++)
            K1[i] ^= Rb[i];

    leftShift(K1, K2, 16);
    if (K1[0] & 0x80)
        for (int i = 0; i < 16; i++)
            K2[i] ^= Rb[i];
}

int main() {
    uint8_t L[16] = {0};
    uint8_t K1[16], K2[16];

    generateSubkeys(L, K1, K2);

    return 0;
}
