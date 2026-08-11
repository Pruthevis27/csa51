#include <stdio.h>

#define STATE_SIZE 25
#define CAPACITY_START 16   // example split

int main() {
    int state[STATE_SIZE] = {0};

    // Simulate first block where rate part gets data
    for (int i = 0; i < CAPACITY_START; i++)
        state[i] = 1;   // message injected

    // capacity part untouched
    for (int i = CAPACITY_START; i < STATE_SIZE; i++) {
        if (state[i] == 0) {
            // remains zero forever without permutation
        }
    }

    return 0;
}
