import { serve } from "bun";
import index from "./index.html";
import { createDatabase, getDatabase, seedDatabase } from "./db";

interface LeituraSensor {
    sensorId: number;
    type: string;
    value: number | boolean;
    timestamp: string;

}

const db = getDatabase();
createDatabase(db);
seedDatabase(db);

const server = serve({
  port: 8080,
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
    "/api/sensor": {
      GET() {
        const sensores = db.prepare(`
            SELECT id, name, type, unit
            FROM sensores
          `).all()
        return Response.json(
         sensores
        );
      },
    },
    "/api/sensor/data": {
      POST: async req => {
        const body = await req.json();
        const leitura: LeituraSensor = body
        const salvarLeitura = db.prepare(`
          INSERT INTO leituras_sensor
            (sensor_id, value, timestamp)
          VALUES (?, ?, ?)
        `);

        salvarLeitura.run(leitura.sensorId, Number(leitura.value), leitura.timestamp);
        return Response.json({ created: true, ...body });
    }},
   "/api/sensor/data/:id": {
      GET: async req => {
        const id = req.params.id;
        const data = db.prepare(`
            SELECT id, value, timestamp
            FROM leituras_sensor
            WHERE sensor_id = ?
            ORDER BY timestamp DESC
            LIMIT 100
          `).all(id);
        return Response.json(data);
      }
   }
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`Servidor rodando em: ${server.url}`);
