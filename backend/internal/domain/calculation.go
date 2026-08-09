package domain

// Operation identifies a calculator action supported by the API.
type Operation string

const (
	OperationAdd        Operation = "add"
	OperationSubtract   Operation = "subtract"
	OperationMultiply   Operation = "multiply"
	OperationDivide     Operation = "divide"
	OperationPower      Operation = "power"
	OperationSquareRoot Operation = "sqrt"
	OperationPercentage Operation = "percentage"
)

// IsSupported reports whether the operation is implemented by the backend.
func (o Operation) IsSupported() bool {
	switch o {
	case OperationAdd, OperationSubtract, OperationMultiply, OperationDivide, OperationPower, OperationSquareRoot, OperationPercentage:
		return true
	default:
		return false
	}
}

// RequiresBinaryOperands reports whether the operation expects left and right operands.
func (o Operation) RequiresBinaryOperands() bool {
	switch o {
	case OperationAdd, OperationSubtract, OperationMultiply, OperationDivide, OperationPower:
		return true
	default:
		return false
	}
}

// RequiresSingleOperand reports whether the operation expects one value field.
func (o Operation) RequiresSingleOperand() bool {
	switch o {
	case OperationSquareRoot, OperationPercentage:
		return true
	default:
		return false
	}
}

// CalculationRequest is the API contract for /api/calculate.
type CalculationRequest struct {
	Operation Operation `json:"operation"`
	Left      *float64   `json:"left,omitempty"`
	Right     *float64   `json:"right,omitempty"`
	Value     *float64   `json:"value,omitempty"`
}

// CalculationResponse is returned on successful calculations.
type CalculationResponse struct {
	Result float64 `json:"result"`
}

// HealthResponse is returned by the health endpoint.
type HealthResponse struct {
	Status  string `json:"status"`
	Service string `json:"service"`
}

// ErrorResponse is returned when a request fails validation or execution.
type ErrorResponse struct {
	Error string `json:"error"`
}

