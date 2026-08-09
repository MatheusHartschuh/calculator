# Documentação técnica da Calculadora

Este arquivo é o registro técnico mais completo do projeto. A ideia é que ele responda, com o máximo de contexto possível, perguntas sobre a aplicação, sua estrutura, o contrato entre frontend e backend, os testes, o Docker, as decisões de arquitetura e o alinhamento com o objetivo descrito em [`docs/objective.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/objective.md).

## Visão geral

A aplicação é uma calculadora full-stack com:

- frontend em React + TypeScript + Vite
- backend em Go
- comunicação entre as camadas via HTTP/JSON
- foco em código limpo, legível, idiomático e testável

A decisão central do projeto foi fazer o backend ser a fonte de verdade dos cálculos. O frontend mantém a interface, o estado de interação e a experiência do usuário, mas não contém a lógica final de matemática.

## Relação com o `objective.md`

O arquivo [`docs/objective.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/objective.md) pede uma calculadora full-stack com React no frontend, Go no backend, API REST, testes, cobertura, documentação clara e, se possível, Docker.

O estado atual do repositório atende a esse objetivo da seguinte forma:

- operações básicas estão cobertas no backend: soma, subtração, multiplicação e divisão
- operações opcionais também foram incluídas: potência, raiz quadrada e porcentagem
- o frontend consome a API do backend para calcular
- há testes unitários e testes de integração/contrato
- há cobertura de frontend e backend
- há Dockerfiles separados para frontend e backend
- há `docker-compose.yml` para subir os dois serviços juntos
- há documentação técnica e README principal com instruções de uso

## Estrutura do repositório

```text
.
├── backend/
├── docs/
├── frontend/
├── docker-compose.yml
├── package.json
└── README.md
```

### `frontend/`

Aplicação React/Vite que representa a interface visual da calculadora.

### `backend/`

Microservice em Go que expõe a API REST e executa os cálculos.

### `docs/`

Documentação do projeto:

- [`docs/objective.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/objective.md)
- [`docs/scope.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/scope.md)
- [`docs/guia-do-projeto.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/guia-do-projeto.md)
- [`docs/documentacao-do-projeto.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/documentacao-do-projeto.md)
- [`docs/docker.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/docker.md)
- este arquivo, [`docs/doc-tech.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/doc-tech.md)

## Visão geral do frontend

O frontend fica em `frontend/` e é responsável por:

- renderizar a calculadora
- receber input por clique e teclado físico
- manter estado de UI
- mostrar histórico local dos cálculos
- manter memória local de valores
- persistir preferências de idioma e casas decimais
- chamar o backend para executar as operações

### Arquivo de entrada

- [`frontend/src/main.tsx`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/main.tsx)

Esse arquivo apenas monta o React root, importa o CSS global e renderiza o `App`.

### Fluxo principal de estado

- [`frontend/src/App.tsx`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/App.tsx) concentra a orquestração geral
- `displayValue` guarda o texto atualmente exibido
- `accumulator` guarda o valor da operação em andamento
- `pendingOperation` guarda a operação binária pendente
- `waitingForOperand` controla quando a próxima entrada substitui o display
- `history` armazena os últimos cálculos bem-sucedidos
- `memory` armazena valores salvos na memória
- `isBusy` evita chamadas simultâneas para a API
- `isSettingsOpen` controla o modal de configurações

### Ciclo de uma operação

1. O usuário digita um número no display ou pelo teclado físico.
2. O estado local vai acumulando a entrada.
3. Ao escolher uma operação, o frontend decide se precisa apenas guardar a operação ou se já há cálculo pendente a resolver.
4. Quando a conta precisa ser resolvida, o frontend chama o backend.
5. O backend responde com JSON.
6. O frontend atualiza display, histórico e estado de controle.

### Comunicação com a API

- [`frontend/src/services/calculatorApi.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/services/calculatorApi.ts)

Esse arquivo encapsula as chamadas `fetch` e expõe:

- `calculateBinary(operation, left, right)`
- `calculateUnary(operation, value)`

Além disso, ele define `CalculatorApiError`, que preserva `message` e `status` HTTP para a UI conseguir mostrar erros de forma previsível.

### Tipos compartilhados no frontend

- [`frontend/src/types/calculator.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/types/calculator.ts)

Esse arquivo define:

- `BinaryOperation`
- `UnaryOperation`
- `BinaryCalculationRequest`
- `UnaryCalculationRequest`
- `CalculationResultResponse`
- `CalculationErrorResponse`

Esses tipos ajudam a manter o contrato do frontend consistente com a API do backend.

### Utilitários de número

- [`frontend/src/lib/number.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/lib/number.ts)
- [`frontend/src/utils/helper.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/utils/helper.ts)

Esses helpers cuidam de:

- parse de string para número
- limpeza e normalização de números para o display
- formatação visual com separador de milhar e vírgula decimal

Exemplo:

- valor interno: `12345.67`
- valor exibido: `12.345,67`

### Memória local

- [`frontend/src/lib/memory.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/lib/memory.ts)
- [`frontend/src/components/MemoryPanel/index.tsx`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/components/MemoryPanel/index.tsx)

A memória do frontend é local e fica em um array de números.

Operações suportadas:

- `MC` limpa tudo
- `MR` recupera o último valor
- `M+` adiciona o valor atual à memória
- `M-` adiciona o oposto do valor atual à memória
- cada item pode ser removido individualmente

Importante:

- a memória não vai para o backend
- a memória não é persistida entre reloads
- ela existe para experiência de uso, não como fonte de verdade do cálculo

### Histórico local

- [`frontend/src/components/HistoryPanel/index.tsx`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/components/HistoryPanel/index.tsx)

O histórico armazena apenas cálculos que deram certo. No estado atual, ele é limitado a 10 entradas, para evitar crescimento infinito da UI.

### Configurações

- [`frontend/src/lib/preferences.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/lib/preferences.ts)
- [`frontend/src/components/SettingsModal/index.tsx`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/components/SettingsModal/index.tsx)

As preferências salvas são:

- idioma
- quantidade padrão de casas decimais

Essas preferências são persistidas em `localStorage`.

Pontos importantes:

- o idioma padrão é `en`
- `pt-br` é a segunda opção
- casas decimais são limitadas entre 0 e 12
- `document.documentElement.lang` é atualizado quando o idioma muda

### Internacionalização

- [`frontend/src/i18n/index.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/i18n/index.ts)
- [`frontend/src/i18n/en.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/i18n/en.ts)
- [`frontend/src/i18n/pt-br.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/i18n/pt-br.ts)

O sistema de i18n cobre:

- textos do aplicativo
- títulos de painéis
- textos das configurações
- tooltips
- labels de acessibilidade

O `en` é o idioma base e o `pt-br` é uma tradução explícita.

### Normalização de teclas

- [`frontend/src/utils/keyUtils.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/utils/keyUtils.ts)
- [`frontend/src/utils/tooltipText.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/utils/tooltipText.ts)

Esse conjunto faz a ponte entre:

- teclado físico
- botões da interface
- labels exibidos ao usuário

Exemplos de normalização:

- `Enter` vira `=`
- `Backspace` vira `C`
- `Escape` vira `AC`
- `.` vira `,`
- `sqrt` e `raiz` viram `√`
- `x2`, `x^2` e `^2` viram `x²`

### Componentes principais

- [`frontend/src/components/Display/index.tsx`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/components/Display/index.tsx)
- [`frontend/src/components/Keypad/index.tsx`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/components/Keypad/index.tsx)
- [`frontend/src/components/Button/index.tsx`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/components/Button/index.tsx)
- [`frontend/src/components/HistoryPanel/index.tsx`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/components/HistoryPanel/index.tsx)
- [`frontend/src/components/MemoryPanel/index.tsx`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/components/MemoryPanel/index.tsx)
- [`frontend/src/components/SettingsModal/index.tsx`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/components/SettingsModal/index.tsx)

Responsabilidades:

- `Display`: mostra o valor atual e captura teclado físico.
- `Keypad`: desenha a matriz de botões e inclui memória, operadores e funções.
- `Button`: aplica cor, tooltip e acessibilidade.
- `HistoryPanel`: mostra os cálculos concluídos.
- `MemoryPanel`: mostra os valores salvos e ações de recall/remover.
- `SettingsModal`: altera idioma e quantidade de casas decimais.

### Layout e estilo

- [`frontend/src/App.styles.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/App.styles.ts)
- [`frontend/src/style/theme.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/style/theme.ts)
- [`frontend/src/index.css`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/index.css)

Decisões visuais importantes:

- a página centraliza o workspace vertical e horizontalmente
- o workspace usa uma grid com histórico à esquerda, calculadora no centro e memória à direita
- o tema é definido por constantes locais
- os botões usam cores semânticas por tipo de ação
- o display e os painéis têm visual simples e consistente

### Docker do frontend

- [`frontend/Dockerfile`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/Dockerfile)
- [`frontend/nginx.conf`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/nginx.conf)

Fluxo do build:

- instala dependências com `npm ci`
- roda `npm test`
- roda `npm run build`
- publica os assets estáticos em Nginx

## Visão geral do backend

O backend fica em `backend/` e é responsável por:

- receber requisições HTTP
- validar payloads
- executar as operações matemáticas
- retornar respostas JSON
- lidar com edge cases como divisão por zero e raiz de número negativo

### Ponto de entrada

- [`backend/cmd/api/main.go`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/cmd/api/main.go)

Esse arquivo:

- define o endereço do servidor via `ADDR` ou `PORT`
- lê `CORS_ORIGIN`
- cria o servidor HTTP
- registra o handler da API
- inicia o `ListenAndServe`

Defaults importantes:

- `ADDR` padrão: `:8080`
- `PORT` pode ser usado como alternativa
- `CORS_ORIGIN` padrão: `*`

### Domínio

- [`backend/internal/domain/calculation.go`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/internal/domain/calculation.go)

Esse pacote concentra os contratos e as operações suportadas:

- `OperationAdd`
- `OperationSubtract`
- `OperationMultiply`
- `OperationDivide`
- `OperationPower`
- `OperationSquareRoot`
- `OperationPercentage`

Também define:

- `CalculationRequest`
- `CalculationResponse`
- `HealthResponse`
- `ErrorResponse`

### Validação

- [`backend/internal/validation/request.go`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/internal/validation/request.go)

Regras principais:

- JSON desconhecido é rejeitado com `DisallowUnknownFields`
- payload com lixo extra após o JSON também é rejeitado
- operação é obrigatória
- operações binárias exigem `left` e `right`
- operações unárias exigem `value`
- a validação acontece antes da execução do cálculo

Erros notáveis:

- `ErrInvalidJSON`
- `ErrMissingOperation`

### Serviço de cálculo

- [`backend/internal/calculator/service.go`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/internal/calculator/service.go)

Esse serviço concentra as regras matemáticas puras.

Operações implementadas:

- soma
- subtração
- multiplicação
- divisão
- potência
- raiz quadrada
- porcentagem

Regras de erro:

- divisão por zero retorna erro específico
- raiz quadrada de número negativo retorna erro específico
- resultado `NaN` ou infinito é rejeitado
- operação não suportada retorna erro específico
- operandos ausentes retornam erro específico

Esse desenho facilita teste unitário porque a lógica fica isolada e sem dependência de HTTP.

### Camada HTTP

- [`backend/internal/http/server.go`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/internal/http/server.go)

Esse pacote cuida de:

- rotas
- middleware de CORS
- status codes
- serialização JSON
- mapeamento de erro para resposta HTTP

Rotas expostas:

- `GET /health`
- `POST /api/calculate`

Comportamento de status:

- `400 Bad Request` para payload inválido ou operação faltando/unsupported
- `422 Unprocessable Entity` para erro de execução matemática, como divisão por zero
- `405 Method Not Allowed` para método errado
- `204 No Content` em `OPTIONS`

### CORS

O backend responde com cabeçalhos CORS configuráveis.

Headers enviados:

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- `Access-Control-Max-Age`
- `Vary: Origin`

### Docker do backend

- [`backend/Dockerfile`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/Dockerfile)

Fluxo do build:

- usa `golang:1.22-alpine` no estágio de build
- copia `go.mod`, `cmd`, `internal` e `tests`
- roda `go test ./...`
- compila o binário Go
- copia o binário final para `alpine:3.22`
- roda como usuário não-root

## Contrato da API

### Healthcheck

`GET /health`

Resposta de sucesso:

```json
{
  "status": "ok",
  "service": "calculator-api"
}
```

### Cálculo binário

`POST /api/calculate`

Exemplo:

```json
{
  "operation": "add",
  "left": 10,
  "right": 5
}
```

Resposta:

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

Resposta:

```json
{
  "result": 5
}
```

### Cálculo unário

Raiz quadrada:

```json
{
  "operation": "sqrt",
  "value": 9
}
```

Resposta:

```json
{
  "result": 3
}
```

Porcentagem:

```json
{
  "operation": "percentage",
  "value": 25
}
```

Resposta:

```json
{
  "result": 0.25
}
```

### Erros

Exemplos de erro retornados pela API:

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

## Fluxo ponta a ponta

### Soma simples

1. O usuário pressiona `1`, `+`, `2` e `=`.
2. O frontend mantém o valor atual no display.
3. Ao confirmar a operação, o frontend chama `POST /api/calculate`.
4. O backend calcula `1 + 2`.
5. A resposta chega como JSON.
6. O frontend atualiza display e histórico.

### Raiz quadrada

1. O usuário digita um número.
2. O frontend converte o atalho de tecla para `√` ou usa o botão `Raiz`.
3. O frontend envia uma operação unária ao backend.
4. O backend executa `sqrt`.
5. O resultado volta como JSON e a UI é atualizada.

### Percentual

1. O usuário escolhe `%`.
2. O frontend envia o valor atual como `value`.
3. O backend divide por `100`.
4. A UI mostra o resultado formatado.

## Testes

### Frontend

Testes do frontend ficam em:

- [`frontend/src/lib/memory.test.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/lib/memory.test.ts)
- [`frontend/src/lib/preferences.test.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/lib/preferences.test.ts)
- [`frontend/src/utils/keyUtils.test.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/utils/keyUtils.test.ts)
- [`frontend/src/services/calculatorApi.test.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/services/calculatorApi.test.ts)

O que eles cobrem:

- manipulação de memória
- persistência e normalização de settings
- normalização de teclas
- integração de API via `fetch`

### Backend

Testes do backend ficam em:

- [`backend/internal/calculator/service_test.go`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/internal/calculator/service_test.go)
- [`backend/internal/validation/request_test.go`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/internal/validation/request_test.go)
- [`backend/tests/api_test.go`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/tests/api_test.go)

O que eles cobrem:

- regras de cálculo
- validação de payloads
- integração HTTP
- CORS
- respostas de erro e sucesso

### Coverage atual

Última validação executada:

- frontend: 17 testes passando em 5 arquivos
- backend: suíte passando com cobertura total de 73.9%

Arquivos gerados:

- [`frontend/coverage/index.html`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/coverage/index.html)
- [`backend/coverage.out`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/coverage.out)
- [`backend/coverage.html`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/coverage.html)

Observação importante:

- a cobertura do frontend ainda está concentrada em libs, serviços e utilitários
- os componentes visuais ainda têm espaço para testes adicionais

## Docker e execução local

### `docker-compose.yml`

- [`docker-compose.yml`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docker-compose.yml)

Esse arquivo sobe:

- `backend` em `http://localhost:8080`
- `frontend` em `http://localhost:3000`

Configurações relevantes:

- o backend recebe `ADDR=:8080`
- o backend recebe `CORS_ORIGIN=http://localhost:3000`
- o frontend recebe `VITE_API_BASE_URL=http://localhost:8080`

### Comandos da raiz

O `package.json` da raiz funciona como orquestrador de conveniência.

- `npm start`: repassa para o frontend.
- `npm run dev`: repassa para o frontend.
- `npm run build`: repassa para o frontend.
- `npm run lint`: repassa para o frontend.
- `npm test`: roda os testes do frontend e valida o backend durante o build do Docker.
- `npm run coverage`: gera coverage do frontend e do backend.

### Pontos práticos para quem não usa Go ainda

Se você não quer instalar Go localmente, a forma mais simples de trabalhar com o backend é usar Docker Compose.

Se você quer rodar o backend sem Docker, o comando é:

```bash
cd backend
go run ./cmd/api
```

## Uso de IA

O projeto foi desenvolvido com apoio de IA generativa nesta sessão, usando o Codex como copiloto para:

- ler e interpretar o `objective.md`
- mapear a base existente
- planejar o repositório em camadas
- implementar o backend Go
- integrar o frontend com a API
- adicionar testes unitários e de integração
- configurar coverage
- preparar Dockerfiles e `docker-compose.yml`
- escrever e atualizar documentação
- revisar a organização da interface e do fluxo de cálculo

Não houve uso de outra IA externa como fonte de verdade do produto. A IA foi usada como assistente de engenharia, enquanto as decisões finais ficaram alinhadas ao objetivo e às restrições do projeto.

## Prompts e instruções que guiaram o desenvolvimento

Como esse trabalho foi feito em uma conversa longa, este documento registra os temas dos prompts principais que moldaram a implementação.

- entender o projeto inteiro e criar um documento com o que é importante
- ler o `objective.md` em detalhe antes de mexer no código
- fechar o escopo e definir a fronteira clara entre frontend e backend
- reorganizar o repositório em `frontend/`, `backend/` e `docs/`
- implementar o backend Go
- ligar o frontend à API e remover o cálculo local
- adicionar testes unitários e testes de integração/contrato
- adicionar coverage para frontend e backend
- fazer limpeza final, rodar lint/build/test e adicionar Docker
- documentar setup, execução, exemplos de API e decisões de arquitetura
- restaurar o painel de settings e a memória
- ajustar layout, idioma padrão e teclado
- corrigir um erro de tipagem na camada de i18n

Em termos práticos, os prompts foram usados para:

- guiar a análise do que já existia
- priorizar o que deveria permanecer e o que deveria sair
- manter a aplicação limpa, legível e idiomática
- evitar duplicação de regra de negócio
- transformar a aplicação em algo fácil de manter e testar

## Decisões de arquitetura

- o backend é a fonte de verdade dos cálculos
- o frontend não calcula o resultado final localmente
- a API usa operações explícitas em vez de parser livre de expressões
- o estado de memória e histórico é local à interface
- preferências de UI ficam em `localStorage`
- a interface mostra apenas o necessário para o usuário operar a calculadora
- o contrato da API é pequeno e previsível
- os erros são retornados em JSON e tratados no frontend
- o Docker separa build e runtime para manter as imagens enxutas
- o backend roda como usuário não-root dentro da imagem final

## Assunções do projeto

- a aplicação é usada localmente e também pode ser empacotada com Docker
- o backend escuta em `localhost:8080` por padrão
- o frontend consome `http://localhost:8080` por padrão
- `English` é o idioma inicial e `pt-br` é uma opção explícita
- a quantidade padrão de casas decimais é 6
- a memória e o histórico não precisam sobreviver a reload de página
- os cálculos precisam ser fáceis de explicar e de testar
- a experiência visual deve continuar simples, sem excesso de camadas

## Pontos para melhorar no futuro

- adicionar mais testes de componentes no frontend
- aumentar a cobertura do JSX visual e dos fluxos de interação
- simplificar ainda mais a comunicação entre UI e API com uma camada de domínio compartilhado
- adicionar um `.env.example` para documentar variáveis de ambiente
- considerar um proxy de desenvolvimento para reduzir atrito com CORS
- adicionar observabilidade básica no backend, como logs mais estruturados
- separar melhor domínio, transporte e adapters se a API crescer
- avaliar se memória e histórico precisam de persistência opcional
- adicionar snapshot ou visual regression se o layout continuar evoluindo
- criar documentação de API mais formal, se o escopo aumentar

## Arquivos mais importantes para consulta rápida

- [`README.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/README.md)
- [`docs/objective.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/objective.md)
- [`docs/scope.md`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/docs/scope.md)
- [`frontend/src/App.tsx`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/App.tsx)
- [`frontend/src/services/calculatorApi.ts`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/frontend/src/services/calculatorApi.ts)
- [`backend/cmd/api/main.go`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/cmd/api/main.go)
- [`backend/internal/http/server.go`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/internal/http/server.go)
- [`backend/internal/calculator/service.go`](/home/matheuspalavrasapplicado/Documentos/Backup%20Manual/calculadora-main/backend/internal/calculator/service.go)

## Resumo final

Se alguém quiser entender este projeto de ponta a ponta, a sequência de leitura mais útil é:

1. `docs/objective.md`
2. `docs/scope.md`
3. este arquivo, `docs/doc-tech.md`
4. `README.md`
5. `frontend/src/App.tsx`
6. `backend/cmd/api/main.go`

Essa ordem mostra o objetivo, o escopo, a arquitetura e finalmente a implementação concreta.
