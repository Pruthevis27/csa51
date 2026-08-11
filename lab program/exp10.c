#include <stdio.h>
#include <ctype.h>

char matrix[5][5] = {
    {'M','F','H','I','K'},
    {'U','N','O','P','Q'},
    {'Z','V','W','X','Y'},
    {'E','L','A','R','G'},
    {'D','S','T','B','C'}
};

void findPos(char ch, int *r, int *c) {
    if (ch == 'J') ch = 'I';
    for (int i=0;i<5;i++)
        for (int j=0;j<5;j++)
            if (matrix[i][j] == ch) {
                *r=i; *c=j;
            }
}

int main() {
    char text[] = "MUSTSEEYOUOVERCADOGANWESTCOMINGATONCE";

    for (int i=0; text[i]; i+=2) {
        int r1,c1,r2,c2;
        findPos(text[i], &r1,&c1);
        findPos(text[i+1], &r2,&c2);

        if (r1 == r2)
            printf("%c%c", matrix[r1][(c1+1)%5], matrix[r2][(c2+1)%5]);
        else if (c1 == c2)
            printf("%c%c", matrix[(r1+1)%5][c1], matrix[(r2+1)%5][c2]);
        else
            printf("%c%c", matrix[r1][c2], matrix[r2][c1]);
    }
    return 0;
}
