# Servidor dashboard web e API

## Rotas:

1. GET '/': dashboard
2. GET '/api/sensor': retorna todos os sensores disponíveis
3. GET '/api/sensor/data/:id': retorna as últimas 100 leituras de um sensor
4. POST '/api/sensor/data/': armazena uma leitura de sensor na DB

## Dependências:

O projeto foi feito usando bun[https://bun.com/], é necessário instalá-lo para executar.

Com bun instalado, execute:

```bash
bun install
```

para instalar os pacotes do projeto;

```bash
bun start
```

para iniciar o servidor na porta 8080;

*OBS: aqui roda apenas a API e o dashboard, o simulador de sensores deve ser executado em seu diretório.

This project was created using `bun init` in bun v1.4.5. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.