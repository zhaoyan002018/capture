#ifndef __MD5_H__
#define __MD5_H__
/* MD5.H - header file for MD5C.C
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
#ifndef __KERNEL__
#include <inttypes.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

/* MD5 context. */
typedef struct _MD5_CTX
{
	  unsigned int state[4];	/* state (ABCD) */
	  unsigned int count[2];	/* number of bits, modulo 2^64 (lsb first) */
	  unsigned char buffer[64]; /* input buffer */
} MD5_CTX;

/* MD5 API */
void MD5_init	(MD5_CTX *);
void MD5_update	(MD5_CTX *, unsigned char *, unsigned int);
void MD5_final	(MD5_CTX *, unsigned char [16]);

/* MD5 API Helpr*/
void MD5_String	(const char* szString, unsigned char byDigest[16]);
void MD5_Bytes	(const unsigned char* bySrc, const unsigned long nSrcLen, unsigned char byDigest[16]);
int  MD5_File	(const char* szFileName, unsigned char byDigest[16]);
	/* 0: FALSE; 1:TRUE */
void MD5_BinResultConvert(const unsigned char byDigest[16], char szDigest[33]);
void MD5_StrResultConvert(const char szDigest[33], unsigned char byDigest[16]);

//add by guozhen对截取过的64位值转换str
void MD5_BinResultConvert_64b(uint64_t u64, char szDigest[17]);

uint64_t GetMd5OfString(const char *str, unsigned int len);
// 忽略大小写
uint64_t GetMd5OfCaseString(const char *url, unsigned int len);
/* 摘要的二进制表示长度 16 */
#define DIGEST_BINLEN  16
/* 摘要的字符串表示长度 33 (32+'0') */
#define DIGEST_STRLEN (DIGEST_BINLEN * 2 + 1)

#ifdef __cplusplus
}
#endif 

#endif //__MD5_H__
