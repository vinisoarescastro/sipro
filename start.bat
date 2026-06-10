@echo off
echo.
echo  SIPRO - Iniciando sistema...
echo.

echo  [1/3] Iniciando API de Questoes e Avaliacoes (porta 5001)...
start "SIPRO - API Questoes" /min cmd /c "cd python\questoes && python app.py"

echo  [2/3] Iniciando API de Correcao Automatica (porta 5000)...
start "SIPRO - API Correcao" /min cmd /c "cd python && python mainWebcan-web.py"

echo  [3/3] Aguardando APIs iniciarem...
timeout /t 3 /nobreak >nul

echo  [4/3] Iniciando frontend React...
echo.
echo  Acesse: http://localhost:3000
echo  Login:  CPF 12345678900 / Senha 12345678
echo.
cd sipro-app && npm run dev
