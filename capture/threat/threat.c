#include "./threat.h"


//lys end

/******************************************************************************/
extern MolochConfig_t        config;

/******************************************************************************/
//lys start

//检查session源ipv4是否匹配威胁库
int check_ipv4_threat(uint32_t ipval, uint64_t ip_tm, char *ipstr, char *idx_name)
{
	if (!config.enableThreatCheck)
	{
		return NULL;
	}
	MolochInt_t *hint;
	HASH_FIND_INT(i_, *warn_ip_hash, ipval, hint);
	if (hint)
	{
		char sql[300];
		bzero(sql, sizeof(sql));
		snprintf(sql, sizeof(sql), "insert into threat_tbl (type,threat_entity,session_time,index_name) values(1,'%s',FROM_UNIXTIME(%lu),'%s')", ipstr, ip_tm, idx_name);
		if (mysql_real_query(conn, sql, strlen(sql)))
		{
			LOG("MYSQL ERROR %s. Reconnecting....", mysql_error(conn));
			// mysql_close(conn);
			conn = mysql_init(NULL);
			int reconnect = 1;
			mysql_options(&conn, MYSQL_OPT_RECONNECT, &reconnect);
			mysql_autocommit(conn, 1);
			if (!mysql_real_connect(conn, MYSQL_SERVER,
				MYSQL_USER, MYSQL_PWD, MYSQL_DATABASE, db_port, NULL, 0))
			{
				LOG("mysql reconnect fail: %s", mysql_error(conn));
				exit(1);
			}
			if (mysql_real_query(conn, sql, strlen(sql))) {
				LOG("MYSQL ERROR %s. exit", mysql_error(conn));
				exit(1);
			}
		}
		LOG("MYSQL Operation: %s ", sql);
		//ip match
		return 1;
	}
	return 0;
}
//检查session源ipv6包地址是否匹配威胁库
int check_ipv6_threat(struct in6_addr addr, uint64_t ip_tm, char *ipstr, char *idx_name)
{
	if (!config.enableThreatCheck)
	{
		return NULL;
	}
	MolochString_t *hstring = 0;
	LOG("check ipv6:%s", ipstr);
	char ipv6_addr[33];
	bzero(ipv6_addr, sizeof(ipv6_addr));
	ipv6_btos(addr.s6_addr, ipv6_addr, sizeof(ipv6_addr));
	HASH_FIND(s_, *warn_ipv6_hash, ipv6_addr, hstring);
	if (hstring)
	{
		char sql[300];
		bzero(sql, sizeof(sql));
		snprintf(sql, sizeof(sql), "insert into threat_tbl (type,threat_entity,session_time,index_name) values(2,'%s',FROM_UNIXTIME(%lu),'%s')", ipstr, ip_tm, idx_name);
		if (mysql_real_query(conn, sql, strlen(sql)))
		{
			LOG("MYSQL ERROR %s. Reconnecting....", mysql_error(conn));
			if (!mysql_real_connect(conn, MYSQL_SERVER,
				MYSQL_USER, MYSQL_PWD, MYSQL_DATABASE, db_port, NULL, 0))
			{
				LOG("MYSQL ERROR %s. Reconnecting....", mysql_error(conn));
				// mysql_close(conn);
				conn = mysql_init(NULL);
				int reconnect = 1;
				mysql_options(&conn, MYSQL_OPT_RECONNECT, &reconnect);
				mysql_autocommit(conn, 1);
				if (!mysql_real_connect(conn, MYSQL_SERVER,
					MYSQL_USER, MYSQL_PWD, MYSQL_DATABASE, db_port, NULL, 0))
				{
					LOG("mysql reconnect fail: %s", mysql_error(conn));
					exit(1);
				}
				if (mysql_real_query(conn, sql, strlen(sql)))
				{
					LOG("MYSQL ERROR %s. exit", mysql_error(conn));
					exit(1);
				}
			}
		}
		LOG("MYSQL Operation: %s ", sql);
		return 1;
	}
	return 0;
}
//检查http session 域名是否匹配威胁库
int check_domain_threat(char *domain, uint64_t session_tm, char *idx_name)
{
	if (!config.enableThreatCheck)
	{
		return NULL;
	}
	MolochString_t *hstring = 0;
	LOG("check domain:%s", domain);
	HASH_FIND(s_, *warn_domain_hash, domain, hstring);
	if (hstring) // hostname found
	{
		char sql[300];
		bzero(sql, sizeof(sql));
		snprintf(sql, sizeof(sql), "insert into threat_tbl (type,threat_entity,session_time,index_name) values(3,'%s',FROM_UNIXTIME(%lu),'%s')", domain, session_tm, idx_name);
		if (mysql_real_query(conn, sql, strlen(sql)))
		{
			LOG("MYSQL ERROR %s. Reconnecting....", mysql_error(conn));
			if (!mysql_real_connect(conn, MYSQL_SERVER,
				MYSQL_USER, MYSQL_PWD, MYSQL_DATABASE, db_port, NULL, 0))
			{
				LOG("MYSQL ERROR %s. Reconnecting....", mysql_error(conn));
				// mysql_close(conn);
				conn = mysql_init(NULL);
				int reconnect = 1;
				mysql_options(&conn, MYSQL_OPT_RECONNECT, &reconnect);
				mysql_autocommit(conn, 1);
				if (!mysql_real_connect(conn, MYSQL_SERVER,
					MYSQL_USER, MYSQL_PWD, MYSQL_DATABASE, db_port, NULL, 0))
				{
					LOG("mysql reconnect fail: %s", mysql_error(conn));
					exit(1);
				}
				if (mysql_real_query(conn, sql, strlen(sql)))
				{
					LOG("MYSQL ERROR %s. exit", mysql_error(conn));
					exit(1);
				}
			}
		}
		LOG("MYSQL Operation: %s ", sql);
		return 1;
	}
	return 0;
}
//检查smtp session 是否匹配威胁库
int check_email_threat(char *email, uint64_t session_tm, char *idx_name)
{
	if (!config.enableThreatCheck)
	{
		return NULL;
	}
	MolochString_t *hstring = 0;
	LOG("check email:%s", email);
	HASH_FIND(s_, *warn_email_hash, email, hstring);
	if (hstring)
	{
		char sql[300];
		bzero(sql, sizeof(sql));
		snprintf(sql, sizeof(sql), "insert into threat_tbl (type,threat_entity,session_time,index_name) values(4,'%s',FROM_UNIXTIME(%lu),'%s')", email, session_tm, idx_name);
		if (mysql_real_query(conn, sql, strlen(sql)))
		{
			LOG("MYSQL ERROR %s. Reconnecting....", mysql_error(conn));
			if (!mysql_real_connect(conn, MYSQL_SERVER,
				MYSQL_USER, MYSQL_PWD, MYSQL_DATABASE, db_port, NULL, 0))
			{
				LOG("MYSQL ERROR %s. Reconnecting....", mysql_error(conn));
				// mysql_close(conn);
				conn = mysql_init(NULL);
				int reconnect = 1;
				mysql_options(&conn, MYSQL_OPT_RECONNECT, &reconnect);
				mysql_autocommit(conn, 1);
				if (!mysql_real_connect(conn, MYSQL_SERVER,
					MYSQL_USER, MYSQL_PWD, MYSQL_DATABASE, db_port, NULL, 0))
				{
					LOG("mysql reconnect fail: %s", mysql_error(conn));
					exit(1);
				}
				if (mysql_real_query(conn, sql, strlen(sql)))
				{
					LOG("MYSQL ERROR %s. exit", mysql_error(conn));
					exit(1);
				}
			}
		}
		LOG("MYSQL Operation: %s ", sql);
		return 1;
	}
	return 0;
}
//lys end