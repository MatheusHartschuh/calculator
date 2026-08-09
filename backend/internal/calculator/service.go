package calculator

import (
	"errors"
	"math"

	"calculadora.local/backend/internal/domain"
)

var (
	ErrDivisionByZero      = errors.New("division by zero")
	ErrNegativeSquareRoot  = errors.New("square root of negative number")
	ErrUnsupportedOperation = errors.New("unsupported operation")
	ErrInvalidResult       = errors.New("result is not a finite number")
	ErrMissingOperand      = errors.New("missing operand")
)

// Service performs arithmetic operations for the API.
type Service struct{}

// New returns a calculator service with no mutable state.
func New() *Service {
	return &Service{}
}

// Calculate executes a supported operation and returns the numeric result.
func (s *Service) Calculate(req domain.CalculationRequest) (float64, error) {
	var result float64

	switch req.Operation {
	case domain.OperationAdd:
		left, err := requiredValue(req.Left)
		if err != nil {
			return 0, err
		}
		right, err := requiredValue(req.Right)
		if err != nil {
			return 0, err
		}
		result = left + right
	case domain.OperationSubtract:
		left, err := requiredValue(req.Left)
		if err != nil {
			return 0, err
		}
		right, err := requiredValue(req.Right)
		if err != nil {
			return 0, err
		}
		result = left - right
	case domain.OperationMultiply:
		left, err := requiredValue(req.Left)
		if err != nil {
			return 0, err
		}
		right, err := requiredValue(req.Right)
		if err != nil {
			return 0, err
		}
		result = left * right
	case domain.OperationDivide:
		left, err := requiredValue(req.Left)
		if err != nil {
			return 0, err
		}
		right, err := requiredValue(req.Right)
		if err != nil {
			return 0, err
		}
		if right == 0 {
			return 0, ErrDivisionByZero
		}
		result = left / right
	case domain.OperationPower:
		left, err := requiredValue(req.Left)
		if err != nil {
			return 0, err
		}
		right, err := requiredValue(req.Right)
		if err != nil {
			return 0, err
		}
		result = math.Pow(left, right)
	case domain.OperationSquareRoot:
		value, err := requiredValue(req.Value)
		if err != nil {
			return 0, err
		}
		if value < 0 {
			return 0, ErrNegativeSquareRoot
		}
		result = math.Sqrt(value)
	case domain.OperationPercentage:
		value, err := requiredValue(req.Value)
		if err != nil {
			return 0, err
		}
		result = value / 100
	default:
		return 0, ErrUnsupportedOperation
	}

	if math.IsNaN(result) || math.IsInf(result, 0) {
		return 0, ErrInvalidResult
	}

	return result, nil
}

func requiredValue(value *float64) (float64, error) {
	if value == nil {
		return 0, ErrMissingOperand
	}
	return *value, nil
}
