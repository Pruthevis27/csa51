#include <stdio.h>

int modInverse(int a) {
    for(int i=1;i<26;i++)
        if((a*i)%26 == 1)
            return i;
    return -1;
}

int main() {
    char cipher[1000];
    int a,b;

    printf("Enter ciphertext (UPPERCASE): ");
    scanf("%s", cipher);

    // Based on solving equations:
    a = 3;
    b = 1;

    int a_inv = modInverse(a);

    for(int i=0; cipher[i]; i++) {
        int p = (a_inv * ((cipher[i]-'A' - b + 26) % 26)) % 26;
        printf("%c", p + 'A');
    }

    return 0;
}
