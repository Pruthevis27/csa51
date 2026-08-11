#include <stdio.h>

long modInverse(long e, long phi) {
    long t = 0, newt = 1;
    long r = phi, newr = e;

    while (newr != 0) {
        long q = r / newr;

        long temp = newt;
        newt = t - q * newt;
        t = temp;

        temp = newr;
        newr = r - q * newr;
        r = temp;
    }

    if (r > 1) return -1;
    if (t < 0) t += phi;

    return t;
}

int main() {
    long p = 59;
    long q = 61;
    long n = p * q;
    long phi = (p - 1) * (q - 1);

    long new_e = 17;

    long new_d = modInverse(new_e, phi);

    return 0;
}
