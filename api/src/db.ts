import { Database } from "bun:sqlite";

const db = new Database("iot.db");

export function createDatabase(db: Database){
    db.run(`
    CREATE TABLE IF NOT EXISTS sensores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT UNIQUE NOT NULL,
        unit TEXT NOT NULL
    )
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS leituras_sensor (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sensor_id INTEGER NOT NULL,
        value REAL NOT NULL,
        timestamp TEXT NOT NULL,

        FOREIGN KEY (sensor_id)
        REFERENCES sensores(id)
        ON DELETE CASCADE
    )
    `);

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp
        ON leituras_sensor(timestamp);
    `)
}

export function seedDatabase(db: Database) {
  const insertSensor = db.prepare(`
    INSERT OR IGNORE INTO sensores (name, type, unit)
    VALUES (?, ?, ?)
  `);

  const sensors = [
    ["Sensor de temperatura", "temperature", "°C"],
    ["Sensor de umidade", "humidity", "%"],
    ["Sensor de luminosidade", "luminosity", "lux"],
    ["Sensor de movimento", "motion", "ativo"]
  ];

  const seed = db.transaction(() => {
    for (const sensor of sensors) {
      insertSensor.run(...sensor);
    }
  });

  seed();
}

export function getDatabase(): Database{
    return db;
}