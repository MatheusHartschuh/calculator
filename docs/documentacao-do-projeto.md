# Documentacao do Projeto

## Resumo

Este projeto e uma calculadora full-stack com:

- frontend em React + TypeScript + Vite
- backend em Go
- API HTTP/JSON como contrato entre as camadas

A decisao central foi manter o backend como fonte de verdade para os calculos.
O frontend cuida da interface, do estado visual e da comunicacao com a API.

## Objetivo do sistema

O produto final deve ser:

- limpo
- facil de entender
- idiomatico nas duas linguagens
- testavel
- simples de subir localmente

## Estrutura do repositorio

- `frontend/` -> aplicacao React/Vite
- `backend/` -> microservico em Go
- `docs/` -> escopo, guias e documentacao tecnica
- `docker-compose.yml` -> sobe frontend e backend juntos

## Arquitetura

### Frontend

Responsabilidades do frontend:

- renderizar display, keypad e historico
- capturar entrada do teclado e cliques
- montar requests para a API
- tratar erros de rede e respostas invalidas
- manter apenas estado de interface

Arquivos principais:

- [`frontend/src/App.tsx`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/App.tsx)
- [`frontend/src/services/calculatorApi.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/services/calculatorApi.ts)
- [`frontend/src/lib/number.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/lib/number.ts)

### Backend

Responsabilidades do backend:

- receber e validar requests HTTP
- executar os calculos
- tratar edge cases
- responder em JSON
- ser a fonte de verdade para as operacoes

Arquivos principais:

- [`backend/cmd/api/main.go`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/cmd/api/main.go)
- [`backend/internal/http/server.go`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/internal/http/server.go)
- [`backend/internal/calculator/service.go`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/internal/calculator/service.go)
- [`backend/internal/validation/request.go`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/internal/validation/request.go)

## Decisoes de arquitetura

- evitar calculo local no frontend
- usar requests explicitas em vez de parser generico de expressao
- centralizar regra de negocio no backend
- manter o frontend como uma camada fina de UX
- testar helpers puros no frontend e regras/handlers no backend
- usar Docker para padronizar execucao local

## Operacoes suportadas

O backend suporta:

- `add`
- `subtract`
- `multiply`
- `divide`
- `power`
- `sqrt`
- `percentage`

O frontend expoe essas operacoes na interface atual.

## Contrato da API

### Healthcheck

`GET /health`

Exemplo de response:

```json
{
  "status": "ok",
  "service": "calculator-api"
}
```

### Calculo binario

`POST /api/calculate`

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

Outro exemplo:

```json
{
  "operation": "divide",
  "left": 10,
  "right": 2
}
```

Response:

```json
{
  "result": 5
}
```

### Calculo unario

`POST /api/calculate`

Exemplo para raiz quadrada:

```json
{
  "operation": "sqrt",
  "value": 9
}
```

Response:

```json
{
  "result": 3
}
```

Exemplo para porcentagem:

```json
{
  "operation": "percentage",
  "value": 25
}
```

Response:

```json
{
  "result": 0.25
}
```

### Erros

Exemplos de erro:

```json
{
  "error": "division by zero"
}
```

```json
{
  "error": "value is required for this operation"
}
```

```json
{
  "error": "invalid JSON payload: unexpected EOF"
}
```

## Setup local

### Requisitos

- Node.js 22+
- npm
- Go 1.22+
- Docker e Docker Compose, se quiser subir tudo com um comando

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
go test ./...
```

Se quiser apenas rodar a API:

```bash
go run ./cmd/api
```

## Execucao

### Rodar frontend sozinho

```bash
npm start
```

Na raiz, esse comando repassa para `frontend/`.

### Rodar backend sozinho

```bash
cd backend
go run ./cmd/api
```

### Rodar tudo com Docker

```bash
docker compose up --build
```

Depois disso:

- frontend em `http://localhost:3000`
- backend em `http://localhost:8080`
- healthcheck em `http://localhost:8080/health`

## Variaveis de ambiente

### Backend

- `ADDR` define o endereco completo de escuta
- `PORT` pode ser usado como atalho para a porta
- `CORS_ORIGIN` define a origem permitida no navegador

### Frontend

- `VITE_API_BASE_URL` aponta o frontend para outra API no build ou no ambiente local

## Testes

### Frontend

```bash
npm test
npm run lint
npm run build
```

### Backend

```bash
cd backend
go test ./...
```

### Raiz do repositorio

```bash
npm test
```

Esse comando executa a suite do frontend e valida o backend via build Docker.

### Coverage

```bash
npm run coverage
```

O frontend gera relatório HTML/texto com Vitest e o backend gera `coverage.out` e `coverage.html` via Docker.

## Racional de design

- o frontend nao implementa mais a regra final de calculo
- o backend valida payloads antes de executar qualquer operacao
- o contrato e explicito e pequeno, o que reduz ambiguidade
- as mensagens de erro sao previsiveis e mais faceis de testar
- a separacao em pastas melhora manutencao e escalabilidade

## Historico da evolucao

- o projeto saiu de uma calculadora local monolitica
- o frontend foi refeito para consumir a API
- o backend passou a centralizar regras e validacoes
- os testes foram distribuidos entre unitarios, contrato e integracao leve
- o ambiente Docker foi adicionado para reduzir atrito de setup

## Referencias uteis

- [`docs/scope.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/scope.md)
- [`docs/guia-do-projeto.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/guia-do-projeto.md)
- [`docs/docker.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/docker.md)
