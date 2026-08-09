# Backend

Microservice em Go responsavel pelos calculos da aplicacao.

Veja tambem a documentacao principal em
[`docs/doc-tech.md`](../docs/doc-tech.md).

## Intencao da estrutura

- `cmd/api` para o ponto de entrada da aplicacao
- `internal/calculator` para as regras de negocio
- `internal/http` para handlers, rotas e transporte
- `internal/validation` para validacao de payloads
- `tests` para testes de integracao e contrato

## Responsabilidade

O backend é a fonte de verdade para os cálculos expostos pela API.
O frontend consome essa API e não contém a lógica final de cálculo.

## Como rodar

```bash
go run ./cmd/api
```

Variaveis de ambiente uteis:

- `ADDR` para definir o endereco completo, por exemplo `:8080`
- `PORT` como alternativa quando voce quiser passar apenas a porta
- `CORS_ORIGIN` para restringir o `Access-Control-Allow-Origin`

## Docker

O backend tambem pode ser executado via `docker compose up --build` a partir da raiz do repositorio.
O build da imagem executa `go test ./...` antes de compilar a API.

## Testes

```bash
go test ./...
```

## Coverage

Na raiz do repositório:

```bash
npm run coverage:backend
```

Isso executa os testes do backend dentro de um container Go e gera `coverage.out` e `coverage.html` em `backend/`.

## Endpoints

- `GET /health`
- `POST /api/calculate`
