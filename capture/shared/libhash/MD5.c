/* MD5C.C - RSA Data Security, Inc., MD5 message-digest algorithm
 */

/* Copyright (C) 1991-2, RSA Data Security, Inc. Created 1991. All
rights reserved.

License to copy and use this software is granted provided that it
is identified as the "RSA Data Security, Inc. MD5 Message-Digest
Algorithm" in all material mentioning or referencing this software
or this function.

License is also granted to make and use derivative works provided
that such works are identified as "derived from the RSA Data
Security, Inc. MD5 Message-Digest Algorithm" in all material
mentioning or referencing the derived work.

RSA Data Security, Inc. makes no representations concerning either
the merchantability of this software or the suitability of this
software for any particular purpose. It is provided "as is"
without express or implied warranty of any kind.

These notices must be retained in any copies of any part of this
documentation and/or software.
 */

#ifdef __KERNEL__
#include <linux/stddef.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/timer.h>
#include <linux/module.h>
#include <linux/errno.h>
#include <linux/limits.h>
#include <linux/string.h>
#include <linux/spinlock.h>
#include <linux/sched.h>
#include <linux/slab.h>
#include <linux/vmalloc.h>
#include <linux/fs.h>
#include <linux/poll.h>
#include <linux/param.h>
#include <linux/in.h>
#include <linux/ip.h>
#include <linux/tcp.h>
#include <linux/udp.h>
#include <linux/if_ether.h>
#include <linux/netdevice.h>
#include <linux/netfilter.h>
#include <linux/netfilter_ipv4.h>
#include <linux/inetdevice.h>
#include <linux/if_arp.h>
#include <linux/if_packet.h>
#include <net/arp.h>
#include <net/tcp.h>
#include <net/route.h>
#include <linux/delay.h>
#include <linux/jhash.h>
#else
#include <stdio.h>
#include <string.h>
#include <inttypes.h>
#endif

#include "MD5.h"

#define IN
#define OUT

/* Constants for MD5Transform routine.
 */


#define S11 7
#define S12 12
#define S13 17
#define S14 22
#define S21 5
#define S22 9
#define S23 14
#define S24 20
#define S31 4
#define S32 11
#define S33 16
#define S34 23
#define S41 6
#define S42 10
#define S43 15
#define S44 21

void MD5Transform (uint32_t [4], unsigned char [64]);/* parasoft-suppress CODSTA-15 "no problem" */
void Encode(unsigned char *, uint32_t *, unsigned int);
void Decode(uint32_t *, unsigned char *, unsigned int);

static unsigned char PADDING[64] = {
  0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
};

//F, G, H and I are basic MD5 functions.
#define F(x, y, z) (((x) & (y)) | ((~x) & (z)))
#define G(x, y, z) (((x) & (z)) | ((y) & (~z)))
#define H(x, y, z) ((x) ^ (y) ^ (z))
#define I(x, y, z) ((y) ^ ((x) | (~z)))

// ROTATE_LEFT rotates x left n bits.
#define ROTATE_LEFT(x, n) (((x) << (n)) | ((x) >> (32-(n))))

//FF, GG, HH, and II transformations for rounds 1, 2, 3, and 4.
//Rotation is separate from addition to prevent recomputation.
#define FF(a, b, c, d, x, s, ac) { \
 (a) += F ((b), (c), (d)) + (x) + (uint32_t)(ac); \
 (a) = ROTATE_LEFT ((a), (s)); \
 (a) += (b); \
  }
#define GG(a, b, c, d, x, s, ac) { \
 (a) += G ((b), (c), (d)) + (x) + (uint32_t)(ac); \
 (a) = ROTATE_LEFT ((a), (s)); \
 (a) += (b); \
  }
#define HH(a, b, c, d, x, s, ac) { \
 (a) += H ((b), (c), (d)) + (x) + (uint32_t)(ac); \
 (a) = ROTATE_LEFT ((a), (s)); \
 (a) += (b); \
  }
#define II(a, b, c, d, x, s, ac) { \
 (a) += I ((b), (c), (d)) + (x) + (uint32_t)(ac); \
 (a) = ROTATE_LEFT ((a), (s)); \
 (a) += (b); \
  }

// MD5 initialization. Begins an MD5 operation, writing a new context. 
void MD5_init (MD5_CTX *context)
{
	context->count[0] = context->count[1] = 0;
	context->state[0] = 0x67452301;
	context->state[1] = 0xefcdab89;
	context->state[2] = 0x98badcfe;
	context->state[3] = 0x10325476;
}

// MD5 block update operation. Continues an MD5 message-digest
//  operation, processing another message block, and updating the
//  context. 
void MD5_update(
	MD5_CTX *context,
	unsigned char *input,
	unsigned int inputLen)
{
	unsigned int i,nindex,partLen; 

	// Compute number of bytes mod 64 
	nindex = (unsigned int)((context->count[0] >> 3) & 0x3F);

	// Update number of bits
	if ((context->count[0] += ((uint32_t)inputLen << 3))
		< ((uint32_t)inputLen << 3))
	{
		context->count[1]++;
	}
	context->count[1] += ((uint32_t)inputLen >> 29);

	partLen = 64 - nindex;

	// Transform as many times as possible.
	if (inputLen >= partLen) 
	{
		memcpy((void *)&context->buffer[nindex], (void *)input, partLen);
		MD5Transform (context->state, context->buffer);

		for (i = partLen; i + 63 < inputLen; i += 64)
		{
			MD5Transform (context->state, &input[i]);
		}

		nindex = 0;
	}
	else
		i = 0;

	// Buffer remaining input 
	memcpy((void *)&context->buffer[nindex], (void *)&input[i], inputLen-i);
}

// MD5 finalization. Ends an MD5 message-digest operation, writing the
//  the message digest and zeroizing the context.
void MD5_final(
	MD5_CTX *context,
	unsigned char digest[16] /* parasoft-suppress CODSTA-15 "no problem" */
	)         
{
	unsigned char bits[8];
	unsigned int nindex, padLen;

	// Save number of bits
	Encode (bits, 
			context->count, 
			4 * (sizeof(context->count) / sizeof(context->count[0])));

	// Pad out to 56 mod 64.
	nindex = (unsigned int)((context->count[0] >> 3) & 0x3f);
	padLen = (nindex < 56) ? (56 - nindex) : (120 - nindex);
	MD5_update (context, PADDING, padLen);

	// Append length (before padding)
	MD5_update (context, bits, 8);

	// Store state in digest
	Encode (digest, 
			context->state, 
			4 * (sizeof(context->state) / sizeof(context->state[0])));

	// Zeroize sensitive information.
	memset ((void *)context, 0, sizeof (*context));
}

// MD5 basic transformation. Transforms state based on block.
void MD5Transform(
	uint32_t state[4],/* parasoft-suppress CODSTA-15 "no problem" */
	unsigned char block[64])/* parasoft-suppress CODSTA-15 "no problem" */
{
	uint32_t a = state[0], b = state[1], c = state[2], d = state[3], x[16];

	Decode (x, block, 64);

	FF (a, b, c, d, x[ 0], S11, 0xd76aa478);
	FF (d, a, b, c, x[ 1], S12, 0xe8c7b756); 
	FF (c, d, a, b, x[ 2], S13, 0x242070db);
	FF (b, c, d, a, x[ 3], S14, 0xc1bdceee);
	FF (a, b, c, d, x[ 4], S11, 0xf57c0faf);
	FF (d, a, b, c, x[ 5], S12, 0x4787c62a); 
	FF (c, d, a, b, x[ 6], S13, 0xa8304613);
	FF (b, c, d, a, x[ 7], S14, 0xfd469501); 
	FF (a, b, c, d, x[ 8], S11, 0x698098d8); 
	FF (d, a, b, c, x[ 9], S12, 0x8b44f7af); 
	FF (c, d, a, b, x[10], S13, 0xffff5bb1); 
	FF (b, c, d, a, x[11], S14, 0x895cd7be); 
	FF (a, b, c, d, x[12], S11, 0x6b901122);
	FF (d, a, b, c, x[13], S12, 0xfd987193);
	FF (c, d, a, b, x[14], S13, 0xa679438e); 
	FF (b, c, d, a, x[15], S14, 0x49b40821); 

	GG (a, b, c, d, x[ 1], S21, 0xf61e2562); 
	GG (d, a, b, c, x[ 6], S22, 0xc040b340); 
	GG (c, d, a, b, x[11], S23, 0x265e5a51); 
	GG (b, c, d, a, x[ 0], S24, 0xe9b6c7aa); 
	GG (a, b, c, d, x[ 5], S21, 0xd62f105d); 
	GG (d, a, b, c, x[10], S22,  0x2441453); /* 22 */
	GG (c, d, a, b, x[15], S23, 0xd8a1e681); /* 23 */
	GG (b, c, d, a, x[ 4], S24, 0xe7d3fbc8); /* 24 */
	GG (a, b, c, d, x[ 9], S21, 0x21e1cde6); /* 25 */
	GG (d, a, b, c, x[14], S22, 0xc33707d6); /* 26 */
	GG (c, d, a, b, x[ 3], S23, 0xf4d50d87); /* 27 */
	GG (b, c, d, a, x[ 8], S24, 0x455a14ed); /* 28 */
	GG (a, b, c, d, x[13], S21, 0xa9e3e905); /* 29 */
	GG (d, a, b, c, x[ 2], S22, 0xfcefa3f8); /* 30 */
	GG (c, d, a, b, x[ 7], S23, 0x676f02d9); /* 31 */
	GG (b, c, d, a, x[12], S24, 0x8d2a4c8a); /* 32 */

	HH (a, b, c, d, x[ 5], S31, 0xfffa3942); /* 33 */
	HH (d, a, b, c, x[ 8], S32, 0x8771f681); /* 34 */
	HH (c, d, a, b, x[11], S33, 0x6d9d6122); /* 35 */
	HH (b, c, d, a, x[14], S34, 0xfde5380c); /* 36 */
	HH (a, b, c, d, x[ 1], S31, 0xa4beea44); /* 37 */
	HH (d, a, b, c, x[ 4], S32, 0x4bdecfa9); /* 38 */
	HH (c, d, a, b, x[ 7], S33, 0xf6bb4b60); /* 39 */
	HH (b, c, d, a, x[10], S34, 0xbebfbc70); /* 40 */
	HH (a, b, c, d, x[13], S31, 0x289b7ec6); /* 41 */
	HH (d, a, b, c, x[ 0], S32, 0xeaa127fa); /* 42 */
	HH (c, d, a, b, x[ 3], S33, 0xd4ef3085); /* 43 */
	HH (b, c, d, a, x[ 6], S34,  0x4881d05); /* 44 */
	HH (a, b, c, d, x[ 9], S31, 0xd9d4d039); /* 45 */
	HH (d, a, b, c, x[12], S32, 0xe6db99e5); /* 46 */
	HH (c, d, a, b, x[15], S33, 0x1fa27cf8); /* 47 */
	HH (b, c, d, a, x[ 2], S34, 0xc4ac5665); /* 48 */

	/* Round 4 */
	II (a, b, c, d, x[ 0], S41, 0xf4292244); /* 49 */
	II (d, a, b, c, x[ 7], S42, 0x432aff97); /* 50 */
	II (c, d, a, b, x[14], S43, 0xab9423a7); /* 51 */
	II (b, c, d, a, x[ 5], S44, 0xfc93a039); /* 52 */
	II (a, b, c, d, x[12], S41, 0x655b59c3); /* 53 */
	II (d, a, b, c, x[ 3], S42, 0x8f0ccc92); /* 54 */
	II (c, d, a, b, x[10], S43, 0xffeff47d); /* 55 */
	II (b, c, d, a, x[ 1], S44, 0x85845dd1); /* 56 */
	II (a, b, c, d, x[ 8], S41, 0x6fa87e4f); /* 57 */
	II (d, a, b, c, x[15], S42, 0xfe2ce6e0); /* 58 */
	II (c, d, a, b, x[ 6], S43, 0xa3014314); /* 59 */
	II (b, c, d, a, x[13], S44, 0x4e0811a1); /* 60 */
	II (a, b, c, d, x[ 4], S41, 0xf7537e82); /* 61 */
	II (d, a, b, c, x[11], S42, 0xbd3af235); /* 62 */
	II (c, d, a, b, x[ 2], S43, 0x2ad7d2bb); /* 63 */
	II (b, c, d, a, x[ 9], S44, 0xeb86d391); /* 64 */

	state[0] += a;
	state[1] += b;
	state[2] += c;
	state[3] += d;

	/* Zeroize sensitive information.
	*/
	memset ((void *)x, 0, sizeof (x));
}

/* Encodes input (uint32_t) into output (unsigned char). Assumes len is
  a multiple of 4.
 */
void Encode(
	unsigned char *output,
	uint32_t *input,
	unsigned int len)
{
	unsigned int i, j;

	for (i = 0, j = 0; j < len; i++, j += 4) {
		output[j] = (unsigned char)(input[i] & 0xff); /* parasoft-suppress BD-PB-ARRAY BD-SECURITY-INTOVERF "no error" */
		output[j+1] = (unsigned char)((input[i] >> 8) & 0xff); /* parasoft-suppress BD-PB-ARRAY BD-SECURITY-INTOVERF "no error" */
		output[j+2] = (unsigned char)((input[i] >> 16) & 0xff); /* parasoft-suppress BD-PB-ARRAY BD-SECURITY-INTOVERF "no error" */
		output[j+3] = (unsigned char)((input[i] >> 24) & 0xff); /* parasoft-suppress BD-PB-ARRAY BD-SECURITY-INTOVERF "no error" */
	}
}

/* Decodes input (unsigned char) into output (uint32_t). Assumes len is
  a multiple of 4.
 */
void Decode(
	uint32_t *output,
	unsigned char *input,
	unsigned int len)
{
	unsigned int i, j;

	for (i = 0, j = 0; j < len; i++, j += 4)
		output[i] = ((uint32_t)input[j]) | (((uint32_t)input[j+1]) << 8) | /* parasoft-suppress BD-PB-ARRAY BD-SECURITY-INTOVERF "no error" */
			(((uint32_t)input[j+2]) << 16) | (((uint32_t)input[j+3]) << 24); /* parasoft-suppress BD-PB-ARRAY BD-SECURITY-INTOVERF "no error" */
}

/* MD5 API Helpr*/
void MD5_String	(IN const char* szString, OUT uint8_t byDigest[DIGEST_BINLEN])/* parasoft-suppress CODSTA-15 "no problem" */
{
	MD5_CTX context;
	unsigned int len = strlen (szString);

	MD5_init (&context);
	MD5_update (&context, (uint8_t*)szString, len);
	MD5_final (&context, byDigest);
}

void MD5_Bytes	(IN const uint8_t* bySrc, IN const unsigned long nSrcLen, OUT uint8_t byDigest[DIGEST_BINLEN])/* parasoft-suppress CODSTA-15 "no problem" */
{
	MD5_CTX context;

	MD5_init(&context);
	MD5_update(&context, (uint8_t*)bySrc, nSrcLen);
	MD5_final(&context, byDigest);
}

int MD5_File(IN const char* szFileName, OUT unsigned char byDigest[DIGEST_BINLEN])/* parasoft-suppress CODSTA-15 "no problem" */
{
	FILE *file;
	MD5_CTX context;
	int len = 1;
	unsigned char buffer[1024];

	if ((file = fopen (szFileName, "rb")) == NULL)
		return 0;
	else 	
	{
		memset(&context, 0, sizeof(context));
		MD5_init (&context);
		while(!feof(file) && len) {
			len = fread (buffer, 1, sizeof(buffer), file);
			MD5_update (&context, buffer, len);
		}
		MD5_final (&context, byDigest);
		
		fclose (file);
		return 1;
	}
}

void MD5_BinResultConvert(const unsigned char byDigest[16], char szDigest[33])/* parasoft-suppress CODSTA-15 "no problem" */
{
	sprintf(szDigest, "%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x", 
					byDigest[0], byDigest[1], byDigest[2], byDigest[3], 
					byDigest[4], byDigest[5], byDigest[6], byDigest[7], 
					byDigest[8], byDigest[9], byDigest[10], byDigest[11], 
					byDigest[12], byDigest[13], byDigest[14], byDigest[15]);
	szDigest[DIGEST_STRLEN - 1] = '\0';
}

//add by guozhen
void MD5_BinResultConvert_64b(uint64_t u64, char szDigest[17])/* parasoft-suppress CODSTA-15 "no problem" */
{
	unsigned char byDigest[8];
	memcpy(byDigest, &u64, 8);
	sprintf(szDigest, "%02x%02x%02x%02x%02x%02x%02x%02x", 
		byDigest[0], byDigest[1], byDigest[2], byDigest[3], 
		byDigest[4], byDigest[5], byDigest[6], byDigest[7]);
	szDigest[16] = '\0';
}

void MD5_StrResultConvert(const char szDigest[33], unsigned char byDigest[16])/* parasoft-suppress CODSTA-15 "no problem" */
{
	sscanf(szDigest, "%02hhx%02hhx%02hhx%02hhx%02hhx%02hhx%02hhx%02hhx%02hhx%02hhx%02hhx%02hhx%02hhx%02hhx%02hhx%02hhx",
					&byDigest[0], &byDigest[1], &byDigest[2], &byDigest[3], 
					&byDigest[4], &byDigest[5], &byDigest[6], &byDigest[7], 
					&byDigest[8], &byDigest[9], &byDigest[10], &byDigest[11], 
					&byDigest[12], &byDigest[13], &byDigest[14], &byDigest[15]);
}


/****************************************************************************
 *
 */

/*
 * My best guess at if you are big-endian or little-endian.  This may
 * need adjustment.
 */
#if (defined(__BYTE_ORDER) && defined(__LITTLE_ENDIAN) && \
     __BYTE_ORDER == __LITTLE_ENDIAN) || \
    (defined(i386) || defined(__i386__) || defined(__i486__) || \
     defined(__i586__) || defined(__i686__) || defined(vax) || defined(MIPSEL))
# define HASH_LITTLE_ENDIAN 1
# define HASH_BIG_ENDIAN 0
#elif (defined(__BYTE_ORDER) && defined(__BIG_ENDIAN) && \
       __BYTE_ORDER == __BIG_ENDIAN) || \
      (defined(sparc) || defined(POWERPC) || defined(mc68000) || defined(sel))
# define HASH_LITTLE_ENDIAN 0
# define HASH_BIG_ENDIAN 1
#else
# define HASH_LITTLE_ENDIAN 0
# define HASH_BIG_ENDIAN 0
#endif

#define rot(x,k) (((x)<<(k)) | ((x)>>(32-(k))))
#define mix(a,b,c) \
{ \
	a -= c;  a ^= rot(c, 4);  c += b; \
	b -= a;  b ^= rot(a, 6);  a += c; \
	c -= b;  c ^= rot(b, 8);  b += a; \
	a -= c;  a ^= rot(c,16);  c += b; \
	b -= a;  b ^= rot(a,19);  a += c; \
	c -= b;  c ^= rot(b, 4);  b += a; \
}


#define final(a,b,c) \
{ \
	c ^= b; c -= rot(b,14); \
	a ^= c; a -= rot(c,11); \
	b ^= a; b -= rot(a,25); \
	c ^= b; c -= rot(b,16); \
	a ^= c; a -= rot(c,4);  \
	b ^= a; b -= rot(a,14); \
	c ^= b; c -= rot(b,24); \
}

void hashlittle2( 
  const void *key,       /* the key to hash */
  size_t      length,    /* length of the key */
  uint32_t   *pc,        /* IN: primary initval, OUT: primary hash */
  uint32_t   *pb)        /* IN: secondary initval, OUT: secondary hash */
{
  uint32_t a,b,c;                                          /* internal state */
  union { const void *ptr; size_t i; } u;     /* needed for Mac Powerbook G4 */

  /* Set up the internal state */
  a = b = c = 0xdeadbeef + ((uint32_t)length) + *pc;
  c += *pb;

  u.ptr = key;
  if (HASH_LITTLE_ENDIAN && ((u.i & 0x3) == 0)) { /* parasoft-suppress BD-PB-CC "" */
    const uint32_t *k = (const uint32_t *)key;         /* read 32-bit chunks */

    /*------ all but last block: aligned reads and affect 32 bits of (a,b,c) */
    while (length > 12)
    {
      a += k[0];
      b += k[1];
      c += k[2];
      mix(a,b,c);
      length -= 12;
      k += 3;
    }

    /*----------------------------- handle the last (probably partial) block */
    /* 
     * "k[2]&0xffffff" actually reads beyond the end of the string, but
     * then masks off the part it's not allowed to read.  Because the
     * string is aligned, the masked-off tail is in the same word as the
     * rest of the string.  Every machine with memory protection I've seen
     * does it on word boundaries, so is OK with this.  But VALGRIND will
     * still catch it and complain.  The masking trick does make the hash
     * noticably faster for short strings (like English words).
     */
#ifndef VALGRIND

    switch(length)
    {
    case 12: c+=k[2]; b+=k[1]; a+=k[0]; break;
    case 11: c+=k[2]&0xffffff; b+=k[1]; a+=k[0]; break;
    case 10: c+=k[2]&0xffff; b+=k[1]; a+=k[0]; break;
    case 9 : c+=k[2]&0xff; b+=k[1]; a+=k[0]; break;
    case 8 : b+=k[1]; a+=k[0]; break;
    case 7 : b+=k[1]&0xffffff; a+=k[0]; break;
    case 6 : b+=k[1]&0xffff; a+=k[0]; break;
    case 5 : b+=k[1]&0xff; a+=k[0]; break;
    case 4 : a+=k[0]; break;
    case 3 : a+=k[0]&0xffffff; break;
    case 2 : a+=k[0]&0xffff; break;
    case 1 : a+=k[0]&0xff; break;
    case 0 : *pc=c; *pb=b; return;  /* zero length strings require no mixing */
	default: break;
    }

#else /* make valgrind happy */

    k8 = (const uint8_t *)k;
    switch(length)
    {
    case 12: c+=k[2]; b+=k[1]; a+=k[0]; break;
    case 11: c+=((uint32_t)k8[10])<<16;  /* fall through */
    case 10: c+=((uint32_t)k8[9])<<8;    /* fall through */
    case 9 : c+=k8[8];                   /* fall through */
    case 8 : b+=k[1]; a+=k[0]; break;
    case 7 : b+=((uint32_t)k8[6])<<16;   /* fall through */
    case 6 : b+=((uint32_t)k8[5])<<8;    /* fall through */
    case 5 : b+=k8[4];                   /* fall through */
    case 4 : a+=k[0]; break;
    case 3 : a+=((uint32_t)k8[2])<<16;   /* fall through */
    case 2 : a+=((uint32_t)k8[1])<<8;    /* fall through */
    case 1 : a+=k8[0]; break;
    case 0 : *pc=c; *pb=b; return;  /* zero length strings require no mixing */
    }

#endif /* !valgrind */

  } else if (HASH_LITTLE_ENDIAN && ((u.i & 0x1) == 0)) { /* parasoft-suppress BD-PB-CC "" */
    const uint16_t *k = (const uint16_t *)key;         /* read 16-bit chunks */
    const uint8_t  *k8;

    /*--------------- all but last block: aligned reads and different mixing */
    while (length > 12)
    {
      a += k[0] + (((uint32_t)k[1])<<16);
      b += k[2] + (((uint32_t)k[3])<<16);
      c += k[4] + (((uint32_t)k[5])<<16);
      mix(a,b,c);
      length -= 12;
      k += 6;
    }

    /*----------------------------- handle the last (probably partial) block */
    k8 = (const uint8_t *)k;
    switch(length)
    {
    case 12: c+=k[4]+(((uint32_t)k[5])<<16);
             b+=k[2]+(((uint32_t)k[3])<<16);
             a+=k[0]+(((uint32_t)k[1])<<16);
             break;
    case 11: c+=((uint32_t)k8[10])<<16;     /* fall through */
    case 10: c+=k[4];
             b+=k[2]+(((uint32_t)k[3])<<16);
             a+=k[0]+(((uint32_t)k[1])<<16);
             break;
    case 9 : c+=k8[8];                      /* fall through */
    case 8 : b+=k[2]+(((uint32_t)k[3])<<16);
             a+=k[0]+(((uint32_t)k[1])<<16);
             break;
    case 7 : b+=((uint32_t)k8[6])<<16;      /* fall through */
    case 6 : b+=k[2];
             a+=k[0]+(((uint32_t)k[1])<<16);
             break;
    case 5 : b+=k8[4];                      /* fall through */
    case 4 : a+=k[0]+(((uint32_t)k[1])<<16);
             break;
    case 3 : a+=((uint32_t)k8[2])<<16;      /* fall through */
    case 2 : a+=k[0];
             break;
    case 1 : a+=k8[0];
             break;
    case 0 : *pc=c; *pb=b; return;  /* zero length strings require no mixing */
    }

  } else {                        /* need to read the key one uint8_t at a time */
    const uint8_t *k = (const uint8_t *)key;

    /*--------------- all but the last block: affect some 32 bits of (a,b,c) */
    while (length > 12)
    {
      a += k[0];
      a += ((uint32_t)k[1])<<8;
      a += ((uint32_t)k[2])<<16;
      a += ((uint32_t)k[3])<<24;
      b += k[4];
      b += ((uint32_t)k[5])<<8;
      b += ((uint32_t)k[6])<<16;
      b += ((uint32_t)k[7])<<24;
      c += k[8];
      c += ((uint32_t)k[9])<<8;
      c += ((uint32_t)k[10])<<16;
      c += ((uint32_t)k[11])<<24;
      mix(a,b,c);
      length -= 12;
      k += 12;
    }

    /*-------------------------------- last block: affect all 32 bits of (c) */
    switch(length)                   /* all the case statements fall through */
    {
    case 12: c+=((uint32_t)k[11])<<24;
    case 11: c+=((uint32_t)k[10])<<16;
    case 10: c+=((uint32_t)k[9])<<8;
    case 9 : c+=k[8];
    case 8 : b+=((uint32_t)k[7])<<24;
    case 7 : b+=((uint32_t)k[6])<<16;
    case 6 : b+=((uint32_t)k[5])<<8;
    case 5 : b+=k[4];
    case 4 : a+=((uint32_t)k[3])<<24;
    case 3 : a+=((uint32_t)k[2])<<16;
    case 2 : a+=((uint32_t)k[1])<<8;
    case 1 : a+=k[0];
             break;
    case 0 : *pc=c; *pb=b; return;  /* zero length strings require no mixing */
    }
  }

  final(a,b,c);
  *pc=c; *pb=b;
}

/*****************************************************************************
 *
 */
uint64_t GetMd5OfString(const char *url, unsigned int len)
{
#if 0
	unsigned char md5[DIGEST_BINLEN];
	MD5_String(str,md5);
	return *((uint64_t *)md5);
#endif
	uint64_t result = 0;
	unsigned int a = 0,b = 0;

	hashlittle2((void *)url, len, &a, &b);

	result = a;
	result <<= 32;
	result |= b;

	return result;

}

// ASCII码大小写转换字码表
static char s_charcase[] = 
{
	0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 
	0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 
	0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20, 0x21, 0x22, 0x23, 
	0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d, 0x2e, 0x2f, 
	0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x3b, 
	0x3c, 0x3d, 0x3e, 0x3f, 0x40, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 
	0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73,
	0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x5b, 0x5c, 0x5d, 0x5e, 0x5f, 
	0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 
	0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 
	0x78, 0x79, 0x7a, 0x7b, 0x7c, 0x7d, 0x7e, 0x7f, 0x80, 0x81, 0x82, 0x83,
	0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a, 0x8b, 0x8c, 0x8d, 0x8e, 0x8f, 
	0x90, 0x91, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0x9b, 
	0x9c, 0x9d, 0x9e, 0x9f, 0xa0, 0xa1, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 
	0xa8, 0xa9, 0xaa, 0xab, 0xac, 0xad, 0xae, 0xaf, 0xb0, 0xb1, 0xb2, 0xb3, 
	0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xbb, 0xbc, 0xbd, 0xbe, 0xbf, 
	0xc0, 0xc1, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xcb, 
	0xcc, 0xcd, 0xce, 0xcf, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 
	0xd8, 0xd9, 0xda, 0xdb, 0xdc, 0xdd, 0xde, 0xdf, 0xe0, 0xe1, 0xe2, 0xe3, 
	0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb, 0xec, 0xed, 0xee, 0xef, 
	0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa, 0xfb,
	0xfc, 0xfd, 0xfe, 0xff
};

// 大写转小写
#define char_to_lower(c) (s_charcase[c])

void hashlittle2_case( 
  const void *key,       /* the key to hash */
  size_t      length,    /* length of the key */
  uint32_t   *pc,        /* IN: primary initval, OUT: primary hash */
  uint32_t   *pb)        /* IN: secondary initval, OUT: secondary hash */
{
  uint32_t a,b,c;                                          /* internal state */
  union { const void *ptr; size_t i; } u;     /* needed for Mac Powerbook G4 */

  /* Set up the internal state */
  a = b = c = 0xdeadbeef + ((uint32_t)length) + *pc;
  c += *pb;

  u.ptr = key;
  if (HASH_LITTLE_ENDIAN && ((u.i & 0x3) == 0)) { /* parasoft-suppress BD-PB-CC "" */
    const uint32_t *k = (const uint32_t *)key;         /* read 32-bit chunks */

    /*------ all but last block: aligned reads and affect 32 bits of (a,b,c) */
    while (length > 12)
    {
      a += char_to_lower(k[0]);
      b += char_to_lower(k[1]);
      c += char_to_lower(k[2]);
      mix(a,b,c);
      length -= 12;
      k += 3;
    }

    /*----------------------------- handle the last (probably partial) block */
    /* 
     * "k[2]&0xffffff" actually reads beyond the end of the string, but
     * then masks off the part it's not allowed to read.  Because the
     * string is aligned, the masked-off tail is in the same word as the
     * rest of the string.  Every machine with memory protection I've seen
     * does it on word boundaries, so is OK with this.  But VALGRIND will
     * still catch it and complain.  The masking trick does make the hash
     * noticably faster for short strings (like English words).
     */
#ifndef VALGRIND

    switch(length)
    {
    case 12: c+=char_to_lower(k[2]); b+=char_to_lower(k[1]); a+=char_to_lower(k[0]); break;
    case 11: c+=char_to_lower(k[2])&0xffffff; b+=char_to_lower(k[1]); a+=char_to_lower(k[0]); break;
    case 10: c+=char_to_lower(k[2])&0xffff; b+=char_to_lower(k[1]); a+=char_to_lower(k[0]); break;
    case 9 : c+=char_to_lower(k[2])&0xff; b+=char_to_lower(k[1]); a+=char_to_lower(k[0]); break;
    case 8 : b+=char_to_lower(k[1]); a+=char_to_lower(k[0]); break;
    case 7 : b+=char_to_lower(k[1])&0xffffff; a+=char_to_lower(k[0]); break;
    case 6 : b+=char_to_lower(k[1])&0xffff; a+=char_to_lower(k[0]); break;
    case 5 : b+=char_to_lower(k[1])&0xff; a+=char_to_lower(k[0]); break;
    case 4 : a+=char_to_lower(k[0]); break;
    case 3 : a+=char_to_lower(k[0])&0xffffff; break;
    case 2 : a+=char_to_lower(k[0])&0xffff; break;
    case 1 : a+=char_to_lower(k[0])&0xff; break;
    case 0 : *pc=c; *pb=b; return;  /* zero length strings require no mixing */
	default: break;
    }

#else /* make valgrind happy */

    k8 = (const uint8_t *)k;
    switch(length)
    {
    case 12: c+=char_to_lower(k[2]); b+=char_to_lower(k[1]); a+=char_to_lower(k[0]); break;
    case 11: c+=((uint32_t)char_to_lower(k8[10]))<<16;  /* fall through */
    case 10: c+=((uint32_t)char_to_lower(k8[9]))<<8;    /* fall through */
    case 9 : c+=char_to_lower(k8[8]);                   /* fall through */
    case 8 : b+=char_to_lower(k[1]); a+=char_to_lower(k[0]); break;
    case 7 : b+=((uint32_t)char_to_lower(k8[6]))<<16;   /* fall through */
    case 6 : b+=((uint32_t)char_to_lower(k8[5]))<<8;    /* fall through */
    case 5 : b+=char_to_lower(k8[4]);                   /* fall through */
    case 4 : a+=char_to_lower(k[0]); break;
    case 3 : a+=((uint32_t)char_to_lower(k8[2]))<<16;   /* fall through */
    case 2 : a+=((uint32_t)char_to_lower(k8[1]))<<8;    /* fall through */
    case 1 : a+=char_to_lower(k8[0]); break;
    case 0 : *pc=c; *pb=b; return;  /* zero length strings require no mixing */
    }

#endif /* !valgrind */

  } else if (HASH_LITTLE_ENDIAN && ((u.i & 0x1) == 0)) { /* parasoft-suppress BD-PB-CC "" */
    const uint16_t *k = (const uint16_t *)key;         /* read 16-bit chunks */
    const uint8_t  *k8;

    /*--------------- all but last block: aligned reads and different mixing */
    while (length > 12)
    {
      a += char_to_lower(k[0]) + (((uint32_t)char_to_lower(k[1]))<<16);
      b += char_to_lower(k[2]) + (((uint32_t)char_to_lower(k[3]))<<16);
      c += char_to_lower(k[4]) + (((uint32_t)char_to_lower(k[5]))<<16);
      mix(a,b,c);
      length -= 12;
      k += 6;
    }

    /*----------------------------- handle the last (probably partial) block */
    k8 = (const uint8_t *)k;
    switch(length)
    {
    case 12: c+=char_to_lower(k[4])+(((uint32_t)char_to_lower(k[5]))<<16);
             b+=char_to_lower(k[2])+(((uint32_t)char_to_lower(k[3]))<<16);
             a+=char_to_lower(k[0])+(((uint32_t)char_to_lower(k[1]))<<16);
             break;
    case 11: c+=((uint32_t)char_to_lower(k8[10]))<<16;     /* fall through */
    case 10: c+=char_to_lower(k[4]);
             b+=char_to_lower(k[2])+(((uint32_t)char_to_lower(k[3]))<<16);
             a+=char_to_lower(k[0])+(((uint32_t)char_to_lower(k[1]))<<16);
             break;
    case 9 : c+=char_to_lower(k8[8]);                      /* fall through */
    case 8 : b+=char_to_lower(k[2])+(((uint32_t)char_to_lower(k[3]))<<16);
             a+=char_to_lower(k[0])+(((uint32_t)char_to_lower(k[1]))<<16);
             break;
    case 7 : b+=((uint32_t)char_to_lower(k8[6]))<<16;      /* fall through */
    case 6 : b+=char_to_lower(k[2]);
             a+=char_to_lower(k[0])+(((uint32_t)char_to_lower(k[1]))<<16);
             break;
    case 5 : b+=char_to_lower(k8[4]);                      /* fall through */
    case 4 : a+=char_to_lower(k[0])+(((uint32_t)char_to_lower(k[1]))<<16);
             break;
    case 3 : a+=((uint32_t)char_to_lower(k8[2]))<<16;      /* fall through */
    case 2 : a+=char_to_lower(k[0]);
             break;
    case 1 : a+=char_to_lower(k8[0]);
             break;
    case 0 : *pc=c; *pb=b; return;  /* zero length strings require no mixing */
    }

  } else {                        /* need to read the key one uint8_t at a time */
    const uint8_t *k = (const uint8_t *)key;

    /*--------------- all but the last block: affect some 32 bits of (a,b,c) */
    while (length > 12)
    {
      a += char_to_lower(k[0]);
      a += ((uint32_t)char_to_lower(k[1]))<<8;
      a += ((uint32_t)char_to_lower(k[2]))<<16;
      a += ((uint32_t)char_to_lower(k[3]))<<24;
      b += char_to_lower(k[4]);
      b += ((uint32_t)char_to_lower(k[5]))<<8;
      b += ((uint32_t)char_to_lower(k[6]))<<16;
      b += ((uint32_t)char_to_lower(k[7]))<<24;
      c += char_to_lower(k[8]);
      c += ((uint32_t)char_to_lower(k[9]))<<8;
      c += ((uint32_t)char_to_lower(k[10]))<<16;
      c += ((uint32_t)char_to_lower(k[11]))<<24;
      mix(a,b,c);
      length -= 12;
      k += 12;
    }

    /*-------------------------------- last block: affect all 32 bits of (c) */
    switch(length)                   /* all the case statements fall through */
    {
    case 12: c+=((uint32_t)char_to_lower(k[11]))<<24;
    case 11: c+=((uint32_t)char_to_lower(k[10]))<<16;
    case 10: c+=((uint32_t)char_to_lower(k[9]))<<8;
    case 9 : c+=char_to_lower(k[8]);
    case 8 : b+=((uint32_t)char_to_lower(k[7]))<<24;
    case 7 : b+=((uint32_t)char_to_lower(k[6]))<<16;
    case 6 : b+=((uint32_t)char_to_lower(k[5]))<<8;
    case 5 : b+=char_to_lower(k[4]);
    case 4 : a+=((uint32_t)char_to_lower(k[3]))<<24;
    case 3 : a+=((uint32_t)char_to_lower(k[2]))<<16;
    case 2 : a+=((uint32_t)char_to_lower(k[1]))<<8;
    case 1 : a+=char_to_lower(k[0]);
             break;
    case 0 : *pc=c; *pb=b; return;  /* zero length strings require no mixing */
    }
  }

  final(a,b,c);
  *pc=c; *pb=b;
}

uint64_t GetMd5OfCaseString(const char *url, unsigned int len)
{
#if 0
	unsigned char md5[DIGEST_BINLEN];
	MD5_String(str,md5);
	return *((uint64_t *)md5);
#endif
	uint64_t result = 0;
	unsigned int a = 0,b = 0;

	hashlittle2_case((void *)url, len, &a, &b);

	result = a;
	result <<= 32;
	result |= b;

	return result;

}
