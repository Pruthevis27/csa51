#include <stdio.h>
#include <string.h>
#include <ctype.h>

char matrix[5][5];

void generateMatrix(char *key) {
    int used[26] = {0};
    int r = 0, c = 0;

    for (int i = 0; key[i]; i++) {
        char ch = toupper(key[i]);
        if (ch == 'J') ch = 'I';

        if (ch >= 'A' && ch <= 'Z' && !used[ch - 'A']) {
            matrix[r][c++] = ch;
            used[ch - 'A'] = 1;
            if (c == 5) { r++; c = 0; }
        }
    }

    for (char ch = 'A'; ch <= 'Z'; ch++) {
        if (ch == 'J') continue;
        if (!used[ch - 'A']) {
            matrix[r][c++] = ch;
            if (c == 5) { r++; c = 0; }
        }
    }
}

void findPos(char ch, int *r, int *c) {
    if (ch == 'J') ch = 'I';
    for (int i = 0; i < 5; i++)
        for (int j = 0; j < 5; j++)
            if (matrix[i][j] == ch) {
                *r = i; *c = j;
            }
}

int main() {
    char key[100], cipher[1000];

    printf("Enter key: ");
    fgets(key, sizeof(key), stdin);

    printf("Enter ciphertext: ");
    fgets(cipher, sizeof(cipher), stdin);

    generateMatrix(key);

    for (int i = 0; cipher[i] && cipher[i+1]; i += 2) {
        if (!isalpha(cipher[i])) { i--; continue; }

        int r1, c1, r2, c2;
        findPos(cipher[i], &r1, &c1);
        findPos(cipher[i+1], &r2, &c2);

        if (r1 == r2) {
            printf("%c%c",
                matrix[r1][(c1+4)%5],
                matrix[r2][(c2+4)%5]);
        } else if (c1 == c2) {
            printf("%c%c",
                matrix[(r1+4)%5][c1],
                matrix[(r2+4)%5][c2]);
        } else {
            printf("%c%c",
                matrix[r1][c2],
                matrix[r2][c1]);
        }
    }
    return 0;
}
