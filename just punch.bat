@echo off
echo Attempting to punch your card ...
node index.js
if ERRORLEVEL 1 (
	echo Program terminated due to error ...
	pause >nul
	exit 1
) ELSE (
	echo Done! Bye!
	exit 0
)