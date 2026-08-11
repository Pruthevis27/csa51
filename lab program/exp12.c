#include <stdio.h>

int mod26(int x) {
    return (x % 26 + 26) % 26;
}

int main() {
    char cipher[] = "YOURCIPHERTEXT";
    int invKey[2][2] = {{5,22},{15,9}};  // Precomputed inverse

    for (int i = 0; cipher[i]; i += 2) {
        int c1 = cipher[i] - 'A';
        int c2 = cipher[i+1] - 'A';

        int p1 = mod26(invKey[0][0]*c1 + invKey[0][1]*c2);
        int p2 = mod26(invKey[1][0]*c1 + invKey[1][1]*c2);

        printf("%c%c", p1+'A', p2+'A');
    }
    return 0;
}
