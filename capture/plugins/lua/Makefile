INCLUDE_OTHER = -I../.. -I../../thirdparty \
                -I/home/dps/thirdparty/glib-2.56.2/glib -I/home/dps/thirdparty/glib-2.56.2 -I/home/dps/thirdparty/glib-2.56.2/gmodule -I/home/dps/thirdparty/glib-2.56.2/gobject

install_sh = ${SHELL} /home/dps/install-sh
mkdir_p = /usr/bin/mkdir -p
INSTALL = /usr/bin/install -c
PLUGINDIR = /data/dps/plugins
LUA_CFLAGS = -I/home/dps/thirdparty/lua-5.3.5/src
LUA_LIBS = /home/dps/thirdparty/lua-5.3.5/src/liblua.a

SRCS=$(wildcard *.c)

../lua.so : $(SRCS) ../../moloch.h ../../hash.h ../../dll.h
	$(CC) --shared -o $@ -g -O2 -Wall -Wextra -D_GNU_SOURCE -fPIC $(INCLUDE_OTHER) $(LUA_CFLAGS) $(SRCS) $(LUA_LIBS)

all:$(SOS)

distclean realclean clean:
	rm -f *.o *.so
