#include <stdio.h>
#include <stdint.h>

int PC1[56] = {
57,49,41,33,25,17,9,
1,58,50,42,34,26,18,
10,2,59,51,43,35,27,
19,11,3,60,52,44,36,
63,55,47,39,31,23,15,
7,62,54,46,38,30,22,
14,6,61,53,45,37,29,
21,13,5,28,20,12,4
};

int PC2[48] = {
14,17,11,24,1,5,
3,28,15,6,21,10,
23,19,12,4,26,8,
16,7,27,20,13,2,
41,52,31,37,47,55,
30,40,51,45,33,48,
44,49,39,56,34,53,
46,42,50,36,29,32
};

int shifts[16] = {
1, 1, 2, 2, 2, 2, 2, 2,
1, 2, 2, 2, 2, 2, 2, 1
};

uint64_t permute(uint64_t input, int *table, int n) {
    uint64_t output = 0;
    for (int i = 0; i < n; i++) {
        output <<= 1;
        output |= (input >> (64 - table[i])) & 1;
    }
    return output;
}

uint32_t leftShift28(uint32_t half, int shift) {
    return ((half << shift) | (half >> (28 - shift))) & 0x0FFFFFFF;
}

int main() {
    uint64_t key = 0x133457799BBCDFF1;  // Example 64-bit DES key

    uint64_t permuted = permute(key, PC1, 56);

    uint32_t C = (permuted >> 28) & 0x0FFFFFFF;
    uint32_t D = permuted & 0x0FFFFFFF;

    uint64_t subkeys[16];

    for (int i = 0; i < 16; i++) {
        C = leftShift28(C, shifts[i]);
        D = leftShift28(D, shifts[i]);

        uint64_t combined = ((uint64_t)C << 28) | D;

        subkeys[i] = permute(combined << 8, PC2, 48);
    }

    return 0;
}
