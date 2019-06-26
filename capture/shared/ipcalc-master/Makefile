INCLUDE_PCAP  = -I/home/dps/thirdparty/libpcap-1.9.0

INCLUDE_OTHER = -I.. -I../thirdparty \
                -I/home/dps/thirdparty/glib-2.56.2/glib -I/home/dps/thirdparty/glib-2.56.2 -I/home/dps/thirdparty/glib-2.56.2/gmodule -I/home/dps/thirdparty/glib-2.56.2/gobject

install_sh = ${SHELL} /home/dps/install-sh
mkdir_p = /usr/bin/mkdir -p
INSTALL = /usr/bin/install -c
PARSERSDIR = /data/dps/parsers

SRCS=$(wildcard *.c)
SOS=$(SRCS:.c=.so)

%.so : %.c ../moloch.h ../hash.h ../dll.h
	$(CC) --shared $(SANITIZE_FLAGS) -o $@ -g -O2 -Wall -Wextra -D_GNU_SOURCE -std=gnu99 -fPIC $(INCLUDE_PCAP) $(INCLUDE_OTHER) $<

all:$(SOS)

install:
	@mkdir -p "$(PARSERSDIR)"
	$(INSTALL) *.so *.jade $(PARSERSDIR)

distclean realclean clean:
	rm -f *.o *.so

