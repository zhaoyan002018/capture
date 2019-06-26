/* d3des.h -
 *
 *	Headers and defines for d3des.c
 *	Graven Imagery, 1992.
 *
 * Copyright (c) 1988,1989,1990,1991,1992 by Richard Outerbridge
 *	(GEnie : OUTER; CIS : [71755,204])
 */
#ifndef CONT_D3DES_H
#define CONT_D3DES_H

#define D2_DES		/* include double-length support */
#define D3_DES		/* include triple-length support */

#ifdef D3_DES
#ifndef D2_DES
#define D2_DES		/* D2_DES is needed for D3_DES */
#endif
#endif

#define EN0	0	/* MODE == encrypt */
#define DE1	1	/* MODE == decrypt */

/* A useful alias on 68000-ish machines, but NOT USED HERE. */

typedef union {
	unsigned long blok[2];
	unsigned short word[4];
	unsigned char byte[8];
	} M68K;

extern void deskey_sf(unsigned char *, short);
/*		      hexkey[8]     MODE
 * Sets the internal key register according to the hexadecimal
 * key contained in the 8 bytes of hexkey, according to the DES,
 * for encryption or decryption according to MODE.
 */

extern void usekey_sf(unsigned long *);
/*		    cookedkey[32]
 * Loads the internal key register with the data in cookedkey.
 */

extern void cpkey_sf(unsigned long *);
/*		   cookedkey[32]
 * Copies the contents of the internal key register into the storage
 * located at &cookedkey[0].
 */

extern void des_sf(unsigned char *, unsigned char *);
/*		    from[8]	      to[8]
 * Encrypts/Decrypts (according to the key currently loaded in the
 * internal key register) one block of eight bytes at address 'from'
 * into the block at address 'to'.  They can be the same.
 */

#ifdef D2_DES

#define desDkey_sf(a,b)	des2key_sf((a),(b))
extern void des2key_sf(unsigned char *, short);
/*		      hexkey[16]     MODE
 * Sets the internal key registerS according to the hexadecimal
 * keyS contained in the 16 bytes of hexkey, according to the DES,
 * for DOUBLE encryption or decryption according to MODE.
 * NOTE: this clobbers all three key registers!
 */

extern void Ddes_sf(unsigned char *, unsigned char *);
/*		    from[8]	      to[8]
 * Encrypts/Decrypts (according to the keyS currently loaded in the
 * internal key registerS) one block of eight bytes at address 'from'
 * into the block at address 'to'.  They can be the same.
 */

extern void D2des_sf(unsigned char *, unsigned char *);
/*		    from[16]	      to[16]
 * Encrypts/Decrypts (according to the keyS currently loaded in the
 * internal key registerS) one block of SIXTEEN bytes at address 'from'
 * into the block at address 'to'.  They can be the same.
 */

extern void makekey_sf(char *, unsigned char *);
/*		*password,	single-length key[8]
 * With a double-length default key, this routine hashes a NULL-terminated
 * string into an eight-byte random-looking key, suitable for use with the
 * deskey() routine.
 */

#define makeDkey_sf(a,b)	make2key_sf((a),(b))
extern void make2key_sf(char *, unsigned char *);
/*		*password,	double-length key[16]
 * With a double-length default key, this routine hashes a NULL-terminated
 * string into a sixteen-byte random-looking key, suitable for use with the
 * des2key() routine.
 */

#ifndef D3_DES	/* D2_DES only */



void use2key_sf(unsigned long *);
/*		    cookedkey[64]
 * Loads the internal key registerS with the data in cookedkey.
 * NOTE: this clobbers all three key registers!
 */


void cp2key_sf(unsigned long *);
/*		   cookedkey[64]
 * Copies the contents of the internal key registerS into the storage
 * located at &cookedkey[0].
 */
#define useDkey_sf(a)	use2key_sf((a))
#define cpDkey_sf(a)	cp2key_sf((a))

#else	/* D3_DES too */



extern void des3key_sf(unsigned char *, short);
/*		      hexkey[24]     MODE
 * Sets the internal key registerS according to the hexadecimal
 * keyS contained in the 24 bytes of hexkey, according to the DES,
 * for DOUBLE encryption or decryption according to MODE.
 */

void use3key_sf(unsigned long *);
/*		    cookedkey[96]
 * Loads the 3 internal key registerS with the data in cookedkey.
 */

void cp3key_sf(unsigned long *);
/*		   cookedkey[96]
 * Copies the contents of the 3 internal key registerS into the storage
 * located at &cookedkey[0].
 */
#define useDkey_sf(a)	use3key_sf((a))
#define cpDkey_sf(a)	cp3key_sf((a))

extern void make3key(char *, unsigned char *);
/*		*password,	triple-length key[24]
 * With a triple-length default key, this routine hashes a NULL-terminated
 * string into a twenty-four-byte random-looking key, suitable for use with
 * the des3key() routine.
 */
extern void D3des_sf(unsigned char *, unsigned char *);

#endif	/* D3_DES */
#endif	/* D2_DES */

#endif
/* d3des.h V5.09 rwo 9208.04 15:06 Graven Imagery
 ********************************************************************/
