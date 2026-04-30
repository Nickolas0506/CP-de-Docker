# CP Docker — DimDim

Nickolas Davi · RM 564105

Dois containers (Node + PostgreSQL), mesma rede Docker. Imagens: Docker Hub (`postgres:16-alpine`, `node:20-alpine` no build).

## Rodar

```bash
docker compose up -d --build
```

- App: http://localhost:3000  
- Postgres: `localhost:5432` — user `dimdim`, senha `dimdim_secret`, database `dimdim`

```bash
docker compose down
```

## Evidências

```powershell
.\coletar-evidencias.ps1
```

Gera arquivos em `evidencias/`.
