package validation

import (
	"errors"
	"strings"
	"testing"

	"calculadora.local/backend/internal/domain"
)

func TestDecodeCalculationRequest(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name    string
		body    string
		want    domain.CalculationRequest
		wantErr error
	}{
		{
			name: "valid request",
			body: `{"operation":"add","left":10,"right":5}`,
			want: domain.CalculationRequest{
				Operation: domain.OperationAdd,
				Left:      float64Ptr(10),
				Right:     float64Ptr(5),
			},
		},
		{
			name:    "rejects unknown fields",
			body:    `{"operation":"add","left":10,"right":5,"extra":1}`,
			wantErr: ErrInvalidJSON,
		},
		{
			name:    "rejects trailing data",
			body:    `{"operation":"add","left":10,"right":5} true`,
			wantErr: ErrInvalidJSON,
		},
		{
			name:    "rejects malformed json",
			body:    `{"operation":"add","left":10,`,
			wantErr: ErrInvalidJSON,
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			got, err := DecodeCalculationRequest(strings.NewReader(tt.body))
			if tt.wantErr != nil {
				if !errors.Is(err, tt.wantErr) {
					t.Fatalf("expected error %v, got %v", tt.wantErr, err)
				}
				return
			}

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if got.Operation != tt.want.Operation {
				t.Fatalf("expected operation %q, got %q", tt.want.Operation, got.Operation)
			}
			assertFloatPtr(t, got.Left, tt.want.Left, "left")
			assertFloatPtr(t, got.Right, tt.want.Right, "right")
			assertFloatPtr(t, got.Value, tt.want.Value, "value")
		})
	}
}

func TestValidateCalculationRequest(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name    string
		req     domain.CalculationRequest
		wantErr error
	}{
		{
			name:    "missing operation",
			req:     domain.CalculationRequest{},
			wantErr: ErrMissingOperation,
		},
		{
			name: "unsupported operation",
			req: domain.CalculationRequest{
				Operation: domain.Operation("mod"),
			},
			wantErr: errors.New("unsupported operation: mod"),
		},
		{
			name: "binary missing left operand",
			req: domain.CalculationRequest{
				Operation: domain.OperationAdd,
				Right:     float64Ptr(5),
			},
			wantErr: errors.New("left is required for this operation"),
		},
		{
			name: "binary missing right operand",
			req: domain.CalculationRequest{
				Operation: domain.OperationAdd,
				Left:      float64Ptr(10),
			},
			wantErr: errors.New("right is required for this operation"),
		},
		{
			name: "unary missing value",
			req: domain.CalculationRequest{
				Operation: domain.OperationSquareRoot,
			},
			wantErr: errors.New("value is required for this operation"),
		},
		{
			name: "valid binary request",
			req: domain.CalculationRequest{
				Operation: domain.OperationDivide,
				Left:      float64Ptr(10),
				Right:     float64Ptr(2),
			},
		},
		{
			name: "valid unary request",
			req: domain.CalculationRequest{
				Operation: domain.OperationPercentage,
				Value:     float64Ptr(25),
			},
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			err := ValidateCalculationRequest(tt.req)
			if tt.wantErr != nil {
				if err == nil {
					t.Fatal("expected error, got nil")
				}
				if err.Error() != tt.wantErr.Error() {
					t.Fatalf("expected error %q, got %q", tt.wantErr.Error(), err.Error())
				}
				return
			}

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
		})
	}
}

func float64Ptr(v float64) *float64 {
	return &v
}

func assertFloatPtr(t *testing.T, got, want *float64, field string) {
	t.Helper()

	if got == nil && want == nil {
		return
	}
	if got == nil || want == nil {
		t.Fatalf("expected %s to be %v, got %v", field, want, got)
	}
	if *got != *want {
		t.Fatalf("expected %s to be %v, got %v", field, *want, *got)
	}
}
