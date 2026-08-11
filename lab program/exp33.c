#include <stdio.h>
#include <stdint.h>

uint32_t feistel(uint32_t r, uint32_t k) {
    return (r ^ k); 
}

uint64_t des_encrypt(uint64_t block, uint64_t key) {
    uint32_t L = block >> 32;
    uint32_t R = block & 0xFFFFFFFF;

    for (int i = 0; i < 16; i++) {
        uint32_t temp = R;
        R = L ^ feistel(R, key);
        L = temp;
    }

    return ((uint64_t)R << 32) | L;
}

int main() {
    uint64_t block = 0x0123456789ABCDEF;
    uint64_t key = 0x133457799BBCDFF1;

    uint64_t cipher = des_encrypt(block, key);

    return 0;
}
