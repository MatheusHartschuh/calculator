# Docker

Este projeto pode ser executado com Docker em dois servicos separados:

- `backend` roda a API em Go
- `frontend` gera a aplicacao React/Vite e a serve com Nginx

## Subir tudo

```bash
docker compose up --build
```

Depois disso:

- frontend: `http://localhost:3000`
- backend: `http://localhost:8080`
- healthcheck: `http://localhost:8080/health`

## O que cada imagem faz

- a imagem do backend executa `go test ./...` durante o build e depois compila a API
- a imagem do frontend executa `npm test` e `npm run build` durante o build
- o frontend final roda em Nginx com fallback de SPA para `index.html`

## Variaveis relevantes

- `ADDR` define o endereco de escuta do backend
- `CORS_ORIGIN` define qual origem pode acessar a API
- `VITE_API_BASE_URL` permite apontar o frontend para outra API no build
