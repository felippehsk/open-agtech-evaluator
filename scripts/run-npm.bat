@echo off
setlocal
:: Finds node/npm in common locations and runs npm with the given arguments.
:: Usage: run-npm.bat install   OR   run-npm.bat run dev

:: Always run from project root (directory that contains package.json)
cd /d "%~dp0.."
if not exist package.json (
  echo [run-npm] Error: package.json not found in %CD%
  exit /b 1
)

set "NODE_EXE="
set "NPM_CMD="

:: 1) Use PATH if available
where node >nul 2>&1 && set "NODE_EXE=node"
where npm  >nul 2>&1 && set "NPM_CMD=npm"

:: 2) Common install locations (Node installer puts node.exe and npm.cmd in same dir)
set "NODE_DIR="
if not defined NODE_EXE if exist "C:\Program Files\nodejs\node.exe" (
  set "NODE_EXE=C:\Program Files\nodejs\node.exe"
  set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"
  set "NODE_DIR=C:\Program Files\nodejs"
)
if not defined NODE_EXE if exist "C:\Program Files (x86)\nodejs\node.exe" (
  set "NODE_EXE=C:\Program Files (x86)\nodejs\node.exe"
  set "NPM_CMD=C:\Program Files (x86)\nodejs\npm.cmd"
  set "NODE_DIR=C:\Program Files (x86)\nodejs"
)
if not defined NODE_EXE if exist "%LOCALAPPDATA%\Programs\node\node.exe" (
  set "NODE_EXE=%LOCALAPPDATA%\Programs\node\node.exe"
  set "NPM_CMD=%LOCALAPPDATA%\Programs\node\npm.cmd"
  set "NODE_DIR=%LOCALAPPDATA%\Programs\node"
)
if not defined NODE_EXE if exist "%USERPROFILE%\AppData\Local\Programs\node\node.exe" (
  set "NODE_EXE=%USERPROFILE%\AppData\Local\Programs\node\node.exe"
  set "NPM_CMD=%USERPROFILE%\AppData\Local\Programs\node\npm.cmd"
  set "NODE_DIR=%USERPROFILE%\AppData\Local\Programs\node"
)
:: nvm-windows default
if not defined NODE_EXE if exist "%APPDATA%\nvm\nodejs\node.exe" (
  set "NODE_EXE=%APPDATA%\nvm\nodejs\node.exe"
  set "NPM_CMD=%APPDATA%\nvm\nodejs\npm.cmd"
  set "NODE_DIR=%APPDATA%\nvm\nodejs"
)

if not defined NPM_CMD (
  echo [run-npm] Node/npm not found. Checked PATH and:
  echo   C:\Program Files\nodejs
  echo   C:\Program Files ^(x86^)\nodejs
  echo   %%LOCALAPPDATA%%\Programs\node
  echo   %%APPDATA%%\nvm\nodejs
  echo.
  echo See docs\TROUBLESHOOTING_NPM_PATH.md for how to fix.
  exit /b 1
)

if "%~1"=="" (
  echo [run-npm] Usage: run-npm.bat ^<npm-args^>   e.g. run-npm.bat install   or   run-npm.bat run dev
  exit /b 0
)

:: So postinstall scripts (e.g. esbuild) can find node, prepend Node dir to PATH
if defined NODE_DIR set "PATH=%NODE_DIR%;%PATH%"

"%NPM_CMD%" %*
exit /b %ERRORLEVEL%
