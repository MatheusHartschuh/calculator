# Escopo E Fronteira

## Objetivo final

O produto final sera uma aplicacao full-stack de calculadora com:

- frontend em React
- backend microservice em Go
- API REST para executar operacoes matematicas
- codigo limpo, legivel, idiomatico e testavel

## Escopo fechado

Para esta versao, a divisao de responsabilidades fica assim:

### Frontend

- renderizar a interface da calculadora
- coletar entrada do usuario
- validar erros obvios de UX antes da chamada da API
- enviar requisicoes para o backend
- exibir resultados e mensagens de erro
- manter apenas estado de interface

### Backend

- receber requisicoes HTTP
- validar payloads e tipos
- executar os calculos
- tratar edge cases
- responder em JSON
- ser a fonte de verdade das operacoes

### Contrato compartilhado

- request e response em JSON
- campos e formatos documentados
- mensagens de erro previsiveis
- uma unica origem de verdade para as operacoes suportadas

## Operacoes em escopo

Obrigatorias:

- adicao
- subtracao
- multiplicacao
- divisao

Opcional, se couber bem na implementacao:

- exponenciacao
- raiz quadrada
- porcentagem

## Fora de escopo por enquanto

Estas capacidades nao devem ser prioridade nesta fase:

- avaliacao local de expressoes complexas no frontend
- memoria de calculadora
- historico persistido
- funcoes trigonometrica
- configuracoes avancadas de interface
- banco de dados
- autenticacao
- armazenamento permanente
- parser generico de expressoes livres

## Fronteira tecnica recomendada

O frontend deve parar de calcular localmente e passar a operar com chamadas de API.
O backend deve receber operacoes explicitas, por exemplo:

- operacao binaria com dois operandos
- operacao unaria com um operando

Isso evita duplicar regra de negocio em duas camadas e reduz a chance de divergencia.

## API sugerida

### `GET /health`

Usado para checar se o backend esta ativo.

### `POST /api/calculate`

Request sugerida:

```json
{
  "operation": "add",
  "left": 10,
  "right": 5
}
```

Response de sucesso:

```json
{
  "result": 15
}
```

Response de erro:

```json
{
  "error": "division by zero"
}
```

## Estrutura sugerida daqui para frente

### Frontend

- `frontend/src/components`
- `frontend/src/features`
- `frontend/src/services`
- `frontend/src/types`
- `frontend/src/lib`

### Backend

- `backend/cmd/api`
- `backend/internal/calculator`
- `backend/internal/http`
- `backend/internal/validation`
- `backend/internal/domain`
- `backend/tests`

## Decisao de produto

A calculadora atual tem recursos extras interessantes, mas o alvo desta fase e um produto simples, claro e confiavel.
O foco deve estar na qualidade da API, na previsibilidade dos resultados e na clareza da interface.
