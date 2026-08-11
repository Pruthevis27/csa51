#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main() {
    char text[1000], key[100];

    printf("Enter plaintext (UPPERCASE): ");
    scanf("%s", text);

    printf("Enter key (UPPERCASE): ");
    scanf("%s", key);

    int keyLen = strlen(key);

    for(int i = 0; text[i]; i++) {
        text[i] = ((text[i] - 'A' + key[i % keyLen] - 'A') % 26) + 'A';
    }

    printf("Ciphertext: %s\n", text);
    return 0;
}
