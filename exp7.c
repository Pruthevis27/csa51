#include <stdio.h>

int main() {
    char cipher[] = "53‡‡†305))6*;4826)...";  // truncated
    char map[256] = {0};

    // Example guessed mappings (you fill properly after analysis)
    map['5'] = 'T';
    map['3'] = 'H';
    map['‡'] = 'E';

    for(int i=0; cipher[i]; i++) {
        if(map[(int)cipher[i]] != 0)
            printf("%c", map[(int)cipher[i]]);
        else
            printf("%c", cipher[i]);
    }

    return 0;
}
