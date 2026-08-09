# Frontend

Aplicacao React/Vite da calculadora.
Ela consome a API do backend Go em vez de executar os calculos localmente.

Veja tambem a documentacao principal em
[`docs/documentacao-do-projeto.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/documentacao-do-projeto.md).

## Responsabilidades

- exibir o teclado, display e historico
- montar requisicoes para a API
- tratar erros de rede e respostas invalidas
- manter a interface limpa e previsivel

## Estrutura principal

- `src/App.tsx` concentra o fluxo da calculadora
- `src/services/calculatorApi.ts` centraliza a comunicacao com o backend
- `src/lib/number.ts` cuida de parse e limpeza de numeros
- `src/utils/` guarda helpers reutilizaveis
- `src/components/` contem a interface visual

## Como rodar

```bash
npm install
npm start
```

## Variavel de ambiente

- `VITE_API_BASE_URL` permite apontar o frontend para outra API

## Testes

```bash
npm test
npm run lint
npm run build
```

## Coverage

```bash
npm run coverage
```

Isso gera o relatório de cobertura do frontend em `frontend/coverage/`.

## Docker

O frontend tambem pode ser executado com `docker compose up --build` na raiz do repositorio.
Nesse caso a aplicacao fica exposta em `http://localhost:3000`.
