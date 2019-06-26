install_sh = ${SHELL} /home/dps/install-sh
mkdir_p = /usr/bin/mkdir -p
INSTALL = /usr/bin/install -c
VIEWERDIR = /data/dps/viewer
CP = /bin/cp


all:

check:
	sudo npm ci
	sudo npm run bundle

install:
	@mkdir -p "$(VIEWERDIR)" "$(VIEWERDIR)/vueapp"
	/bin/rm -f $(VIEWERDIR)/public/style.css
	$(INSTALL) *.js package.json package-lock.json $(VIEWERDIR)
	sudo npm ci
	sudo npm run bundle:min
	$(CP) -pr views public $(VIEWERDIR)
	(cd $(VIEWERDIR) ; sudo npm ci --production)
	rm -f $(VIEWERDIR)/package-lock.json

distclean realclean clean:
	rm -rf node_modules
	rm -rf bundle
	(cd vueapp ; rm -rf node_modules ; rm -rf dist)
