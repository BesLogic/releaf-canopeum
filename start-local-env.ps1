## SQL
# Create volumes
# Run MySQL container
$commandsSQLContainer = @"
docker volume create --name mysql8-data
docker volume create --name mysql8-conf

docker run -d --name mysql --hostname mysql -p 3306:3306 -e MYSQL_DATABASE=canopeum_db -e MYSQL_ROOT_PASSWORD=Canopeum12345!@ -e MYSQL_USER=canopeum_user -e MYSQL_PASSWORD=CanopeumUser12345!@ -v mysql8-data:/var/lib/mysql -v mysql8-conf:/etc/mysql/conf.d mysql:8
"@

# Backend
# Acticate virtual environment
# Install dependencies
# Run database initialisation
# Run Django server
$commandsBackend = @"
cd canopeum_backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py runserver
"@

# Frontend
# Install dependencies
# Run React Vite server
$commandsFrontend = @"
cd canopeum_frontend
npm install
npm run dev
"@

# Initialize database
$commandsInitializeDatabase = @"
python manage.py initialize_database
"@

function Show-Menu
{
  param (
    [string]$Title = 'Run Local Environment'
  )
  Write-Host "================ $Title ================"

  Write-Host "1: Run all services"
  Write-Host "2: Run MySQL container"
  Write-Host "3: Run Django server"
  Write-Host "4: Run React Vite server"
  Write-Host "5: Initialize database"
  Write-Host "Q: Quit"
}

do
{
  Show-Menu
  $userInput = Read-Host "Please make a selection"
  switch ($userInput)
  {
    '1' {
      Start-Process powershell -ArgumentList "-NoExit", "-Command", $commandsSQLContainer
      Start-Process powershell -ArgumentList "-NoExit", "-Command", $commandsBackend
      Start-Process powershell -ArgumentList "-NoExit", "-Command", $commandsFrontend
    }
    '2' {
      Start-Process powershell -ArgumentList "-NoExit", "-Command", $commandsSQLContainer
    }
    '3' {
      Start-Process powershell -ArgumentList "-NoExit", "-Command", $commandsBackend
    }
    '4' {
      Start-Process powershell -ArgumentList "-NoExit", "-Command", $commandsFrontend
    }
    '5' {
      Start-Process powershell -ArgumentList "-NoExit", "-Command", $commandsInitializeDatabase
    }
    'q' {
      break
    }
  }
}

until ($true)
