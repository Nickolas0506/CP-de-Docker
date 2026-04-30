# CP de Docker — DimDim

**Nickolas Davi** · RM **564105**

Dois containers (**app** Node.js + **banco** PostgreSQL) na mesma rede Docker, imagens base do [Docker Hub](https://hub.docker.com).

## Subir o projeto

Requisito: [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine + Compose).

```bash
docker compose up -d --build
```

- API: <http://localhost:3000> · Health: <http://localhost:3000/health>  
- Postgres no host: `localhost:5432` (usuário `dimdim`, senha `dimdim_secret`, banco `dimdim`)

Parar: `docker compose down`

## Documentação

Instruções detalhadas, evidências e CRUD opcional: [**HOWTO.md**](HOWTO.md)

## Estrutura

| Arquivo / pasta | Descrição |
|-----------------|-----------|
| `docker-compose.yml` | Rede, volume nomeado, serviços `app` e `db` |
| `app/` | Dockerfile, API (`server.js`), dependências |
| `scripts/cp2-subir.ps1` | PowerShell: sobe com `docker compose` |
| `coletar-evidencias.ps1` | Gera pasta `evidencias/` para entrega |
