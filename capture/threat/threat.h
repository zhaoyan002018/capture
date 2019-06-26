#pragma once
#include "moloch.h"
#include <mysql.h>


extern MolochIntHashStd_t *warn_ip_hash;
extern MolochStringHashStd_t *warn_ipv6_hash;
extern MolochStringHashStd_t *warn_domain_hash;
extern MolochStringHashStd_t *warn_email_hash;
extern MYSQL *conn;
extern MYSQL_RES *res;
extern MYSQL_ROW row;




