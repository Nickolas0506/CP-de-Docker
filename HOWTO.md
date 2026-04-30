# How to — DimDim / Docker (Nickolas Davi, RM 564105)

**Critério de avaliação:** seguir **somente** o enunciado do AVA (dois containers App + Banco na mesma rede Docker, imagens do Hub, execução local ou em nuvem, evidências para a Arquitetura). O PDF da disciplina serve só como **orientação de estudo**, não como lista de entrega obrigatória, salvo se o professor disser o contrário.

## 1. O que você precisa instalado

- **Docker Desktop** (Windows) com o engine rodando.  
- *(Opcional, ordem da turma: antes pode instalar a **Azure CLI** via MSI da Microsoft — é para outras aulas; para só subir este projeto basta o Docker.)*

## 2. Subir os dois containers

Na pasta do projeto:

```powershell
docker compose up -d --build
```

Isso sobe **app** + **Postgres** na rede **`dimdim-net`**, usando imagens base do **Docker Hub** (`postgres:16-alpine` e build com `node:20-alpine`).

- Teste no navegador: `http://localhost:3000` ou `http://localhost:3000/health`  
- A API mostra que o **banco responde** (prova de que os containers **interagem** na rede).

Parar:

```powershell
docker compose down
```

## 3. Evidências (o que o enunciado pede explicitamente)

Rode:

```powershell
.\coletar-evidencias.ps1
```

Será criada a pasta **`evidencias/`** com saídas de `docker ps`, `docker compose`, rede, etc. Use isso (e prints extras se quiser) para **“colher as evidências”** para a equipe de Arquitetura e anexar no AVA conforme o professor pedir.

## 4. CRUD (extra)

A API tem rotas **`/api/produtos`** (GET/POST/PUT/DELETE) para você **demonstrar** interação com o banco, se quiser mostrar algo além do `/health`. Não faz parte do texto mínimo do AVA; é só recurso do projeto.

## 5. Nuvem (opcional)

O mesmo `docker-compose.yml` pode ser usado em uma VM Linux na nuvem com Docker instalado; abra a porta **3000** no firewall/security group se for acessar de fora.
