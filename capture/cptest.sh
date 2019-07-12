#!/bin/sh
echo "install begin!"
INSTALL="/usr/bin/install -c"
installinclude=/data/dps/include
bindir=/data/dps/bin
script=/home/dps/capture
capturehome=/home/dps/build64_release/capture

${INSTALL} -d ${bindir}

(cd parsers; ./cptest.sh)
(cd plugins; ./cptest.sh)

mkdir -p ${installinclude}
${INSTALL} *.h thirdparty/http_parser.h ${installinclude}
${INSTALL} ${capturehome}/capture ${bindir}/capture

#touch build64_release/capture/install_outs
echo "install end!"
