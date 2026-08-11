#include <stdio.h>

int mod26(int x) {
    return (x % 26 + 26) % 26;
}

int main() {
    char text[] = "MEETMEATTHEUSUALPLACEATTENRATHERTHANEIGHTOCLOCK";
    int key[2][2] = {{9,4},{5,7}};

    for (int i = 0; text[i]; i += 2) {
        int p1 = text[i] - 'A';
        int p2 = text[i+1] - 'A';

        int c1 = mod26(key[0][0]*p1 + key[0][1]*p2);
        int c2 = mod26(key[1][0]*p1 + key[1][1]*p2);

        printf("%c%c", c1+'A', c2+'A');
    }
    return 0;
}
