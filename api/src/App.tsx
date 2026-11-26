import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./index.css";

interface Sensor {
  id: number;
  name: string;
  type: string;
  unit: string;
}

interface Leitura {
  id: number;
  value: number;
  timestamp: string;
}

const SERIES_COLOR = "#3987e5";
const ACTIVE_COLOR = "#0ca30c";
const INACTIVE_COLOR = "#898781";
const POLL_INTERVAL_MS = 5000;

function formatBoolean(value: number) {
  return value ? "Ativo" : "Inativo";
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatTimeShort(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function SensorChart({ sensor }: { sensor: Sensor }) {
  const [readings, setReadings] = useState<Leitura[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch(`/api/sensor/data/${sensor.id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Leitura[] = await res.json();
        if (!cancelled) {
          setReadings([...data].reverse());
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erro ao buscar dados");
        }
      }
    }

    fetchData();
    const id = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [sensor.id]);

  const latest = readings[readings.length - 1];
  const isBoolean = sensor.type === "motion";
  const latestActive = isBoolean && !!latest && latest.value !== 0;

  return (
    <div className="bg-[#1a1a19] border border-white/10 rounded-xl p-4 text-left">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="text-lg font-semibold text-white">{sensor.name}</h2>
        <span className="text-xs text-[#c3c2b7] uppercase tracking-wide">
          {sensor.type}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        {isBoolean ? (
          <span
            className="inline-flex items-center gap-2 text-lg font-bold"
            style={{ color: latest ? (latestActive ? ACTIVE_COLOR : INACTIVE_COLOR) : "#ffffff" }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: latest ? (latestActive ? ACTIVE_COLOR : INACTIVE_COLOR) : "#898781",
              }}
            />
            {latest ? formatBoolean(latest.value) : "--"}
          </span>
        ) : (
          <>
            <span className="text-3xl font-bold text-white">
              {latest ? formatNumber(latest.value) : "--"}
            </span>
            <span className="text-sm text-[#c3c2b7]">{sensor.unit}</span>
          </>
        )}
        {latest && (
          <span className="text-xs text-[#898781] ml-auto">
            {formatTimestamp(latest.timestamp)}
          </span>
        )}
      </div>

      {error ? (
        <p className="text-sm text-[#e34948]">{error}</p>
      ) : readings.length === 0 ? (
        <p className="text-sm text-[#898781]">Carregando dados...</p>
      ) : isBoolean ? (
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={readings} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#2c2c2a" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTimeShort}
              stroke="#898781"
              tick={{ fill: "#898781", fontSize: 11 }}
              minTickGap={24}
            />
            <YAxis
              stroke="#898781"
              tick={{ fill: "#898781", fontSize: 11 }}
              width={60}
              domain={[0, 1]}
              ticks={[0, 1]}
              tickFormatter={(value) => formatBoolean(value)}
            />
            <Tooltip
              formatter={(value) => [formatBoolean(Number(value)), sensor.name]}
              labelFormatter={(label) => formatTimestamp(String(label))}
              contentStyle={{
                background: "#1a1a19",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "#ffffff",
              }}
              labelStyle={{ color: "#c3c2b7" }}
            />
            <Line
              type="stepAfter"
              dataKey="value"
              stroke={ACTIVE_COLOR}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={readings} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#2c2c2a" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTimeShort}
              stroke="#898781"
              tick={{ fill: "#898781", fontSize: 11 }}
              minTickGap={24}
            />
            <YAxis
              stroke="#898781"
              tick={{ fill: "#898781", fontSize: 11 }}
              width={56}
              tickFormatter={(value) => formatNumber(Number(value))}
            />
            <Tooltip
              formatter={(value) => [`${formatNumber(Number(value))} ${sensor.unit}`, sensor.name]}
              labelFormatter={(label) => formatTimestamp(String(label))}
              contentStyle={{
                background: "#1a1a19",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "#ffffff",
              }}
              labelStyle={{ color: "#c3c2b7" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={SERIES_COLOR}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {readings.length > 0 && (
        <div className="thin-scroll mt-3 max-h-28 overflow-y-auto rounded-md border border-white/10">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#1a1a19]">
              <tr className="text-left text-[#898781] border-b border-white/10">
                <th className="py-1.5 px-3 font-normal">Timestamp</th>
                <th className="py-1.5 px-3 font-normal">Valor</th>
              </tr>
            </thead>
            <tbody>
              {[...readings]
                .reverse()
                .slice(0, 20)
                .map((reading) => (
                  <tr key={reading.id} className="border-b border-white/5 last:border-0">
                    <td className="py-1 px-3 text-[#c3c2b7]">
                      {formatTimestamp(reading.timestamp)}
                    </td>
                    <td className="py-1 px-3 text-white">
                      {isBoolean
                        ? formatBoolean(reading.value)
                        : `${formatNumber(reading.value)} ${sensor.unit}`}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function App() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSensors() {
      try {
        const res = await fetch("/api/sensor");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setSensors(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao buscar sensores");
      }
    }
    fetchSensors();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto p-5 relative z-10">
      <h1 className="text-xl font-bold mb-3 text-white">Monitoramento de Sensores</h1>

      {error && <p className="text-[#e34948] mb-3">{error}</p>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {sensors.map((sensor) => (
          <SensorChart key={sensor.id} sensor={sensor} />
        ))}
      </div>
    </div>
  );
}

export default App;
