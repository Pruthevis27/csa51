#include <stdio.h>
#include <string.h>

int main() {
    char cipher[1000];
    int freq[26] = {0};

    printf("Enter ciphertext: ");
    scanf("%s", cipher);

    for (int i = 0; cipher[i]; i++)
        freq[cipher[i] - 'A']++;

    for (int i = 0; i < 26; i++)
        printf("%c : %d\n", 'A'+i, freq[i]);

    printf("\nMost frequent likely maps to E\n");

    return 0;
}
