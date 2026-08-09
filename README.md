# Calculadora

Aplicação full-stack de calculadora com frontend em React + TypeScript e backend em Go.

O backend é a fonte de verdade dos cálculos. O frontend cuida da interface, do histórico local, da memória e das preferências de idioma/casas decimais.

Documentação principal:

- [`docs/doc-tech.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/doc-tech.md)
- [`docs/documentacao-do-projeto.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/documentacao-do-projeto.md)
- [`docs/objective.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/objective.md)

## Estrutura do projeto

- `frontend/` aplicação React/Vite
- `backend/` microservice em Go
- `docs/` objetivos, escopo e documentação técnica
- `docker-compose.yml` orquestração local dos dois serviços
- `package.json` scripts de conveniência na raiz

## Requisitos

- Node.js 22+
- npm
- Go 1.22+ se você for rodar o backend sem Docker
- Docker e Docker Compose se quiser subir tudo com um comando

## Setup

Instale as dependências do frontend:

```bash
cd frontend
npm install
```

Se você for rodar o backend localmente sem Docker, basta ter Go 1.22+ disponível. Não há dependências adicionais além do módulo Go padrão do projeto.

## Como rodar o frontend

Em um terminal:

```bash
cd frontend
npm start
```

Ou pela raiz, depois que as dependências do frontend estiverem instaladas:

```bash
npm start
```

Observações:

- o `npm start` da raiz apenas repassa a execução para `frontend/`
- o frontend espera o backend em `http://localhost:8080` por padrão
- se você mudar a API, ajuste `VITE_API_BASE_URL`

## Como rodar o backend

Em outro terminal:

```bash
cd backend
go run ./cmd/api
```

Variáveis de ambiente úteis:

- `ADDR` define o endereço completo, por exemplo `:8080`
- `PORT` permite informar só a porta
- `CORS_ORIGIN` controla a origem permitida no CORS

Endpoints disponíveis:

- `GET /health`
- `POST /api/calculate`

## Como rodar com Docker

```bash
docker compose up --build
```

Depois disso:

- frontend: `http://localhost:3000`
- backend: `http://localhost:8080`
- healthcheck: `http://localhost:8080/health`

## API examples

### Healthcheck

```bash
curl http://localhost:8080/health
```

Resposta:

```json
{
  "status": "ok",
  "service": "calculator-api"
}
```

### Soma

```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"add","left":10,"right":5}'
```

Resposta:

```json
{
  "result": 15
}
```

### Raiz quadrada

```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"sqrt","value":9}'
```

Resposta:

```json
{
  "result": 3
}
```

### Porcentagem

```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"percentage","value":25}'
```

Resposta:

```json
{
  "result": 0.25
}
```

### Erro

```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"divide","left":10,"right":0}'
```

Resposta possível:

```json
{
  "error": "division by zero"
}
```

## Testes

Frontend:

```bash
cd frontend
npm test
```

Backend:

```bash
cd backend
go test ./...
```

Raiz do repositório:

```bash
npm test
```

Esse comando roda os testes do frontend e valida o backend durante o build do Docker.

## Coverage

```bash
npm run coverage
```

Isso gera:

- coverage do frontend com Vitest em `frontend/coverage/`
- coverage do backend em `backend/coverage.out` e `backend/coverage.html`

## Decisões de design

- o backend é a fonte de verdade para os cálculos
- o frontend não faz o cálculo final localmente
- as operações são explícitas na API, em vez de um parser genérico de expressões
- o histórico e a memória são estados locais da interface
- as preferências de idioma e casas decimais ficam em `localStorage`
- o idioma padrão é inglês e `pt-br` é uma opção disponível
- o deploy local com Docker usa imagens separadas para frontend e backend
- o backend roda em uma imagem final pequena e como usuário não-root

## Assunções

- o usuário final vai subir o backend antes de usar o frontend fora do Docker
- `http://localhost:8080` é a URL padrão da API
- `http://localhost:3000` é a URL padrão do frontend em Docker Compose
- memória e histórico não precisam persistir entre recargas da página
- o foco da aplicação é previsibilidade e manutenção, não um parser matemático avançado

## Documentação adicional

- [`docs/scope.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/scope.md)
- [`docs/guia-do-projeto.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/guia-do-projeto.md)
- [`docs/docker.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/docker.md)
