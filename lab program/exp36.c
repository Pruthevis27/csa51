#include <stdio.h>

int modInverse(int a) {
    for (int i = 1; i < 26; i++)
        if ((a * i) % 26 == 1)
            return i;
    return -1;
}

int main() {
    char text[] = "HELLO";
    int a = 5, b = 8;

    for (int i = 0; text[i]; i++)
        text[i] = ((a*(text[i]-'A') + b) % 26) + 'A';

    return 0;
}
