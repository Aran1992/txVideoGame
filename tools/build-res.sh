#!/bin/sh
SOURCE_PATH="/opt/svncheckout/clinet/code/resource"
WWW_PATH="/var/www/html/peach_gy/resource/"

cd ..
#svn revert resource/*
svn update
cd tools
/usr/local/php/bin/php linux_egret_res_tool.php 
cd $SOURCE_PATH;rsync -rt ./ ${WWW_PATH}
