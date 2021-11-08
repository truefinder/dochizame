#include <stdio.h>
#include <stdlib.h>
#include <time.h> 

#define BUFSIZE	256

const char* x[] = {
	"Baron of Hell", "Demon", "Hellknight",
	"Cyberdemon", "Mancubus", "Revenant",
	"Doomimp", "Zombieman", "Shotguy",
	"Beholder", "Moloch", "Satyr",
	"Afrit", "Cybermastermind", "Nightmarecacodemon",
};

char* victim( char *str, char *str2 ) {


	char *buf = malloc(BUFSIZE); 
	//printf("changed? : arg0 = %s / arg1 = %s \n", str , str2 ) ; 
	snprintf( buf, 256,"changed ? arg1 = %s\t arg1 = %s\n", str, str2 ); 
	return buf ; 
}

int cool(void) {
	int i;
	int k;

	i = 15;
	k = 0;
	srand((unsigned)time(NULL));
	k = rand() % i;
	return k;
}

int main(void) {

	char *str  ; 
	char buf[BUFSIZE];
		while(1) {
			char *a = x[cool()];
			sleep(1);
			char *b = x[cool()];
			sleep(1);
			char *c = x[cool()];
			snprintf(buf, sizeof(buf), "{ data1 : %s , data2 : %s, data3 : %s }", a, b, c) ; 
			str = victim( buf, x[cool()] ) ; 
			printf("%s", str); 
	}
	exit(0) ; 
}
