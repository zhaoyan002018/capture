
#ifndef _CONTCFG_DES_H__
#define _CONTCFG_DES_H__ 
int rule_des(char *src, unsigned long s_len, 
    char *dst, unsigned long *d_len);
int rule_d_des(char *src, unsigned long s_len, 
    char *dst, unsigned long *d_len, unsigned long size);
#endif

