INSTALL_DIR   = @INSTALL_DIR@

BUILD_VERSION := $(shell git describe --tags)

CC            = gcc

INCLUDE_PCAP  = -I/home/dps/thirdparty/libpcap-1.9.0

INCLUDE_OTHER = -Ithirdparty \
                -I/home/dps/thirdparty/glib-2.56.2/glib -I/home/dps/thirdparty/glib-2.56.2 -I/home/dps/thirdparty/glib-2.56.2/gmodule -I/home/dps/thirdparty/glib-2.56.2/gobject \
	        -I/home/dps/thirdparty/yara/yara-3.8.1/libyara/include \
	        -I/home/dps/thirdparty/libmaxminddb-1.3.2/include \
	        -I/home/dps/thirdparty/curl-7.61.1/include\
			-I /usr/include/mysql\
			-I /usr/local/include


LIB_PCAP      = /home/dps/thirdparty/libpcap-1.9.0/libpcap.a  -lnl  -lnl
LIB_SNF       = /opt/snf/lib/*.so
LIB_OTHER     = /home/dps/thirdparty/glib-2.56.2/glib/.libs/libglib-2.0.a /home/dps/thirdparty/glib-2.56.2/gio/.libs/libgio-2.0.a /home/dps/thirdparty/glib-2.56.2/gobject/.libs/libgobject-2.0.a /home/dps/thirdparty/glib-2.56.2/gthread/.libs/libgthread-2.0.a /home/dps/thirdparty/glib-2.56.2/gmodule/.libs/libgmodule-2.0.a /home/dps/thirdparty/glib-2.56.2/glib/.libs/libglib-2.0.a \
	        /home/dps/thirdparty/yara/yara-3.8.1/libyara/.libs/libyara.a \
	        /home/dps/thirdparty/libmaxminddb-1.3.2/src/.libs/libmaxminddb.a \
	        /home/dps/thirdparty/curl-7.61.1/lib/.libs/libcurl.a \
                -lrt -luuid -lpcre  \
	        thirdparty/http_parser.o \
	        thirdparty/js0n.o \
	        thirdparty/patricia.o \
		-ldl -lpthread -lssl -lcrypto -lyaml -L/usr/lib64/mysql  -lm -lrt -ldl

C_FILES         = main.c db.c yara.c http.c config.c parsers.c plugins.c field.c trie.c writers.c writer-inplace.c writer-disk.c writer-null.c writer-simple.c readers.c reader-libpcap-file.c reader-libpcap.c reader-tpacketv3.c packet.c session.c rules.c drophash.c reader-null.c
O_FILES         = $(C_FILES:.c=.o)

INSTALL         = /usr/bin/install -c
bindir          = /data/dps/bin
installinclude  = /data/dps/include

SANITIZE_FLAGS  = -DMOLOCH_USE_MALLOC -fno-common -fsanitize=address -fsanitize=integer -fsanitize=nullability

all:thirdparty/js0n.o thirdparty/http_parser.o thirdparty/patricia.o
	$(CC) -fPIC -g -O2 -Wall -Wextra -D_GNU_SOURCE -std=gnu99 -c $(C_FILES) \
	    $(INCLUDE_PCAP) \
	    $(INCLUDE_OTHER) \
	    -DBUILD_VERSION='"$(BUILD_VERSION)"'
	$(CC) -rdynamic -ggdb $(O_FILES) -o capture \
            -u g_checksum_update -u g_hmac_update -u g_uri_unescape_segment \
	    $(LIB_PCAP) \
	    $(LIB_OTHER) \
	    -lm -lresolv -lmagic -lffi -lz
	(cd parsers; $(MAKE))
	(cd plugins; $(MAKE))

sanitize:thirdparty/js0n.o thirdparty/http_parser.o thirdparty/patricia.o
	$(CC) $(SANITIZE_FLAGS) -fPIC -g -O0 -Wall -Wextra -D_GNU_SOURCE -std=gnu99 -c $(C_FILES) \
	    $(INCLUDE_PCAP) \
	    $(INCLUDE_OTHER) \
	    -DBUILD_VERSION='"$(BUILD_VERSION)"'
	$(CC) $(SANITIZE_FLAGS) -rdynamic -ggdb $(O_FILES) -o capture \
            -u g_checksum_update -u g_hmac_update -u g_uri_unescape_segment \
	    $(LIB_PCAP) \
	    $(LIB_OTHER) \
	    -lm -lresolv -lmagic -lffi -lz
	-rm */*.so
	(cd parsers; $(MAKE) SANITIZE_FLAGS="$(SANITIZE_FLAGS)")
	(cd plugins; $(MAKE) SANITIZE_FLAGS="$(SANITIZE_FLAGS)")

thirdparty/js0n.o:thirdparty/js0n.c
	$(CC) -c thirdparty/js0n.c -o thirdparty/js0n.o

thirdparty/patricia.o:thirdparty/patricia.c
	$(CC) -c thirdparty/patricia.c -o thirdparty/patricia.o

thirdparty/http_parser.o: thirdparty/http_parser.c
	$(CC) -ggdb -DNDEBUG -DHTTP_PARSER_STRICT=0 -DHTTP_PARSER_DEBUG=0 -g -O2 -c thirdparty/http_parser.c -o thirdparty/http_parser.o

install: installdirs
	@mkdir -p $(installinclude)
	$(INSTALL) *.h thirdparty/http_parser.h $(installinclude)
	$(INSTALL) capture $(bindir)/capture

installdirs:
	$(INSTALL) -d $(bindir)
	(cd parsers; $(MAKE) install)
	(cd plugins; $(MAKE) install)

check:
	(cd plugins; $(MAKE) check)

distclean realclean clean:
	rm -f *.o capture */*.o */*.so

cppcheck:
	cppcheck --enable=all --std=c99 -I. -Ithirdparty *.c plugins/*.c parsers/*.c
