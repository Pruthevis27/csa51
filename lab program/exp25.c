#include <stdio.h>

int gcd(int a, int b) {
    while (b != 0) {
        int t = b;
        b = a % b;
        a = t;
    }
    return a;
}

int main() {
    int n = 3599;
    int m = 59;  // example

    int factor = gcd(m, n);

    return 0;
}
