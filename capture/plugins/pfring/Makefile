INCLUDE_PCAP  = -I/home/dps/thirdparty/libpcap-1.9.0

INCLUDE_OTHER = -I../.. -I../../thirdparty \
                -I/home/dps/thirdparty/pf_ring_package/usr/local/include \
                -I/home/dps/thirdparty/pf_ring_package/usr/inlcude \
                -I/home/dps/thirdparty/glib-2.56.2/glib -I/home/dps/thirdparty/glib-2.56.2 -I/home/dps/thirdparty/glib-2.56.2/gmodule -I/home/dps/thirdparty/glib-2.56.2/gobject

INCLUDE_LIB = -L/home/dps/thirdparty/pf_ring_package/usr/local/lib/
install_sh = ${SHELL} /home/dps/install-sh
mkdir_p = /usr/bin/mkdir -p
INSTALL = /usr/bin/install -c
PLUGINDIR = /data/dps/plugins
WISEDIR = /data/dps/wiseService

SRCS=$(wildcard *.c)
SOS=$(patsubst %.c,../%.so,$(SRCS))

../%.so : %.c ../../moloch.h ../../hash.h ../../dll.h
	$(CC) --shared -o $@ -g -O2 -Wall -Wextra -D_GNU_SOURCE -fPIC $(INCLUDE_OTHER) $(INCLUDE_PCAP)  $<  $(INCLUDE_LIB) -lpfring

all:$(SOS)

distclean realclean clean:
	rm -f *.o *.so ../reader-pfring.so
