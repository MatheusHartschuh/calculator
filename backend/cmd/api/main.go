package main

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"calculadora.local/backend/internal/calculator"
	api "calculadora.local/backend/internal/http"
)

func main() {
	addr := serverAddr()
	corsOrigin := getenv("CORS_ORIGIN", "*")

	server := &http.Server{
		Addr:              addr,
		Handler:           api.NewServer(calculator.New(), corsOrigin).Handler(),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("calculator API listening on %s", addr)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}

func serverAddr() string {
	if addr := os.Getenv("ADDR"); addr != "" {
		return addr
	}

	if port := os.Getenv("PORT"); port != "" {
		if strings.HasPrefix(port, ":") {
			return port
		}
		return ":" + port
	}

	return ":8080"
}

func getenv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
