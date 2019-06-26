
#include <stdio.h>
#include <string.h>

//#include "inc/inifile.h"


//#include "inc/Crc.h"
//#include <RwIni.h>
#include "d3des_rule.h"
#include "base64.h"
#include "contdes.h"

#define HEADSTR "FRC4"
//#define HEADLONG '4CRF'
#define HEADLONG 0x34435246

//#define PRIVATERULEFILE "/etc/sinfor/contchkprivate.inf"


unsigned char password[24]="sangfor!";
unsigned char allbuf[32]={0xea,0xd3,0x45,0x98,0x44,0x2a,0xce,0x02,
                 0x1e,0xdc,0xda,0x48,0xd6,0xa4,0x92,0x10,
                 0x24,0xa0,0xcc,0xbb,0x72,0x7e,0x3f,0xf8,
                 0x3f,0xf8,0x48,0xd6,0xa4,0x92,0x2a,0xce};

//设置密钥
static int ContchkC(int c)
{
    char buf[16] = {0x01,0x23,0x45,0x67,0x89,0xab,0xcd,0xef,0x01,0x23,0x45,0x67,0x89,0xab,0xcd,0xff};
    //unsigned char *okbuf = new (std::nothrow)unsigned char[88];
    unsigned char *okbuf = (unsigned char *)malloc(88 * sizeof(unsigned char));
    if(!okbuf)
        {return -1;}
    memcpy(buf+1,allbuf,10);
    memcpy(okbuf,buf,10);
    memcpy(okbuf+9,allbuf+11,20);
    memcpy(okbuf+50,buf,16);
    okbuf[8]=0xE0;
    okbuf[22]= 0x6F;
    memcpy(okbuf+32,buf,16);
    des3key_sf(okbuf+2,c);
    free(okbuf);
    return 0;
    
}

//转为base64编码
int AddHeadandChangtoBase64(char *buf, unsigned long len, unsigned long size)
{
    if(!buf || !len|| len>size)
    {
        return -1;
    }
    
    unsigned long bufxlen = len*2;
    //unsigned char* bufx = new (std::nothrow)unsigned char[bufxlen];
    unsigned char* bufx = (unsigned char *)malloc(bufxlen * sizeof(unsigned char));
    if(!bufx)
        {return -1;}
    Base64Encode((unsigned char*)buf,len,bufx,&bufxlen);
    if ( 1<0)
    {
        goto _FAILED;
    }
    
    if( bufxlen >= size-4 )
    {
        goto _FAILED;
    }

    *((unsigned int*)buf) = (unsigned int)HEADLONG;
    memcpy( buf+4,bufx,bufxlen+1 );
    free(bufx);
    return 1;
_FAILED:
    free(bufx);
    return -1;
    
    
}

//　解码base64
int SubHeadandChangFromBase64(char *buf, unsigned long* plen, unsigned long size)
{
    if(!buf || !plen|| !(*plen))
    {
        return -1;
    }
    
    unsigned long bufxlen = (*plen)+1;
    //unsigned char* bufx = new (std::nothrow)unsigned char[bufxlen];
    unsigned char* bufx = (unsigned char *)malloc(bufxlen * sizeof(unsigned char));
    if(!bufx)
        {return -1;}
    
    if ( Base64Decode((unsigned char*)(buf+4),(*plen)-4,bufx,&bufxlen)<0)
    {
        goto _FAILED;
    }
    
    if( bufxlen >= size )
    {
        goto _FAILED;
    }
    memcpy( buf,bufx,bufxlen);
    *plen = bufxlen;
    free(bufx);
    return 1;
_FAILED:
    free(bufx);
    return -1;  
}

#define MAX_BUF_LEN         32768

int DecryptoString( char*buf ,unsigned long *buflen,unsigned long size)
{

    unsigned int HeadLong = (unsigned int)HEADLONG;
    unsigned long nIndex;
    char TmpDes[8];
    char *TmpBufDes;

    TmpBufDes = (char *)malloc(sizeof(char) * MAX_BUF_LEN);
    if (!TmpBufDes)
    {
        printf("DecryptoString: malloc TmpBufDes failed\n");
        return -1;
    }
    if( buf && *buflen>0 && *buflen<size &&(*((unsigned int*)buf))==HeadLong ) 
    {
        SubHeadandChangFromBase64(buf,buflen,size);
        ContchkC(1);
        for( nIndex=0; nIndex< *buflen; nIndex += 8 )
        {
            Ddes_sf( (unsigned char*)(&(buf[nIndex])),(unsigned char*)TmpDes);
            memcpy(TmpBufDes+nIndex,TmpDes,8);  
        }

        memset(buf,0,size);
        memcpy( buf,TmpBufDes,nIndex);
        free(TmpBufDes);
        return 1;
    }
    
    //printf("buf %p buflen %d size %d %llu %llu\n", buf, *buflen, size, *(unsigned long *)buf, HeadLong);
    free(TmpBufDes);
    return -1;

}


/*
 * function: 对加密规则进行解密
 *
 * @src                 被加密规则
 * @s_len               被加密规则长度
 * @dst                 存放解密后规则缓冲区
 * @d_len               解密后规则长度
 *
 * return
 *                          1 解密成功
 *                          -1 解密失败
 *
 * author: nihu 2011-04-21
 *
 */
int rule_d_des(char *src, unsigned long s_len, 
    char *dst, unsigned long *d_len, unsigned long size)
{
    memcpy(dst, src, s_len);
    *d_len = s_len;

    
    return DecryptoString(dst , d_len, size);
}

/*
 * functionL 规则加密函数
 *
 * @src             原始规则
 * @s_len       原始规则长度
 * @dst         加密后规则
 * @d_len       加密后规则长度
 *
 * return
 *              1 加密成功
 *              0 加密失败
 *
 * author: nihu 2011-04-21
 */
int rule_des(char *src, unsigned long s_len, 
    char *dst, unsigned long *d_len)
{
    char tmp_des[8];
    
    int ret = 1;
    unsigned long i;

    
    unsigned long head_long = (unsigned long)HEADLONG;

    ContchkC(0);
    if (s_len > 0 && 
        (*((unsigned long*)src))!= head_long)
    {
        for(i = 0; i < s_len; i += 8)
        {
            Ddes_sf((unsigned char*)(&(src[i])), (unsigned char*)tmp_des);
            memcpy(dst + i, tmp_des, 8);  
        }
        AddHeadandChangtoBase64(dst, i, MAX_BUF_LEN);
    }

    *d_len = strlen(dst);
    return ret;
}


