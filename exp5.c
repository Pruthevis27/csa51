#include <stdio.h>
#include <string.h>
#include <ctype.h>

int gcd(int a, int b) {
    while(b != 0) {
        int t = b;
        b = a % b;
        a = t;
    }
    return a;
}

int modInverse(int a) {
    for(int i=1;i<26;i++)
        if((a*i)%26 == 1)
            return i;
    return -1;
}

int main() {
    char text[1000];
    int a,b;

    printf("Enter plaintext (UPPERCASE): ");
    scanf("%s", text);

    printf("Enter values of a and b: ");
    scanf("%d %d", &a, &b);

    if(gcd(a,26) != 1) {
        printf("Invalid 'a'. Must be coprime with 26.\n");
        return 0;
    }

    for(int i=0;text[i];i++) {
        text[i] = ((a*(text[i]-'A') + b) % 26) + 'A';
    }

    printf("Ciphertext: %s\n", text);
    return 0;
}
