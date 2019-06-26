#include "moloch.h"
#include <mysql.h>
#include <regex.h>

//威胁库hash表
MolochIntHashStd_t      *warn_ip_hash;
MolochStringHashStd_t   *warn_ipv6_hash;
MolochStringHashStd_t   *warn_domain_hash;
MolochStringHashStd_t   *warn_email_hash;
extern MolochConfig_t         config;

regex_t                 domain_regex;
regex_t                 ipv4_regex;
regex_t                 ipv6_regex;
regex_t                 email_regex;
char                    regex_msgbuf[100];

//扫描威胁库配置目录并循环加载
void load_warn_data()
{
	//初始化ip hash存储结构
	warn_ip_hash = MOLOCH_TYPE_ALLOC(MolochIntHashStd_t);
	HASH_INIT(i_, *warn_ip_hash, moloch_int_hash, moloch_int_cmp);
	//初始化ipv6hash存储结构
	warn_ipv6_hash = MOLOCH_TYPE_ALLOC(MolochStringHashStd_t);
	HASH_INIT(s_, *warn_ipv6_hash, moloch_string_hash, moloch_string_ncmp);
	//初始化域名hash存储结构
	warn_domain_hash = MOLOCH_TYPE_ALLOC(MolochStringHashStd_t);
	HASH_INIT(s_, *warn_domain_hash, moloch_string_hash, moloch_string_ncmp);
	//初始化email hash存储结构
	warn_email_hash = MOLOCH_TYPE_ALLOC(MolochStringHashStd_t);
	HASH_INIT(s_, *warn_email_hash, moloch_string_hash, moloch_string_ncmp);

	// char *ip_test = "192.168.1.1";
	// int ret = identify_rule_type(ip_test);
	// LOG("ip test:------ %d", ret);
	// char *domain_test = "www.baidu.com";
	// int ret = identify_rule_type(domain_test);
	// LOG("domain test:------ %d", ret);
	// char *email_test = "aaa.aa@qq.com";
	// ret = identify_rule_type(email_test);
	// LOG("email test:------ %d", ret);
	// exit(0);
	LOG("Loading threat library");

	int i;
	for (i = 0; config.threatLibDir[i]; i++)
	{
		GError *error = NULL;
		GDir *dir = g_dir_open(config.threatLibDir[i], 0, &error);
		if (!dir || error)
		{
			if (dir)
				g_dir_close(dir);
			if (error)
				g_free(error);
			continue;
		}

		const gchar *filename;
		while ((filename = g_dir_read_name(dir)))
		{
			// Skip hidden files/directories
			if (filename[0] == '.')
				continue;

			gchar *fullfilename = g_build_filename(config.threatLibDir[i], filename, NULL);
			LOG("Load threat lib [%d]:%s", i, fullfilename);
			load_threat_rules(fullfilename);
			g_free(fullfilename);
		}
		g_dir_close(dir);
	}
	LOG("Threat library loaded");
}

//编译威胁规则分类正则表达式
int init_threat_regex()
{
	int reti;
	// reti = regcomp(&email_regex, "^[a-zA-Z0-9.!#$\%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$", REG_EXTENDED | REG_ICASE | REG_NEWLINE | REG_NOSUB);
	reti = regcomp(&email_regex, "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$", REG_EXTENDED | REG_ICASE | REG_NEWLINE | REG_NOSUB);
	if (reti)
	{
		LOG("Could not compile email regex ret:%d", reti);
		exit(1);
	}

	reti = regcomp(&domain_regex, "([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]", REG_EXTENDED | REG_ICASE | REG_NEWLINE | REG_NOSUB);
	// reti = regcomp(&domain_regex, "(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]", REG_EXTENDED | REG_ICASE | REG_NEWLINE | REG_NOSUB);
	if (reti)
	{
		LOG("Could not compile domain regex %d", reti);
		exit(1);
	}
	reti = regcomp(&ipv4_regex, "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$", REG_EXTENDED | REG_ICASE | REG_NEWLINE | REG_NOSUB);
	if (reti)
	{
		LOG("Could not compile ipv4 regex");
		exit(1);
	}
	reti = regcomp(&ipv6_regex, "(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))", REG_EXTENDED | REG_ICASE | REG_NEWLINE | REG_NOSUB);
	if (reti)
	{
		LOG("Could not compile ipv6 regex");
		exit(1);
	}

	//TODO ipv6
}

int exit_threat_regex()
{
	regfree(&domain_regex);
	regfree(&ipv4_regex);
	regfree(&ipv6_regex);
	regfree(&email_regex);
	// TODO ipv6
}

//判别威胁库条目类型，加载库时分类如hash表
//1:ipv4 2:ipv6 3:domain 4:email
int identify_rule_type(char *rule)
{
	int reti;
	// match ipv4
	reti = regexec(&ipv4_regex, rule, 0, NULL, 0);
	if (!reti)
	{
		// LOG("%s match ipv4",rule);
		return 1;
	}
	if (reti != REG_NOMATCH)
	{
		regerror(reti, &ipv4_regex, regex_msgbuf, sizeof(regex_msgbuf));
		LOG("ipv4 Regex match failed: %s", regex_msgbuf);
		exit(1);
	}
	// match ipv6
	reti = regexec(&ipv6_regex, rule, 0, NULL, 0);
	if (!reti)
	{
		// LOG("%s match ipv6",rule);
		return 2;
	}
	if (reti != REG_NOMATCH)
	{
		regerror(reti, &ipv6_regex, regex_msgbuf, sizeof(regex_msgbuf));
		LOG("ipv6 Regex match failed: %s", regex_msgbuf);
		exit(1);
	}

	//match email
	reti = regexec(&email_regex, rule, 0, NULL, 0);
	if (!reti)
	{
		// LOG("%s match email", rule);
		return 4;
	}
	if (reti != REG_NOMATCH)
	{
		regerror(reti, &email_regex, regex_msgbuf, sizeof(regex_msgbuf));
		LOG("email Regex match failed: %s", regex_msgbuf);
		exit(1);
	}

	//match domain
	reti = regexec(&domain_regex, rule, 0, NULL, 0);
	if (!reti)
	{
		// LOG("%s match domain", rule);
		return 3;
	}
	if (reti != REG_NOMATCH)
	{
		regerror(reti, &domain_regex, regex_msgbuf, sizeof(regex_msgbuf));
		LOG("domain Regex match failed: %s", regex_msgbuf);
		exit(1);
	}


	return 0;
}

//ipv6 key标准化
void ipv6_btos(unsigned char *ipv6, char *standard_addr, int len)
{
	snprintf(standard_addr, len, "%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x",
		ipv6[0], ipv6[1], ipv6[2], ipv6[3], ipv6[4], ipv6[5], ipv6[6], ipv6[7], ipv6[8], ipv6[9], ipv6[10],
		ipv6[11], ipv6[12], ipv6[13], ipv6[14], ipv6[15]);
	// int i = 0;
	// for(i = 0; i < 16; i++) {
	//     printf("%x ", ipv6[i]);
	// }
	// printf("\n");
}

//加载威胁库文件
void load_threat_rules(char *name)
{
	FILE *fp;
	char line[1000];
	if (!(fp = fopen(name, "r")))
	{
		LOG("Couldn't open warn ip data from %s", name);
		exit(1);
	}
	int ipv4_count = 0;
	int ipv6_count = 0;
	int email_count = 0;
	int domain_count = 0;

	while (fgets(line, sizeof(line), fp))
	{
		line[strcspn(line, "\r\n")] = 0;
		int type = identify_rule_type(line);
		if (type == 1)
		{
			struct in_addr addr;
			MolochInt_t *hint;
			int ret = inet_aton(line, &addr);
			if (ret == 0)
			{
				// LOG("invalid ip (%s) in warn ip data file ", line);
				continue;
			}

			HASH_FIND_INT(i_, *warn_ip_hash, addr.s_addr, hint);
			if (hint)
			{
				//ip exist
				continue;
				LOG("duplicated ip (%s) in warn ip data file ", line);
			}
			//ip not exist
			hint = MOLOCH_TYPE_ALLOC(MolochInt_t);
			HASH_ADD(i_, *warn_ip_hash, (void *)(long)addr.s_addr, hint);
			++ipv4_count;
			// LOG("ip:%s(%ld) added------------", ipstr, addr.s_addr);
		}
		else if (type == 2)
		{
			struct in6_addr addr;
			if (inet_pton(AF_INET6, line, &addr) == 1)
			{
				char ipv6_addr[33];
				bzero(ipv6_addr, sizeof(ipv6_addr));
				ipv6_btos(addr.s6_addr, ipv6_addr, sizeof(ipv6_addr));
				MolochString_t *hstring = MOLOCH_TYPE_ALLOC(MolochString_t);
				hstring->str = g_strdup(ipv6_addr);
				hstring->len = strlen(ipv6_addr);
				hstring->utf8 = 0;
				hstring->uw = 0;
				HASH_ADD(s_, *warn_ipv6_hash, hstring->str, hstring);
				// LOG("ipv6 addr:%s org:%s", hstring->str, line);
				++ipv6_count;
			}
			else
			{
				// LOG("convert ipv6 address fail. %s",line);
			}
		}
		else if (type == 3)
		{
			//domain
			MolochString_t *hstring = MOLOCH_TYPE_ALLOC(MolochString_t);
			hstring->str = g_strdup(line);
			hstring->len = strlen(line);
			hstring->utf8 = 0;
			hstring->uw = 0;
			HASH_ADD(s_, *warn_domain_hash, hstring->str, hstring);
			++domain_count;
		}
		else if (type == 4)
		{
			//email
			MolochString_t *hstring = MOLOCH_TYPE_ALLOC(MolochString_t);
			hstring->str = g_strdup(line);
			hstring->len = strlen(line);
			hstring->utf8 = 0;
			hstring->uw = 0;
			HASH_ADD(s_, *warn_email_hash, hstring->str, hstring);
			++email_count;
		}
	}
	fclose(fp);
	LOG("Loaded entries count: IPv4[%d] IPv6[%d] email[%d] domain[%d]", ipv4_count, ipv6_count, email_count, domain_count);
}

void load_ioc_lib() {
	for (int d = 0; config.parsersDir[d]; d++) {
		GError      *error = 0;
		GDir *dir = g_dir_open(config.parsersDir[d], 0, &error);

		if (error) {
			LOG("Error with %s: %s", config.parsersDir[d], error->message);
			g_error_free(error);
			if (dir)
				g_dir_close(dir);
			continue;
		}

		if (!dir)
			continue;

		const gchar *filename;
		gchar *filenames[100];
		int    flen = 0;

		while ((filename = g_dir_read_name(dir))) {
			// Skip hidden files/directories
			if (filename[0] == '.')
				continue;

			// If it doesn't end with .so we ignore it
			if (strlen(filename) < 3 || strcasecmp(".so", filename + strlen(filename) - 3) != 0) {
				continue;
			}

			HASH_FIND(s_, loaded, filename, hstring);
			if (hstring) {
				if (config.debug) {
					LOG("Skipping %s in %s since already loaded", filename, config.parsersDir[d]);
				}
				continue; /* Already loaded */
			}

			filenames[flen] = g_strdup(filename);
			flen++;
		}

		qsort((void *)filenames, (size_t)flen, sizeof(char *), cstring_cmp);

		int i;
		for (i = 0; i < flen; i++) {
			gchar *path = g_build_filename(config.parsersDir[d], filenames[i], NULL);
			GModule *parser = g_module_open(path, 0); /*G_MODULE_BIND_LAZY | G_MODULE_BIND_LOCAL);*/

			if (!parser) {
				LOG("ERROR - Couldn't load parser %s from '%s'\n%s", filenames[i], path, g_module_error());
				g_free(path);
				continue;
			}

			MolochPluginInitFunc parser_init;

			if (!g_module_symbol(parser, "moloch_parser_init", (gpointer *)(char*)&parser_init) || parser_init == NULL) {
				LOG("ERROR - Module %s doesn't have a moloch_parser_init", filenames[i]);
				g_free(filenames[i]);
				continue;
			}

			if (config.debug > 1) {
				LOG("Loaded %s", path);
			}

			g_free(path);

			parser_init();

			hstring = MOLOCH_TYPE_ALLOC0(MolochString_t);
			hstring->str = filenames[i];
			hstring->len = strlen(filenames[i]);
			HASH_ADD(s_, loaded, hstring->str, hstring);
		}
		g_dir_close(dir);
	}
}
void threat_init() {
	if (config.enableThreatCheck) {
		
		ip_lib = config.threatLibDir
		moloch_config_monitor_file("threat lib files of ips",)
	}
}