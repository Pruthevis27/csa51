#include <stdio.h>
#include <string.h>

void decrypt(char *text, int shift) {
    for (int i = 0; text[i]; i++) {
        char p = ((text[i] - 'A' - shift + 26) % 26) + 'A';
        printf("%c", p);
    }
}

int main() {
    char cipher[1000];

    printf("Enter ciphertext (UPPERCASE): ");
    scanf("%s", cipher);

    for (int k = 0; k < 26; k++) {
        printf("\nShift %d: ", k);
        decrypt(cipher, k);
    }

    return 0;
}
