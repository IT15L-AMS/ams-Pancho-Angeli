Write-Host "Stopping all Node processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2

Write-Host "Starting server on port 3001..." -ForegroundColor Green
npm run dev
