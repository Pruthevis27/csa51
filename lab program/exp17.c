#include <stdio.h>

int main() {
    int keys[16];

    printf("Enter 16 subkeys:\n");
    for (int i = 0; i < 16; i++)
        scanf("%d", &keys[i]);

    printf("\nDecryption order:\n");
    for (int i = 15; i >= 0; i--)
        printf("K%d ", i+1);

    return 0;
}
