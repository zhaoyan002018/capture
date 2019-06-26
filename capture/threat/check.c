
//lys start

//检测是否http session，进而匹配域名威胁库，工作正常
if (config.enableThreatCheck && moloch_session_has_protocol(session, "http"))
{
	MolochField_t *field = 0;
	MolochString_t *hstring = 0;
	int pos = moloch_field_by_db("http.host"); //获取http.uri的在session数组中位置，Session定义中字段：MolochField_t        **fields;
	field = session->fields[pos];//取得session中http.uri字段指针
	/*
	//取得http.uri的类型，在http.c中 http.uri字段被定义为MOLOCH_FIELD_TYPE_STR_HASH类型
	urlsField = moloch_field_define("http", "termfield",
	"http.uri", "URI", "http.uri",
	"URIs for request",
	MOLOCH_FIELD_TYPE_STR_HASH, MOLOCH_FIELD_FLAG_CNT,
	"category", "[\"url\",\"host\"]",
	(char *)NULL);
	*/
	const MolochFieldInfo_t *info = config.fields[pos];
	MolochStringHashStd_t *shash = field->shash;
	HASH_FORALL(s_, *shash, hstring,
		check_domain_threat(hstring->str, (uint64_t)session->lastPacket.tv_sec, dbInfo[thread].prefix););
}
if (config.enableThreatCheck && moloch_session_has_protocol(session, "smtp"))
{

	MolochField_t *field = 0;
	MolochString_t *hstring = 0;
	int pos = moloch_field_by_db("email.src"); //获取http.uri的在session数组中位置，Session定义中字段：MolochField_t        **fields;
	field = session->fields[pos];              //取得session中http.uri字段指针
	const MolochFieldInfo_t *info = config.fields[pos];
	MolochStringHashStd_t *shash = field->shash;
	HASH_FORALL(s_, *shash, hstring,
		check_email_threat(hstring->str, (uint64_t)session->lastPacket.tv_sec, dbInfo[thread].prefix););
}
//lys end