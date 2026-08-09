package calculator

import (
	"errors"
	"math"
	"testing"

	"calculadora.local/backend/internal/domain"
)

func TestServiceCalculate(t *testing.T) {
	svc := New()

	tests := []struct {
		name    string
		req     domain.CalculationRequest
		want    float64
		wantErr error
	}{
		{
			name: "add",
			req:  reqWithBinary(domain.OperationAdd, 10, 5),
			want: 15,
		},
		{
			name: "subtract",
			req:  reqWithBinary(domain.OperationSubtract, 10, 5),
			want: 5,
		},
		{
			name: "multiply",
			req:  reqWithBinary(domain.OperationMultiply, 10, 5),
			want: 50,
		},
		{
			name: "divide",
			req:  reqWithBinary(domain.OperationDivide, 10, 2),
			want: 5,
		},
		{
			name:    "divide by zero",
			req:     reqWithBinary(domain.OperationDivide, 10, 0),
			wantErr: ErrDivisionByZero,
		},
		{
			name: "power",
			req:  reqWithBinary(domain.OperationPower, 2, 3),
			want: 8,
		},
		{
			name: "sqrt",
			req:  reqWithUnary(domain.OperationSquareRoot, 9),
			want: 3,
		},
		{
			name:    "sqrt negative",
			req:     reqWithUnary(domain.OperationSquareRoot, -1),
			wantErr: ErrNegativeSquareRoot,
		},
		{
			name: "percentage",
			req:  reqWithUnary(domain.OperationPercentage, 25),
			want: 0.25,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := svc.Calculate(tt.req)
			if tt.wantErr != nil {
				if !errors.Is(err, tt.wantErr) {
					t.Fatalf("expected error %v, got %v", tt.wantErr, err)
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if math.Abs(got-tt.want) > 1e-9 {
				t.Fatalf("expected %v, got %v", tt.want, got)
			}
		})
	}
}

func reqWithBinary(op domain.Operation, left, right float64) domain.CalculationRequest {
	return domain.CalculationRequest{
		Operation: op,
		Left:      &left,
		Right:     &right,
	}
}

func reqWithUnary(op domain.Operation, value float64) domain.CalculationRequest {
	return domain.CalculationRequest{
		Operation: op,
		Value:     &value,
	}
}
