FROM golang:1.22-alpine AS build

WORKDIR /src

COPY go.mod ./
COPY cmd ./cmd
COPY internal ./internal
COPY tests ./tests

RUN go test ./...
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/calculator-api ./cmd/api

FROM alpine:3.22

WORKDIR /app

RUN adduser -D -H -u 10001 appuser

COPY --from=build /out/calculator-api /usr/local/bin/calculator-api

EXPOSE 8080

USER appuser

ENTRYPOINT ["/usr/local/bin/calculator-api"]
