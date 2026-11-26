import lerTemperatura from "./sensores/temperatura";
import lerLuminosidade from "./sensores/luminosidade";
import lerMovimento from "./sensores/movimento";
import lerUmidade from "./sensores/umidade";

export interface LeituraSensor {
    sensorId: number;
    type: string;
    value: number | boolean;
    timestamp: string;

}

const TEMPERATURA_INICIAL = 25;
const UMIDADE_INICIAL = 60;
const LUMINOSIDADE_INICIAL = 30000;
const URL_API = 'http://127.0.0.1:8080/api/sensor/data'
const INTERVALO_MS = 5000;

async function enviarLeitura(leitura: LeituraSensor, descricao: string) {
    try {
        const res = await fetch(URL_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(leitura)
        });
        if (!res.ok) {
            console.error(`Falha ao enviar leitura de ${descricao}: HTTP ${res.status}`);
            return;
        }
        console.log(`Leitura ${descricao}: ${leitura.value}`);
    } catch (err) {
        console.error(`Falha de comunicação ao enviar leitura de ${descricao}:`, err);
    }
}

function main() {
    let temp_atual = TEMPERATURA_INICIAL;
    let umidade_atual = UMIDADE_INICIAL;
    let luminosidade_atual = LUMINOSIDADE_INICIAL;

    console.log("======== iniciando simulador de sensores ========");
    console.log(`Enviando leituras a cada ${INTERVALO_MS / 1000}s para ${URL_API}`);

    const intervalId = setInterval(async () => {
        const leitura_temp = lerTemperatura(temp_atual);
        temp_atual = Number(leitura_temp.value);
        await enviarLeitura(leitura_temp, `temperatura (${temp_atual}°C)`);

        const leitura_umidade = lerUmidade(umidade_atual);
        umidade_atual = Number(leitura_umidade.value);
        await enviarLeitura(leitura_umidade, `umidade (${umidade_atual}%)`);

        const leitura_luminosidade = lerLuminosidade(luminosidade_atual);
        luminosidade_atual = Number(leitura_luminosidade.value);
        await enviarLeitura(leitura_luminosidade, `luminosidade (${luminosidade_atual} lux)`);

        const leitura_movimento = lerMovimento();
        await enviarLeitura(leitura_movimento, `movimento (${leitura_movimento.value})`);

        console.log("================================================");
    }, INTERVALO_MS);
}

main();
