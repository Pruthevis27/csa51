#include <stdio.h>

int gcdExtended(int a, int b, int *x, int *y) {
    if (b == 0) {
        *x = 1;
        *y = 0;
        return a;
    }
    int x1, y1;
    int gcd = gcdExtended(b, a % b, &x1, &y1);
    *x = y1;
    *y = x1 - (a / b) * y1;
    return gcd;
}

int main() {
    int e = 31, phi = 3480;
    int x, y;
    gcdExtended(e, phi, &x, &y);

    int d = (x % phi + phi) % phi;

    return 0;
}
