install_sh = ${SHELL} /home/dps/install-sh
mkdir_p = /usr/bin/mkdir -p
INSTALL = /usr/bin/install -c
DBDIR = /data/dps/db


all:

install:
	@mkdir -p "$(DBDIR)"
	$(INSTALL) daily.sh db.pl elasticsearch.yml.sample runes.sh.sample $(DBDIR)

check:

distclean realclean clean:

