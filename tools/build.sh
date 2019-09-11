#!/bin/sh
XML_PATH="/opt/svncheckout/clinet/xml/"
JSON_PATH="/opt/svncheckout/clinet/code/resource/config/"
TS_PATH="/opt/svncheckout/clinet/code/src/jsonmodel/"
TOOLS_PATH="/opt/svncheckout/clinet/code/tools/"
WWW_PATH="/var/www/html/peach_gy/resource/config/"
echo "删除旧有数据..."
yes|rm ${TS_PATH}*.ts*

cd ..
#svn revert resource/*
svn update
cd tools
/usr/local/bin/python3 py_create_TSmodel.py ${XML_PATH} ${JSON_PATH} ${TS_PATH}
cd ${JSON_PATH};zip config.zip *.json*;yes|rm config.bin;mv config.zip config.bin;yes|rm *.json*;rsync config.bin ${WWW_PATH}

