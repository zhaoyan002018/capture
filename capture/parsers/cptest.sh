#!/bin/sh
echo "进入parses目录！"
PARSERSDIR=/data/ops/parsers
INSTALL="/usr/bin/install -c"
SOINCLUDE=/home/dps/build64_release/capture/parsers

mkdir -p ${PARSERSDIR}
${INSTALL} ${SOINCLUDE}/*.so *.jade ${PARSERSDIR}

for file in `ls ${PARSERSDIR}/*.so`
do mv $file `echo $file|sed 's/lib//g'`
done;
echo "退出parses目录！"




