#include <stdio.h>
#include <ctype.h>
#include <string.h>
int main() {
    char text[100], key[27];
    int i;
    printf("Enter message: ");
    fgets(text, sizeof(text), stdin);
    printf("Enter 26-letter substitution key (cipher alphabet): ");
    scanf("%s", key);
    for(i = 0; text[i] != '\0'; i++) {
        if(isupper(text[i])) {
            text[i] = toupper(key[text[i] - 'A']);
        }
        else if(islower(text[i])) {
            text[i] = tolower(key[text[i] - 'a']);
        }
    }
    printf("Encrypted Text: %s", text);
    return 0;
}
