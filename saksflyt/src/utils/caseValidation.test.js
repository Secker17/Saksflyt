import { validateCase } from "./caseValidation";

const validCase = {
  title: "Problem med innlogging",
  description: "Jeg får ikke logget inn.",
};

test("godtar en sak med tittel og beskrivelse", () => {
  expect(validateCase(validCase)).toBe("");
});

test("gir feilmelding når et nødvendig felt er tomt", () => {
  const result = validateCase({ ...validCase, title: "" });

  expect(result).toBe("Tittel og beskrivelse må fylles ut.");
});
