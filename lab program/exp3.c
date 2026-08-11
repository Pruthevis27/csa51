#include <stdio.h>
#include <string.h>
#include <ctype.h>

char matrix[5][5];

void generateMatrix(char *key) {
    int used[26] = {0};
    int row = 0, col = 0;

    for(int i = 0; key[i]; i++) {
        char ch = toupper(key[i]);
        if(ch == 'J') ch = 'I';
        if(!used[ch - 'A'] && ch >= 'A' && ch <= 'Z') {
            matrix[row][col++] = ch;
            used[ch - 'A'] = 1;
            if(col == 5) { col = 0; row++; }
        }
    }

    for(char ch = 'A'; ch <= 'Z'; ch++) {
        if(ch == 'J') continue;
        if(!used[ch - 'A']) {
            matrix[row][col++] = ch;
            if(col == 5) { col = 0; row++; }
        }
    }
}

void findPosition(char ch, int *r, int *c) {
    if(ch == 'J') ch = 'I';
    for(int i=0;i<5;i++)
        for(int j=0;j<5;j++)
            if(matrix[i][j] == ch) {
                *r = i; *c = j;
            }
}

int main() {
    char key[100], text[1000];

    printf("Enter keyword: ");
    scanf("%s", key);

    generateMatrix(key);

    printf("Enter plaintext (even letters, no spaces): ");
    scanf("%s", text);

    for(int i=0; text[i]; i+=2) {
        int r1,c1,r2,c2;
        findPosition(toupper(text[i]), &r1,&c1);
        findPosition(toupper(text[i+1]), &r2,&c2);

        if(r1 == r2) {
            printf("%c%c",
                matrix[r1][(c1+1)%5],
                matrix[r2][(c2+1)%5]);
        }
        else if(c1 == c2) {
            printf("%c%c",
                matrix[(r1+1)%5][c1],
                matrix[(r2+1)%5][c2]);
        }
        else {
            printf("%c%c",
                matrix[r1][c2],
                matrix[r2][c1]);
        }
    }

    return 0;
}
