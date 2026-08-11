#include <stdio.h>

int main() {
    int a = 5;   // public
    int x = 7;   // secret

    int sent = x * a;   // wrong protocol

    int recovered_x = sent / a;  // attacker easily recovers

    return 0;
}
