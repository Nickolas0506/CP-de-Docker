import http from "http";
import pg from "pg";

const aluno = "Nickolas Davi";
const rm = "564105";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 8000,
});

const port = Number(process.env.PORT) || 3000;

async function esperarBanco() {
  for (let i = 0; i < 25; i++) {
    try {
      await pool.query("select 1");
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error("postgres indisponivel");
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "GET" || (req.url !== "/" && req.url !== "/health")) {
    res.writeHead(404);
    res.end(JSON.stringify({ erro: "not found" }));
    return;
  }

  try {
    const q = await pool.query(
      "select now() as horario, current_database() as nome_banco"
    );
    res.writeHead(200);
    res.end(
      JSON.stringify(
        {
          msg: "DimDim - app e postgres na rede docker",
          aluno,
          rm,
          teste_no_banco: q.rows[0],
        },
        null,
        2
      )
    );
  } catch (e) {
    res.writeHead(500);
    res.end(JSON.stringify({ erro: String(e.message) }));
  }
});

async function main() {
  if (!process.env.DATABASE_URL) {
    process.exit(1);
  }
  await esperarBanco();
  server.listen(port, "0.0.0.0");
}

main().catch(() => process.exit(1));
