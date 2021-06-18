@echo off
echo NPM PUBLISH
echo Before continuing, ensure that:
echo - you are logged in (npm whoami)
echo - you have successfully rebuilt all the libraries (npm run build-all)
pause
cd .\dist\myrmidon\cadmus-admin
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-api
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-browser-hierarchy
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-core
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-item-editor
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-item-list
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-item-search
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-layer-demo
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-login
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-material
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-part-general-pg
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-part-general-ui
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-part-philology-pg
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-part-philology-ui
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-profile-core
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-reset-password
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-state
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-thesaurus-editor
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-thesaurus-list
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-thesaurus-ui
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-ui
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-ui-pg
call npm publish --access=public
cd ..\..\..
pause
cd .\dist\myrmidon\cadmus-user
call npm publish --access=public
cd ..\..\..
pause
echo ALL DONE
