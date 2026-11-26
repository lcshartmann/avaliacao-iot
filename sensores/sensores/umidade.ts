
import type { LeituraSensor } from '../index.ts'

export default function lerUmidade(ultimaUmidade: number): LeituraSensor {
    const SENSOR_ID = 2;
    const SENSOR_TYPE = 'humidity';
    const VARIACAO = (Math.random() - 0.5) * 6;
    const UMIDADE = Math.max(0, Math.min(100, ultimaUmidade + VARIACAO)).toFixed(2); // Garante valores de 0-100%

    return {
        sensorId: SENSOR_ID,
        type: SENSOR_TYPE,
        value: Number(UMIDADE),
        timestamp: new Date().toISOString()
    }
}