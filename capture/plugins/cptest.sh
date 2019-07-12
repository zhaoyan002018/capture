#!/bin/sh
echo "进入 plugins"
INSTALL="/usr/bin/install -c"
PLUGINDIR=/data/ops/plugins
WISEDIR=/data/ops/wiseService
BINDIR=/data/ops/bin
SOINCLUDE=/home/dps/build64_release/capture/plugins

${INSTALL} taggerUpload.pl ${BINDIR}
mkdir -p "${PLUGINDIR}"
${INSTALL} ${SOINCLUDE}/*.so *.jade *.js ${PLUGINDIR}
for file in `ls ${PLUGINDIR}/*.so`;do mv $file `echo $file|sed 's/lib//g'`;done;


mkdir -p "${PLUGINDIR}/writer-s3"
${INSTALL} writer-s3/*.js writer-s3/package.json ${PLUGINDIR}/writer-s3

(cd ${PLUGINDIR}/writer-s3 ;sudo npm install --production)
echo "退出plugins"








