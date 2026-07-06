@echo off
REM Professional Report Generator for Magazine Platform
echo Generating Professional Report...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Install python-docx if not already installed
echo Installing dependencies...
python -m pip install python-docx -q

REM Generate the report
echo Creating Word document...
python "%~dp0generate_professional_report.py"

REM Open the generated report
echo.
echo Report generation complete!
if exist "%~dp0Magazine_Platform_Professional_Report.docx" (
    echo Opening report...
    start "" "%~dp0Magazine_Platform_Professional_Report.docx"
) else (
    echo Report file not found. Please check for errors above.
)

pause
