#include<mysql.h>

MYSQL *g_mysql_conn = NULL;
MYSQL_RES               *res;
MYSQL_ROW               row;


static const char* db_server = "localhost";
static const char* mysql_user = "root";
static const char* db_pwd = "Yangxin0917!";
static const char* db_database = "dps_threat";
static const int db_port = 8003;

void ipv6_btos(unsigned char *ipv6, char *standard_addr, int len);
//lys end
//lys start
void init_mysql()
{
	g_mysql_conn = mysql_init(NULL);
	int reconnect = 1;
	// int timeout = 0;
	// if (mysql_get_option(g_mysql_conn, MYSQL_OPT_CONNECT_TIMEOUT, &timeout))
	//     LOG("mysql_get_options() failed");
	// LOG("mysql timeout %d", timeout);
	mysql_options(&g_mysql_conn, MYSQL_OPT_RECONNECT, &reconnect);
	mysql_autocommit(g_mysql_conn, 1);
	if (!mysql_real_connect(g_mysql_conn, db_server,
		mysql_user, db_pwd, db_database, db_port, NULL, 0))
	{
		LOG("mysql init fail: %s", mysql_error(g_mysql_conn));
		exit(1);
	}
	LOG("MySQL connection initialized.");
}

void mysql_exit()
{
	mysql_free_result(res);
	mysql_close(g_mysql_conn);
}