@REM :: 可以用下面的步骤使用该脚本
@REM :: 1.首先必须已经安装了nodejs
@REM :: 2.在本目录运行npm install
@REM :: 3.运行本bat，等待结束

:: 填写作为输入的proto文件
@SET protofiles=*.proto

:: 输出文件名字，不包括后缀
@SET outputName=protoHH

:: 输出为json模块
@call ./node_modules/.bin/pbjs -t commonjs %protofiles% -o %outputName%.js
@if %errorlevel% neq 0 goto :EXIT_HERE

:: 补丁：修改输出的js文件的第一行："protobufjs"修改为："../protobufjs/protobuf"
:: @SET cmdstr="(gc %outputName%.js) -replace '"protobufjs"', '"../protobufjs/protobuf"' | Out-File -Encoding 'UTF8'  %outputName%.js"
:: @powershell -Command %cmdstr%

:: 根据js文件输出.d.ts文件以便typescript可以做类型检查
:: @call guohua %outputName%.js -o %outputName%.d.ts
@node ./guohua.js %outputName%.js -o %outputName%.d.ts
@node ./guohua.js %outputName%.js -x "protobuf"
@COPY /B %outputName%.d.ts ..\assets\Script\modules\lobby\protoHH\
@COPY /B %outputName%.js ..\assets\Script\modules\lobby\protoHH\
@DEL /Q %outputName%.d.ts
@DEL /Q %outputName%.js
:EXIT_HERE
@pause
