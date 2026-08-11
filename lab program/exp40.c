#include <stdio.h>
#include <string.h>

void generate_initial_guess(char *cipher, char *guess) {
    char freq_order[] = "ETAOINSHRDLCUMWFGYPBVKJXQZ";
    int freq[26]={0};

    for(int i=0; cipher[i]; i++)
        freq[cipher[i]-'A']++;

    for(int i=0;i<26;i++)
        guess[i] = freq_order[i];
}
