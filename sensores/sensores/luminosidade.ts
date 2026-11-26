
import type { LeituraSensor } from '../index.ts'

export default function lerLuminosidade(ultimaLuminosidade: number): LeituraSensor {
    const SENSOR_ID = 3;
    const SENSOR_TYPE = 'luminosity';
    const VARIACAO = (Math.random() - 0.5) * 4000;
    const LUMINOSIDADE = Math.max(0, ultimaLuminosidade + VARIACAO).toFixed(2); // Garante valores +0;
    
    return {
        sensorId: SENSOR_ID,
        type: SENSOR_TYPE,
        value: Number(LUMINOSIDADE),
        timestamp: new Date().toISOString()
    }
}