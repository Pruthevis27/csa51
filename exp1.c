#include <stdio.h>
int main() {
    char text[100];
    int key, i, choice;
    printf("Enter text: ");
    fgets(text, sizeof(text), stdin);
    printf("Enter key: ");
    scanf("%d", &key);
    printf("1-Encrypt  2-Decrypt: ");
    scanf("%d", &choice);
    for(i = 0; text[i] != '\0'; i++) {
        if(text[i] >= 'A' && text[i] <= 'Z') {
            if(choice == 1)
                text[i] = (text[i] - 'A' + key) % 26 + 'A';
            else
                text[i] = (text[i] - 'A' - key + 26) % 26 + 'A';
        }
        else if(text[i] >= 'a' && text[i] <= 'z') {
            if(choice == 1)
                text[i] = (text[i] - 'a' + key) % 26 + 'a';
            else
                text[i] = (text[i] - 'a' - key + 26) % 26 + 'a';
        }
    }
    printf("Result: %s", text);
    return 0;
}
