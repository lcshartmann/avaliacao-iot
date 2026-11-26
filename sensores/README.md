# Simulador de sensores

## Funcionamento:

A partir de um valor base, são aplicadas variações nos valores usando Math.random() e as leituras são enviadas para a API em http://127.0.0.1:8080/api/sensor/data a cada 5s. São enviadas leituras dos sensores de temperatura, umidade, luminosidade e movimento.

## Dependências:

O projeto foi feito usando [bun](https://bun.com/), é necessário instalá-lo para executar.

Com bun instalado, execute:

```bash
bun install
```

para instalar os pacotes do projeto;

```bash
bun run index.ts
```

para iniciar o serviço;

This project was created using `bun init` in bun v1.4.5. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
