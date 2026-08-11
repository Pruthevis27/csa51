#include <stdio.h>
#include <string.h>

int main() {
    char key[] = "CIPHER";
    char cipher[26];
    int used[26] = {0};
    int index = 0;

    for(int i=0; key[i]; i++) {
        if(!used[key[i]-'A']) {
            cipher[index++] = key[i];
            used[key[i]-'A'] = 1;
        }
    }

    for(char ch='A'; ch<='Z'; ch++) {
        if(!used[ch-'A']) {
            cipher[index++] = ch;
        }
    }

    printf("Cipher mapping:\n");
    for(int i=0;i<26;i++) {
        printf("%c -> %c\n", 'A'+i, cipher[i]);
    }

    return 0;
}
