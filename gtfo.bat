@echo off
setlocal
:PROMPT
SET /P AREYOUSURE=Are you sure you want to clock out (Y/N)? 
IF /I "%AREYOUSURE%" NEQ "Y" GOTO END
echo Attemping to clock out ...
node index.js
if ERRORLEVEL 1 (
	echo Program terminated due to error.
	pause >nul
	exit 1
)

echo Done! Bye!
shutdown -l

:END