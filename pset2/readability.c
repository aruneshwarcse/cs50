#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <ctype.h>
#include <string.h>



int main(void)
{
    unsigned int max_len = 128;
    unsigned int current_size = 0;

    char *arr = malloc(max_len);

    current_size = max_len;
    printf("Text:");

    if (arr != NULL)
    {
        int c = EOF;
        int j = 0;

        while ((c = getchar()) != '\n'  && c != EOF)
        {
            arr[j++] = (char)c;

            if (j == current_size)
            {

                current_size = j + max_len;
                arr = realloc(arr, current_size);

            }
        }

        arr[j] = '\0';

    }

    /*printf("%s",arr);
    free(arr);
    arr=NULL; */

    int countletters = 0, countwords = 0, countsentences = 0;

    if (isalpha(arr[0]))
    {
        countwords++;
    }
    for (int i = 0, n = strlen(arr); i < n; i++)
    {
        if (isalpha(arr[i]))
        {
            countletters++;
        }
        if ((isspace(arr[i]) || (arr[i] == '"')) && isalpha(arr[i + 1]))
        {
            countwords++;
        }
        if (arr[i] == '.' || arr[i] == '!' || arr[i] == '?')
        {
            countsentences++;
        }

    }
    float L = (float)countletters / (float)countwords * 100, S = (float)countsentences / (float)countwords * 100;
    float index = 0.0588 * L - 0.296 * S - 15.8;
    // printf("%f\n", index);
    if (index < 1)
    {
        printf("Before Grade 1\n");
    }
    else if (index >= 16)
    {
        printf("Grade 16+\n");
    }
    else
    {
        printf("Grade %i\n", (int) round(index));
    }

    free(arr);
    arr = NULL;


}
