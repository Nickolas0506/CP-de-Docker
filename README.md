cp docker dimdim

nickolas davi rm 564105

codigo no github: https://github.com/Nickolas0506/CP-de-Docker

---

é o trabalho de devops, tem o container da api em node e o postgres, os dois na mesma rede do docker. imagem do postgres puxa direto do hub, a da app builda em cima do node alpine tb do hub.

pra subir (docker desktop tem q ta aberto):

docker compose up -d --build

localhost:3000 no navegador

postgres fica na 5432, user dimdim senha dimdim_secret banco dimdim

docker compose down pra parar

---

evidencia pro trabalho roda isso no powershell na pasta do projeto:

.\coletar-evidencias.ps1

cria uns txt na pasta evidencias
