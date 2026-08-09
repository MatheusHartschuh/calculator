# Documentacao do projeto Calculadora

> Este guia complementa a documentacao principal em
> [`docs/documentacao-do-projeto.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/documentacao-do-projeto.md).

## Visao geral

Este projeto e uma calculadora full-stack com:

- frontend em **React + TypeScript + Vite**
- backend em **Go**
- calculos executados pelo backend via **API REST**

A ideia principal e manter o frontend simples, com foco em interface e interacao, enquanto o backend concentra a regra de negocio e a validacao dos calculos.

## O que esta em escopo

### Frontend

- display da calculadora
- teclado numerico e de operacoes
- entrada por teclado fisico
- historico local dos calculos bem-sucedidos
- consumo da API do backend
- tratamento visual de erro

### Backend

- endpoint de saude
- endpoint de calculo
- validacao de payload
- tratamento de erros como divisao por zero e raiz negativa
- resposta JSON padronizada

## O que foi removido da versao atual

Para manter o projeto mais limpo e alinhado com o objetivo full-stack, o frontend nao inclui mais:

- memoria da calculadora
- modais de funcoes trigonometrica
- configuracoes de casas decimais
- avaliacao local de expressoes complexas

Esses recursos foram eliminados para evitar duplicacao de logica entre frontend e backend.

## Tecnologias usadas

- **React 19** para a interface
- **TypeScript** para tipagem
- **Vite** como bundler e servidor de desenvolvimento
- **Go** para o backend
- **styled-components** e tema local para o visual

## Arquitetura

### Frontend

O frontend fica em `frontend/` e responde por:

- capturar a entrada do usuario
- montar o estado da calculadora
- chamar a API para executar o calculo
- exibir o resultado e o historico

### Backend

O backend fica em `backend/` e e a fonte de verdade para as operacoes matematicas.

### Contrato

O contrato entre as camadas e simples:

- request e response em JSON
- operacoes explicitas
- tratamento previsivel de erros

## Fluxo da aplicacao

O fluxo de uma conta e este:

1. O usuario digita um numero ou escolhe uma operacao.
2. O frontend guarda o estado atual da entrada.
3. Quando ha uma operacao a ser resolvida, o frontend chama a API.
4. O backend valida o payload e executa a operacao.
5. O frontend recebe o resultado e atualiza o display.
6. Se a conta for valida, o historico local registra o calculo.

## Operacoes suportadas

### No backend

- adicao
- subtracao
- multiplicacao
- divisao
- potencia
- raiz quadrada
- porcentagem

### No frontend

O teclado atualmente expoe:

- `+`
- `-`
- `*`
- `/`
- `^`
- `x²`
- `√`
- `%`

## Estrutura de pastas

### `frontend/src/components`

- `Display`
  - mostra o valor atual e captura teclado fisico
- `Keypad`
  - renderiza os botoes da calculadora
- `Button`
  - botao reutilizavel com estilos e tooltip
- `HistoryPanel`
  - mostra os ultimos calculos bem-sucedidos

### `frontend/src/services`

- `calculatorApi.ts`
  - faz as chamadas HTTP para o backend

### `frontend/src/lib`

- `number.ts`
  - limpeza e parse de numeros para exibicao e entrada

### `frontend/src/utils`

- `keyUtils.ts`
  - normalizacao de teclas e manipulação da entrada
- `helper.ts`
  - formatação visual de numeros no display
- `tooltipText.ts`
  - textos de ajuda dos botoes

### `backend/internal`

- `domain`
  - contratos de request/response
- `calculator`
  - regras matematicas
- `validation`
  - validacao de entrada
- `http`
  - handlers, rotas e CORS

## Componentes e arquivos principais

- [`frontend/src/App.tsx`](../frontend/src/App.tsx)
  - coordena o estado do frontend e orquestra as chamadas de API
- [`frontend/src/services/calculatorApi.ts`](../frontend/src/services/calculatorApi.ts)
  - encapsula `fetch` e o tratamento de erro da API
- [`frontend/src/lib/number.ts`](../frontend/src/lib/number.ts)
  - limpa e interpreta valores numericos
- [`backend/cmd/api/main.go`](../backend/cmd/api/main.go)
  - inicia o servidor Go
- [`backend/internal/http/server.go`](../backend/internal/http/server.go)
  - expõe os endpoints REST
- [`backend/internal/calculator/service.go`](../backend/internal/calculator/service.go)
  - executa os calculos

## Como o frontend lida com a entrada

O frontend aceita:

- cliques nos botoes
- teclado fisico

A entrada passa por normalizacao:

- `Enter` vira `=`
- `Backspace` vira `C`
- `Escape` vira `AC`
- `.` vira `,`
- `x2` e `x^2` viram `x²`
- `sqrt` vira `√`

## Formato visual

Para exibir numeros, o frontend usa:

- separador de milhares: `.`
- separador decimal: `,`

Exemplo:

- valor interno: `12345.67`
- valor exibido: `12.345,67`

## API do backend

### `GET /health`

Resposta esperada:

```json
{
  "status": "ok",
  "service": "calculator-api"
}
```

### `POST /api/calculate`

Exemplo de request:

```json
{
  "operation": "add",
  "left": 10,
  "right": 5
}
```

Exemplo de response:

```json
{
  "result": 15
}
```

Exemplo de erro:

```json
{
  "error": "division by zero"
}
```

## Como rodar

### Frontend

```bash
cd frontend
npm install
npm start
```

Ou pela raiz:

```bash
npm start
```

### Backend

```bash
cd backend
go run ./cmd/api
```

### Testes do frontend

```bash
cd frontend
npm test
```

### Testes do backend

```bash
cd backend
go test ./...
```

### Coverage

```bash
npm run coverage
```

Esse comando gera cobertura no frontend com Vitest e no backend com `go test -coverprofile` via Docker.

### Docker

```bash
docker compose up --build
```

Isso sobe a API em `http://localhost:8080` e o frontend em `http://localhost:3000`.
Durante o build, as imagens executam `go test ./...` no backend e `npm test` + `npm run build` no frontend.

## Design rationale

As principais decisoes foram:

- manter a regra de negocio no backend
- evitar calculo local duplicado
- usar requests explicitas para cada operacao
- manter o frontend como uma camada de interface e orquestracao
- testar helpers puros no frontend e regras/handlers no backend
- usar Docker para padronizar a execucao local e reduzir atrito de setup

## Observacoes

- O frontend usa `VITE_API_BASE_URL` se voce quiser apontar para outro backend.
- O backend responde em JSON e ja inclui CORS para o frontend conversar com ele no navegador.
