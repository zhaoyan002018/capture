INCLUDE_DIR = 
INSTALL = /usr/bin/install -c
SODIR = /data/dps/shared

SRCS=$(wildcard *.c)
SOS=$(SRCS:.c=.so)

%.so : %.c %.h
	$(CC) --shared $(SANITIZE_FLAGS) -o $@ -g -O2 -Wall -Wextra -D_GNU_SOURCE -std=gnu99 -fPIC $(INCLUDE_DIR) $<

all:$(SOS)

install:
	@mkdir -p "$(SODIR)"
	$(INSTALL) *.so  $(SODIR)

distclean realclean clean:
	rm -f *.o *.so

