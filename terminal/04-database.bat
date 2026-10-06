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
echo.
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -h 127.0.0.1 -U postgres -d amvatgram
echo.
echo ========================================
echo   DATABASE SESSION CLOSED
echo ========================================
cmd /k