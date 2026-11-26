
import type { LeituraSensor } from '../index.ts'

export default function lerTemperatura(ultimaTemperatura: number): LeituraSensor {
    const SENSOR_ID = 1;
    const SENSOR_TYPE = 'temperature';
    const VARIACAO = (Math.random() - 0.5) * 3;

    return {
        sensorId: SENSOR_ID,
        type: SENSOR_TYPE,
        value: Number((ultimaTemperatura + VARIACAO).toFixed(2)),
        timestamp: new Date().toISOString()
    }
}