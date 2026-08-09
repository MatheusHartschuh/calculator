package validation

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"

	"calculadora.local/backend/internal/domain"
)

var (
	ErrInvalidJSON      = errors.New("invalid JSON payload")
	ErrMissingOperation = errors.New("operation is required")
)

// DecodeCalculationRequest parses a JSON body into a typed request.
func DecodeCalculationRequest(body io.Reader) (domain.CalculationRequest, error) {
	dec := json.NewDecoder(body)
	dec.DisallowUnknownFields()

	var req domain.CalculationRequest
	if err := dec.Decode(&req); err != nil {
		return domain.CalculationRequest{}, fmt.Errorf("%w: %v", ErrInvalidJSON, err)
	}

	if err := ensureEOF(dec); err != nil {
		return domain.CalculationRequest{}, fmt.Errorf("%w: %v", ErrInvalidJSON, err)
	}

	return req, nil
}

// ValidateCalculationRequest checks the request shape before execution.
func ValidateCalculationRequest(req domain.CalculationRequest) error {
	if req.Operation == "" {
		return ErrMissingOperation
	}

	if !req.Operation.IsSupported() {
		return fmt.Errorf("unsupported operation: %s", req.Operation)
	}

	if req.Operation.RequiresBinaryOperands() {
		if req.Left == nil {
			return errors.New("left is required for this operation")
		}
		if req.Right == nil {
			return errors.New("right is required for this operation")
		}
	}

	if req.Operation.RequiresSingleOperand() {
		if req.Value == nil {
			return errors.New("value is required for this operation")
		}
	}

	return nil
}

// DecodeAndValidate is the convenient entry point used by HTTP handlers.
func DecodeAndValidate(body io.Reader) (domain.CalculationRequest, error) {
	req, err := DecodeCalculationRequest(body)
	if err != nil {
		return domain.CalculationRequest{}, err
	}
	if err := ValidateCalculationRequest(req); err != nil {
		return domain.CalculationRequest{}, err
	}
	return req, nil
}

func ensureEOF(dec *json.Decoder) error {
	var extra any
	if err := dec.Decode(&extra); err != io.EOF {
		if err == nil {
			return errors.New("unexpected extra data")
		}
		return err
	}
	return nil
}

