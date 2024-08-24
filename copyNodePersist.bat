@echo off  
echo Copying node-persist to output directory...  
  
REM 假设你知道node-persist的实际源路径（这里使用你提供的路径作为例子）  
SET SOURCE_PATH=.\node_modules\node-persist  
SET DEST_PATH=.\outputs\stickyNote-win32-x64\resources\node_modules\node-persist  
  
REM 使用robocopy复制内容  
robocopy "%SOURCE_PATH%" "%DEST_PATH%" /E /IS /IT /NP /NFL /NDL /NJH /NJS /XC /XN /XO  
  
REM 检查robocopy的退出代码，以确定是否成功复制  
IF %ERRORLEVEL% LSS 8 SET "RESULT=Success"  
IF %ERRORLEVEL% EQU 8 SET "RESULT=Some files were copied with errors."  
IF %ERRORLEVEL% GTR 8 SET "RESULT=Failed."  
  
echo %RESULT%  
  
REM 如果需要，可以删除原来的目录链接（注意：这可能会破坏依赖它的其他文件或系统）  
REM rmdir /S /Q ".\node_modules\node-persist"