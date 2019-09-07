Write-Host "Building all react components"

Remove-Item -Path .\dist\*
npm run build-register
npm run build-login

Write-Host "Finishined re-building all react components"