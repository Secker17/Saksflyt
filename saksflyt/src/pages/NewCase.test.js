import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { createCase } from "../services/caseService";
import NewCase from "./NewCase";

jest.mock("react-router-dom", () => ({
  Link: ({ children }) => <span>{children}</span>,
  useSearchParams: () => [new URLSearchParams("team=team-1")],
}), { virtual: true });

jest.mock("../services/caseService", () => ({ createCase: jest.fn() }));
jest.mock("../context/TeamContext", () => ({
  useTeam: () => ({ activeTeam: null }),
}));

beforeEach(() => createCase.mockClear());

test("viser et enkelt skjema uten e-postfelt", () => {
  render(<NewCase />);

  expect(screen.getByLabelText("Tittel")).toBeInTheDocument();
  expect(screen.getByLabelText("Prioritet")).toBeInTheDocument();
  expect(screen.getByLabelText("Beskrivelse")).toBeInTheDocument();
  expect(screen.queryByLabelText("E-post")).not.toBeInTheDocument();
});

test("viser feilmelding når beskrivelsen mangler", () => {
  render(<NewCase />);

  fireEvent.change(screen.getByLabelText("Tittel"), {
    target: { value: "Problem med innlogging" },
  });
  fireEvent.click(screen.getByRole("button", { name: /opprett sak/i }));

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Tittel og beskrivelse må fylles ut.",
  );
  expect(createCase).not.toHaveBeenCalled();
});
