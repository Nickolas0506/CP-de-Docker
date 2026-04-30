import http from "http";
import { URL } from "url";
import pg from "pg";

const ALUNO = { nome: "Nickolas Davi", rm: "564105" };

const { Pool } = pg;
const port = Number(process.env.PORT) || 3000;
const databaseUrl = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 5000,
});

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS produtos (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(200) NOT NULL,
      descricao TEXT,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

async function withRetry(fn, attempts = 30, delayMs = 2000) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      console.warn(`Tentativa ${i + 1}/${attempts}:`, e.message);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

function json(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj, null, 2));
}

const server = http.createServer(async (req, res) => {
  const host = req.headers.host || "localhost";
  let pathname;
  try {
    pathname = new URL(req.url || "/", `http://${host}`).pathname;
  } catch {
    json(res, 400, { ok: false, erro: "URL inválida" });
    return;
  }

  try {
    if (req.method === "GET" && (pathname === "/health" || pathname === "/")) {
      const r = await pool.query("SELECT NOW() AS agora, current_database() AS banco");
      const n = await pool.query("SELECT COUNT(*)::int AS total FROM produtos");
      json(res, 200, {
        ok: true,
        aluno: ALUNO,
        desafio: "App + Postgres na rede dimdim-net; CRUD em /api/produtos",
        banco: r.rows[0],
        produtos: n.rows[0],
      });
      return;
    }

    if (pathname === "/api/produtos" && req.method === "GET") {
      const { rows } = await pool.query(
        "SELECT id, nome, descricao, criado_em, atualizado_em FROM produtos ORDER BY id"
      );
      json(res, 200, { ok: true, dados: rows });
      return;
    }

    const one = /^\/api\/produtos\/(\d+)$/.exec(pathname);
    if (one && req.method === "GET") {
      const id = Number(one[1]);
      const { rows } = await pool.query(
        "SELECT id, nome, descricao, criado_em, atualizado_em FROM produtos WHERE id = $1",
        [id]
      );
      if (!rows.length) {
        json(res, 404, { ok: false, erro: "Não encontrado" });
        return;
      }
      json(res, 200, { ok: true, dados: rows[0] });
      return;
    }

    if (pathname === "/api/produtos" && req.method === "POST") {
      const body = await parseBody(req);
      const nome = (body.nome || "").trim();
      if (!nome) {
        json(res, 400, { ok: false, erro: "nome obrigatório" });
        return;
      }
      const descricao = body.descricao != null ? String(body.descricao) : null;
      const { rows } = await pool.query(
        `INSERT INTO produtos (nome, descricao) VALUES ($1, $2)
         RETURNING id, nome, descricao, criado_em, atualizado_em`,
        [nome, descricao]
      );
      json(res, 201, { ok: true, dados: rows[0] });
      return;
    }

    if (one && req.method === "PUT") {
      const id = Number(one[1]);
      const body = await parseBody(req);
      const nome = (body.nome || "").trim();
      if (!nome) {
        json(res, 400, { ok: false, erro: "nome obrigatório" });
        return;
      }
      const descricao = body.descricao != null ? String(body.descricao) : null;
      const { rows } = await pool.query(
        `UPDATE produtos SET nome = $1, descricao = $2, atualizado_em = NOW()
         WHERE id = $3 RETURNING id, nome, descricao, criado_em, atualizado_em`,
        [nome, descricao, id]
      );
      if (!rows.length) {
        json(res, 404, { ok: false, erro: "Não encontrado" });
        return;
      }
      json(res, 200, { ok: true, dados: rows[0] });
      return;
    }

    if (one && req.method === "DELETE") {
      const id = Number(one[1]);
      const del = await pool.query("DELETE FROM produtos WHERE id = $1 RETURNING id", [id]);
      if (!del.rowCount) {
        json(res, 404, { ok: false, erro: "Não encontrado" });
        return;
      }
      json(res, 200, { ok: true, removido_id: id });
      return;
    }

    json(res, 404, { ok: false, erro: "não encontrado" });
  } catch (e) {
    console.error(e);
    json(res, 500, { ok: false, erro: String(e.message) });
  }
});

async function main() {
  if (!databaseUrl) {
    console.error("DATABASE_URL não definido");
    process.exit(1);
  }
  await withRetry(async () => {
    await pool.query("SELECT 1");
    await ensureSchema();
  });
  console.log(`Nickolas Davi (RM ${ALUNO.rm}) — API com CRUD pronta.`);

  server.listen(port, "0.0.0.0", () => {
    console.log(`http://0.0.0.0:${port}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
