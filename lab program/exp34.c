#include <stdio.h>
#include <string.h>

void pad(uint8_t *data, int *len, int block) {
    int pad_len = block - (*len % block);
    data[*len] = 0x80;
    for (int i = 1; i < pad_len; i++)
        data[*len+i] = 0;
    *len += pad_len;
}
