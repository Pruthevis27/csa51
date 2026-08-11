#include <stdio.h>
#include <stdint.h>

uint8_t mac(uint8_t x, uint8_t key) {
    return x ^ key;
}

int main() {
    uint8_t X = 0x55;
    uint8_t key = 0xAA;

    uint8_t T = mac(X, key);

    uint8_t forged = X ^ T;
    uint8_t result = mac(forged, key);

    return 0;
}
