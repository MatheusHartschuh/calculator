package api

import (
	"encoding/json"
	"errors"
	"net/http"

	"calculadora.local/backend/internal/calculator"
	"calculadora.local/backend/internal/domain"
	"calculadora.local/backend/internal/validation"
)

// Server wires routes, middleware and dependencies.
type Server struct {
	mux        *http.ServeMux
	corsOrigin string
	calc       *calculator.Service
}

// NewServer creates the HTTP server handler.
func NewServer(calc *calculator.Service, corsOrigin string) *Server {
	if calc == nil {
		calc = calculator.New()
	}

	s := &Server{
		mux:        http.NewServeMux(),
		corsOrigin: corsOrigin,
		calc:       calc,
	}

	s.routes()
	return s
}

// Handler returns the server as an http.Handler with middleware applied.
func (s *Server) Handler() http.Handler {
	return s.withCORS(s.mux)
}

func (s *Server) routes() {
	s.mux.HandleFunc("/health", s.handleHealth)
	s.mux.HandleFunc("/api/calculate", s.handleCalculate)
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		s.methodNotAllowed(w, http.MethodGet)
		return
	}

	writeJSON(w, http.StatusOK, domain.HealthResponse{
		Status:  "ok",
		Service: "calculator-api",
	})
}

func (s *Server) handleCalculate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		s.methodNotAllowed(w, http.MethodPost)
		return
	}

	req, err := validation.DecodeAndValidate(r.Body)
	if err != nil {
		s.writeValidationError(w, err)
		return
	}

	result, err := s.calc.Calculate(req)
	if err != nil {
		s.writeCalculationError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, domain.CalculationResponse{Result: result})
}

func (s *Server) writeValidationError(w http.ResponseWriter, err error) {
	status := http.StatusBadRequest
	if errors.Is(err, validation.ErrInvalidJSON) {
		status = http.StatusBadRequest
	}

	writeJSON(w, status, domain.ErrorResponse{Error: err.Error()})
}

func (s *Server) writeCalculationError(w http.ResponseWriter, err error) {
	status := http.StatusUnprocessableEntity
	if errors.Is(err, calculator.ErrUnsupportedOperation) || errors.Is(err, calculator.ErrMissingOperand) {
		status = http.StatusBadRequest
	}

	writeJSON(w, status, domain.ErrorResponse{Error: err.Error()})
}

func (s *Server) methodNotAllowed(w http.ResponseWriter, allowed string) {
	w.Header().Set("Allow", allowed)
	writeJSON(w, http.StatusMethodNotAllowed, domain.ErrorResponse{Error: "method not allowed"})
}

func (s *Server) withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := s.corsOrigin
		if origin == "" {
			origin = "*"
		}

		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Max-Age", "86400")
		w.Header().Set("Vary", "Origin")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
