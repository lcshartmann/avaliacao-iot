
import type { LeituraSensor } from '../index.ts'

export default function lerMovimento(): LeituraSensor {
    const SENSOR_ID = 4;
    const SENSOR_TYPE = 'motion';
    const TEM_MOVIMENTO = Math.random() < 0.5;
    
    return {
        sensorId: SENSOR_ID,
        type: SENSOR_TYPE,
        value: TEM_MOVIMENTO,
        timestamp: new Date().toISOString()
    }
}