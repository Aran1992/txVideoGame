@echo off
 
::CODER BY dsw POWERD BY iBAT
::修改项
set XML_PATH=%cd:\tools=\%xml\
::请勿修改
set JSON_PATH=%cd:\tools=\%resource\config\
set TS_PATH=%cd:\tools=\%src\jsonmodel\

md %TS_PATH%
del %TS_PATH%*.ts*

py py_create_TSmodel.py %XML_PATH% %JSON_PATH% %TS_PATH%

rar.exe a -ep %JSON_PATH%config.zip %JSON_PATH%*.json*
del %JSON_PATH%config.bin
ren %JSON_PATH%config.zip config.bin
del %JSON_PATH%*.json*

pause