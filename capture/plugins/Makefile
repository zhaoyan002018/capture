INCLUDE_PCAP  = -I/home/dps/thirdparty/libpcap-1.9.0

INCLUDE_OTHER = -I.. -I../thirdparty \
                -I/home/dps/thirdparty/glib-2.56.2/glib -I/home/dps/thirdparty/glib-2.56.2 -I/home/dps/thirdparty/glib-2.56.2/gmodule -I/home/dps/thirdparty/glib-2.56.2/gobject

install_sh = ${SHELL} /home/dps/install-sh
mkdir_p = /usr/bin/mkdir -p
INSTALL = /usr/bin/install -c
PLUGINDIR = /data/dps/plugins
WISEDIR = /data/dps/wiseService
BINDIR = /data/dps/bin

SRCS=$(wildcard *.c)
SOS=$(SRCS:.c=.so)

%.so : %.c ../moloch.h ../hash.h ../dll.h
	$(CC) --shared $(SANITIZE_FLAGS) -o $@ -g -O2 -Wall -Wextra -D_GNU_SOURCE -std=gnu99 -fPIC $(INCLUDE_PCAP) $(INCLUDE_OTHER) $<

all:$(SOS)

check:
	(cd wiseService ;sudo npm install --production)

install:
	$(INSTALL) taggerUpload.pl $(BINDIR)
	@mkdir -p "$(PLUGINDIR)"
	$(INSTALL) *.so *.jade *.js $(PLUGINDIR)
#	@mkdir -p "$(WISEDIR)"
#	$(INSTALL) wiseService/*.js wiseService/wiseService.ini.sample wiseService/package.json $(WISEDIR)
#	(cd $(WISEDIR) ;sudo npm install --production)
	@mkdir -p "$(PLUGINDIR)/writer-s3"
	$(INSTALL) writer-s3/*.js writer-s3/package.json $(PLUGINDIR)/writer-s3
	(cd $(PLUGINDIR)/writer-s3 ;sudo npm install --production)

distclean realclean clean:
	rm -f *.o *.so
