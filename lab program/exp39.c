#include <stdio.h>

int modInverse(int a) {
    for (int i = 1; i < 26; i++)
        if ((a * i) % 26 == 1)
            return i;
    return -1;
}

void inverse2x2(int key[2][2], int inv[2][2]) {
    int det = (key[0][0]*key[1][1] - key[0][1]*key[1][0]) % 26;
    if (det < 0) det += 26;

    int invDet = modInverse(det);

    inv[0][0] =  key[1][1] * invDet % 26;
    inv[0][1] = -key[0][1] * invDet % 26;
    inv[1][0] = -key[1][0] * invDet % 26;
    inv[1][1] =  key[0][0] * invDet % 26;

    for (int i=0;i<2;i++)
        for (int j=0;j<2;j++)
            if (inv[i][j] < 0)
                inv[i][j] += 26;
}
