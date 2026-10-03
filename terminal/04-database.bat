@echo off 
title AMVATGRAM - 04 DATABASE 
color 0E 
cd /d D:\Projects 
cls 
echo ======================================== 
echo        AMVATGRAM - DATABASE 
echo ======================================== 
echo. 
echo PostgreSQL 18 - amvatgram 
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d amvatgram 
pause 
