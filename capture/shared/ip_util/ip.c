#include"./ip.h"
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <netinet/in.h>

IPTYPE ipv4_net_to_type(struct in_addr net)
{
	unsigned byte1 = (ntohl(net.s_addr) >> 24) & 0xff;
	unsigned byte2 = (ntohl(net.s_addr) >> 16) & 0xff;
	unsigned byte3 = (ntohl(net.s_addr) >> 8) & 0xff;
	unsigned byte4 = (ntohl(net.s_addr)) & 0xff;

	/* based on IANA's iana-ipv4-special-registry and ipv4-address-space
	 * Updated: 2015-05-12
	 */
	if (byte1 == 0) {
		return IPTYPE_ON_NETWORK;
	}

	if (byte1 == 10) {
		return IPTYPE_PRIVATE;
	}

	if (byte1 == 100 && (byte2 & 0xc0) == 64) {
		return IPTYPE_SHARED;
	}

	if (byte1 == 127) {
		return IPTYPE_LOOKBACK;
	}

	if (byte1 == 169 && byte2 == 254) {
		return IPTYPE_LOCAL;
	}

	if (byte1 == 172 && (byte2 & 0xf0) == 16) {
		return IPTYPE_PRIVATE;
	}

	if (byte1 == 192 && byte2 == 0 && byte3 == 0) {
		return IPTYPE_IETF;
	}

	if (byte1 == 192 && byte2 == 2 && byte3 == 0) {
		return IPTYPE_TEST;
	}

	if (byte1 == 192 && byte2 == 51 && byte3 == 100) {
		return IPTYPE_TEST;
	}

	if (byte1 == 203 && byte2 == 0 && byte3 == 113) {
		return IPTYPE_TEST;
	}

	if (byte1 == 192 && byte2 == 88 && byte3 == 99) {
		return IPTYPE_ANYCAST;
	}

	if (byte1 == 192 && byte2 == 52 && byte3 == 193) {
		return IPTYPE_AMT;
	}

	if (byte1 == 192 && byte2 == 168) {
		return IPTYPE_PRIVATE;
	}

	if (byte1 == 255 && byte2 == 255 && byte3 == 255 && byte4 == 255) {
		return IPTYPE_BROADCAST;
	}

	if (byte1 == 198 && (byte2 & 0xfe) == 18) {
		return IPTYPE_BENCHMARK;
	}

	if (byte1 >= 224 && byte1 <= 239) {
		return IPTYPE_MULTICAST;
	}

	if ((byte1 & 0xf0) == 240) {
		return IPTYPE_RESERVED;
	}

	return IPTYPE_INTERNET;
}
