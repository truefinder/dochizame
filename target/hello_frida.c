#include <stdio.h>
#include <stdlib.h>
#include <time.h> 

const char* x[] = {
	"Baron of Hell", "Demon", "Hellknight",
	"Cyberdemon", "Mancubus", "Revenant",
	"Doomimp", "Zombieman", "Shotguy",
	"Beholder", "Moloch", "Satyr",
	"Afrit", "Cybermastermind", "Nightmarecacodemon",
};

void victim( char *str ) {
	printf("changed ? : %s\n", str ) ; 
	return ; 
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

void main(void) {

	char buf[256];
		while(1) {
			char *a = x[cool()];
			sleep(1);
			char *b = x[cool()];
			sleep(1);
			char *c = x[cool()];
			snprintf(buf, sizeof(buf), "json { data1 : %s , data2 : %s, data3 : %s }", a, b, c) ; 
			victim( buf ) ; 
	}
	exit(0) ; 
}
