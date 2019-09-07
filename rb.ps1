Write-Host "Building all react components"

Remove-Item -Path .\views\react\dist\*
npm run build-register --prefix .\views\react\
npm run build-login --prefix .\views\react\

Write-Host "Finishined re-building all react components"