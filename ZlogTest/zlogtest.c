#include <stdio.h> 
#include <glib.h>
#include "zlog.h"

#define LOG()do{\
	switch(level){\
		case 0:\
			dzlog_debug("debug,zlog ");\
			break;\
		case 1:\
			dzlog_info("info, zlog ");\
			break;\
		case 2:\
			dzlog_notice("notice, zlog");\
			break;\
		case 3:\
			dzlog_warn("warn, zlog");\
			break;\
		case 4:\
			dzlog_error("error, zlog");\
			break;\
		case 5:\
			dzlog_fatal("fatal, zlog");\
			break;\
	}\
}while(0);

static gint level=1;

static GOptionEntry entries[] = 
{
	/*{	  const gchar *long_name;		// ���� ��--name
		  gchar        short_name;		// ���� ��-n
		  gint         flags;           // GOptionFlags����
		  GOptionArg   arg;				// GOptionArg����
		  gpointer     arg_data;		// ���������������
		  const gchar* description;		// �����--help�����
		  const gchar* arg_description; "}*/
	{"LEVEL",	'L',	G_OPTION_FLAG_IN_MAIN,	G_OPTION_ARG_INT,	&level,	"is the log level for output,0-debug,1-info,2-notice 3-warn 4-error 5-fatal",	NULL},
	{NULL}
};

int main(int argc, char** argv)
{
	GError* error = NULL;
	GOptionContext* context;
	context = g_option_context_new("- zlog test");
	g_option_context_add_main_entries(context, entries, NULL);
	if(!g_option_context_parse(context, &argc, &argv, &error))//�����������command line���
	{
		g_print("option parsing failed: %s\n", error->message);
		exit(1);
	}
	char s[32];
	sprintf(s, "my_%d",level);
	int rc;
	rc = dzlog_init("/home/dps/ZlogTest/zlog.conf",s);

	if (rc) {
		printf("init failed\n");
		return -1;
	}

	dzlog_debug("debug,zlog");
	dzlog_info("info, zlog ");
	dzlog_notice("notice, zlog");
	dzlog_warn("warn, zlog");
	dzlog_error("error, zlog");
	dzlog_fatal("fatal, zlog");
	zlog_fini();

	return 0;
} 
