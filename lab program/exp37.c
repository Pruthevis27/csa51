#include <stdio.h>
#include <string.h>

int main() {
    char cipher[1000];
    int freq[26]={0};

    scanf("%s", cipher);

    for(int i=0; cipher[i]; i++)
        freq[cipher[i]-'A']++;

    return 0;
}
