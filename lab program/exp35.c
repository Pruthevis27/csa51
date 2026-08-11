#include <stdio.h>

int main() {
    char text[] = "HELLO";
    int key[] = {3,19,5,7,2};

    for (int i = 0; text[i]; i++) {
        int c = (text[i]-'A' + key[i]) % 26;
        text[i] = c + 'A';
    }

    return 0;
}
