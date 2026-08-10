import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const calculatorApiMocks = vi.hoisted(() => ({
  calculateBinary: vi.fn(),
  calculateUnary: vi.fn(),
}));

vi.mock("../services/calculatorApi", () => {
  class CalculatorApiError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
      super(message);
      this.name = "CalculatorApiError";
      this.status = status;
    }
  }

  return {
    CalculatorApiError,
    calculateBinary: calculatorApiMocks.calculateBinary,
    calculateUnary: calculatorApiMocks.calculateUnary,
  };
});

import App from "./index";
import { CalculatorApiError } from "../services/calculatorApi";

function getDisplay(name = "Calculator display") {
  return screen.getByRole("textbox", { name }) as HTMLInputElement;
}

function getPendingOperator() {
  return screen.getByRole("status", { name: "Pending operation" });
}

async function pressCalculatorButton(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.click(screen.getByRole("button", { name }));
}

describe("calculator application", () => {
  beforeEach(() => {
    localStorage.clear();
    calculatorApiMocks.calculateBinary.mockReset();
    calculatorApiMocks.calculateUnary.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("completes a binary calculation through the keypad", async () => {
    calculatorApiMocks.calculateBinary.mockResolvedValue(5);
    const user = userEvent.setup();

    render(<App />);

    await pressCalculatorButton(user, "2");
    await pressCalculatorButton(user, "Addition");
    await pressCalculatorButton(user, "3");
    await pressCalculatorButton(user, "Equals");

    await waitFor(() => expect(getDisplay().value).toBe("5"));
    expect(calculatorApiMocks.calculateBinary).toHaveBeenCalledWith("add", 2, 3);
  });

  it("completes division through the keypad", async () => {
    calculatorApiMocks.calculateBinary.mockResolvedValue(4);
    const user = userEvent.setup();

    render(<App />);

    await pressCalculatorButton(user, "8");
    await pressCalculatorButton(user, "Division");
    await pressCalculatorButton(user, "2");
    await pressCalculatorButton(user, "Equals");

    await waitFor(() => expect(getDisplay().value).toBe("4"));
    expect(calculatorApiMocks.calculateBinary).toHaveBeenCalledWith("divide", 8, 2);
  });

  it("adds and renders a completed calculation in history", async () => {
    calculatorApiMocks.calculateBinary.mockResolvedValue(5);
    const user = userEvent.setup();

    render(<App />);

    await pressCalculatorButton(user, "2");
    await pressCalculatorButton(user, "Addition");
    await pressCalculatorButton(user, "3");
    await pressCalculatorButton(user, "Equals");

    expect(await screen.findByText("2 + 3 = 5")).toBeTruthy();
  });

  it("keeps the selected operator visible until the calculation is completed", async () => {
    calculatorApiMocks.calculateBinary.mockResolvedValue(5);
    const user = userEvent.setup();

    render(<App />);

    await pressCalculatorButton(user, "3");
    await pressCalculatorButton(user, "Addition");
    expect(getPendingOperator().textContent).toBe("+");

    await pressCalculatorButton(user, "2");
    expect(getPendingOperator().textContent).toBe("+");

    await pressCalculatorButton(user, "Equals");
    await waitFor(() => expect(getPendingOperator().textContent).toBe(""));
  });

  it("displays an API error in the calculator display", async () => {
    calculatorApiMocks.calculateBinary.mockRejectedValue(new CalculatorApiError("division by zero", 422));
    const user = userEvent.setup();

    render(<App />);

    await pressCalculatorButton(user, "1");
    fireEvent.keyDown(getDisplay(), { key: "/" });
    fireEvent.keyDown(getDisplay(), { key: "0" });
    fireEvent.keyDown(getDisplay(), { key: "Enter" });

    await waitFor(() => expect(getDisplay().value).toBe("Error"));
  });

  it("displays the English error for a negative square root", async () => {
    calculatorApiMocks.calculateUnary.mockRejectedValue(
      new CalculatorApiError("square root of negative number", 422),
    );
    const user = userEvent.setup();

    render(<App />);

    await pressCalculatorButton(user, "1");
    await pressCalculatorButton(user, "Toggle sign");
    await pressCalculatorButton(user, "Square root");

    await waitFor(() => expect(getDisplay().value).toBe("Error"));
    expect(calculatorApiMocks.calculateUnary).toHaveBeenCalledWith("sqrt", -1);
  });

  it("uses the Portuguese error display when the saved language is pt-br", async () => {
    localStorage.setItem("calculadora.settings", JSON.stringify({ language: "pt-br", decimalPlaces: 6 }));
    calculatorApiMocks.calculateBinary.mockRejectedValue(new CalculatorApiError("division by zero", 422));

    render(<App />);

    fireEvent.keyDown(getDisplay("Display da calculadora"), { key: "1" });
    fireEvent.keyDown(getDisplay("Display da calculadora"), { key: "/" });
    fireEvent.keyDown(getDisplay("Display da calculadora"), { key: "0" });
    fireEvent.keyDown(getDisplay("Display da calculadora"), { key: "Enter" });

    await waitFor(() => expect(getDisplay("Display da calculadora").value).toBe("Erro"));
  });

  it("stores, recalls, and clears memory values", async () => {
    const user = userEvent.setup();

    render(<App />);

    await pressCalculatorButton(user, "5");
    await pressCalculatorButton(user, "Adds the current number to memory");
    await pressCalculatorButton(user, "Clears everything");
    await pressCalculatorButton(user, "Recalls the last memory value");

    expect(getDisplay().value).toBe("5");

    await user.click(screen.getAllByRole("button", { name: "Clears memory" })[0]);

    const memoryPanel = screen.getByRole("heading", { name: /^Memory/ }).parentElement;
    expect(memoryPanel).not.toBeNull();
    expect(within(memoryPanel!).getByText("Empty!")).toBeTruthy();
  });

  it("opens settings and saves a new decimal-place preference", async () => {
    const user = userEvent.setup();

    render(<App />);

    await pressCalculatorButton(user, "Open settings");
    const decimalPlaces = screen.getByLabelText("Default decimals:") as HTMLInputElement;

    await user.clear(decimalPlaces);
    await user.type(decimalPlaces, "2");
    await pressCalculatorButton(user, "Save");

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem("calculadora.settings") ?? "{}")).toMatchObject({ decimalPlaces: 2 });
    });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
