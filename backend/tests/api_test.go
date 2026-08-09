package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"calculadora.local/backend/internal/calculator"
	api "calculadora.local/backend/internal/http"
)

func TestHealthEndpoint(t *testing.T) {
	handler := newTestHandler("*")

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rec.Code)
	}

	var payload map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
		t.Fatalf("invalid JSON response: %v", err)
	}

	if payload["status"] != "ok" {
		t.Fatalf("expected status ok, got %v", payload["status"])
	}
}

func TestHealthEndpoint_MethodNotAllowed(t *testing.T) {
	handler := newTestHandler("*")

	req := httptest.NewRequest(http.MethodPost, "/health", nil)
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)

	assertStatus(t, rec, http.StatusMethodNotAllowed)
	assertJSONError(t, rec, "method not allowed")
	if got := rec.Header().Get("Allow"); got != http.MethodGet {
		t.Fatalf("expected Allow header to be GET, got %q", got)
	}
}

func TestCalculateEndpoint(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name            string
		body            string
		wantStatus      int
		wantResult      float64
		wantError       string
		wantErrorPrefix bool
	}{
		{
			name:       "add",
			body:       `{"operation":"add","left":10,"right":5}`,
			wantStatus: http.StatusOK,
			wantResult: 15,
		},
		{
			name:       "divide by zero",
			body:       `{"operation":"divide","left":10,"right":0}`,
			wantStatus: http.StatusUnprocessableEntity,
			wantError:  "division by zero",
		},
		{
			name:       "square root",
			body:       `{"operation":"sqrt","value":9}`,
			wantStatus: http.StatusOK,
			wantResult: 3,
		},
		{
			name:       "missing binary operand",
			body:       `{"operation":"add","left":10}`,
			wantStatus: http.StatusBadRequest,
			wantError:  "right is required for this operation",
		},
		{
			name:       "missing unary operand",
			body:       `{"operation":"sqrt"}`,
			wantStatus: http.StatusBadRequest,
			wantError:  "value is required for this operation",
		},
		{
			name:       "unsupported operation",
			body:       `{"operation":"mod","left":10,"right":3}`,
			wantStatus: http.StatusBadRequest,
			wantError:  "unsupported operation: mod",
		},
		{
			name:            "invalid json",
			body:            `{"operation":"add","left":10,`,
			wantStatus:      http.StatusBadRequest,
			wantError:       "invalid JSON payload",
			wantErrorPrefix: true,
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			rec := performCalculateRequest(t, tt.body)
			assertStatus(t, rec, tt.wantStatus)

			if tt.wantStatus == http.StatusOK {
				assertJSONResult(t, rec, tt.wantResult)
				return
			}

			if tt.wantErrorPrefix {
				assertJSONErrorPrefix(t, rec, tt.wantError)
				return
			}

			assertJSONError(t, rec, tt.wantError)
		})
	}
}

func TestOptionsRequest_ReturnsCorsHeaders(t *testing.T) {
	handler := newTestHandler("http://localhost:5173")

	req := httptest.NewRequest(http.MethodOptions, "/api/calculate", nil)
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Fatalf("expected status 204, got %d", rec.Code)
	}

	if got := rec.Header().Get("Access-Control-Allow-Origin"); got != "http://localhost:5173" {
		t.Fatalf("expected CORS origin to be forwarded, got %q", got)
	}
	if got := rec.Header().Get("Access-Control-Allow-Methods"); got != "GET, POST, OPTIONS" {
		t.Fatalf("expected allowed methods header, got %q", got)
	}
}

func newTestHandler(corsOrigin string) http.Handler {
	return api.NewServer(calculator.New(), corsOrigin).Handler()
}

func performCalculateRequest(t *testing.T, body string) *httptest.ResponseRecorder {
	t.Helper()

	handler := newTestHandler("*")

	req := httptest.NewRequest(http.MethodPost, "/api/calculate", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	return rec
}

func assertStatus(t *testing.T, rec *httptest.ResponseRecorder, want int) {
	t.Helper()

	if rec.Code != want {
		t.Fatalf("expected status %d, got %d. body=%s", want, rec.Code, rec.Body.String())
	}
}

func assertJSONResult(t *testing.T, rec *httptest.ResponseRecorder, want float64) {
	t.Helper()

	var payload struct {
		Result float64 `json:"result"`
	}
	if err := json.NewDecoder(bytes.NewReader(rec.Body.Bytes())).Decode(&payload); err != nil {
		t.Fatalf("invalid JSON response: %v", err)
	}
	if payload.Result != want {
		t.Fatalf("expected result %v, got %v", want, payload.Result)
	}
}

func assertJSONError(t *testing.T, rec *httptest.ResponseRecorder, want string) {
	t.Helper()

	var payload struct {
		Error string `json:"error"`
	}
	if err := json.NewDecoder(bytes.NewReader(rec.Body.Bytes())).Decode(&payload); err != nil {
		t.Fatalf("invalid JSON response: %v", err)
	}
	if payload.Error != want {
		t.Fatalf("expected error %q, got %q", want, payload.Error)
	}
}

func assertJSONErrorPrefix(t *testing.T, rec *httptest.ResponseRecorder, want string) {
	t.Helper()

	var payload struct {
		Error string `json:"error"`
	}
	if err := json.NewDecoder(bytes.NewReader(rec.Body.Bytes())).Decode(&payload); err != nil {
		t.Fatalf("invalid JSON response: %v", err)
	}
	if !strings.HasPrefix(payload.Error, want) {
		t.Fatalf("expected error prefix %q, got %q", want, payload.Error)
	}
}
