const validate = (form, services = []) => {
  const errors = {};

  if (!form.name.trim()) errors.name = "Service name is required";
  else if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) errors.name = "Service name must contain only letters";
  else if (form.name.trim().length < 3) errors.name = "Service name must be at least 3 characters";
  else if (form.name.trim().length > 50) errors.name = "Service name must be under 50 characters";
  else if (services.some(sv => sv.name.toLowerCase() === form.name.trim().toLowerCase()))
    errors.name = "A service with this name already exists";

  const rawPrice = form.price.replace("$", "").trim();
  if (!rawPrice) errors.price = "Price is required";
  else if (!/^\d+$/.test(rawPrice) || Number(rawPrice) <= 0) errors.price = "Price must be a positive whole number";
  else if (Number(rawPrice) > 10000) errors.price = "Price cannot exceed $10,000";

  const rawDuration = form.duration.replace("minutes", "").trim();
  if (!rawDuration) errors.duration = "Duration is required";
  else if (!/^\d+$/.test(rawDuration) || Number(rawDuration) <= 0) errors.duration = "Duration must be a positive whole number";
  else if (Number(rawDuration) > 480) errors.duration = "Duration cannot exceed 480 minutes (8 hours)";

  if (form.description.trim().length > 200) errors.description = "Description cannot exceed 200 characters";

  return errors;
};

describe("Service Validation", () => {

  // NAME
  describe("name", () => {
    test("empty name returns error", () => {
      const errors = validate({ name: "", price: "50", duration: "60", description: "" });
      expect(errors.name).toBe("Service name is required");
    });

    test("name with numbers returns error", () => {
      const errors = validate({ name: "Facial123", price: "50", duration: "60", description: "" });
      expect(errors.name).toBe("Service name must contain only letters");
    });

    test("name too short returns error", () => {
      const errors = validate({ name: "Ab", price: "50", duration: "60", description: "" });
      expect(errors.name).toBe("Service name must be at least 3 characters");
    });

    test("name too long returns error", () => {
      const errors = validate({ name: "A".repeat(51), price: "50", duration: "60", description: "" });
      expect(errors.name).toBe("Service name must be under 50 characters");
    });

    test("duplicate name returns error", () => {
      const existing = [{ id: 1, name: "Facial" }];
      const errors = validate({ name: "Facial", price: "50", duration: "60", description: "" }, existing);
      expect(errors.name).toBe("A service with this name already exists");
    });

    test("valid name returns no error", () => {
      const errors = validate({ name: "Facial", price: "50", duration: "60", description: "" });
      expect(errors.name).toBeUndefined();
    });
  });

  // PRICE
  describe("price", () => {
    test("empty price returns error", () => {
      const errors = validate({ name: "Facial", price: "", duration: "60", description: "" });
      expect(errors.price).toBe("Price is required");
    });

    test("negative price returns error", () => {
      const errors = validate({ name: "Facial", price: "-10", duration: "60", description: "" });
      expect(errors.price).toBe("Price must be a positive whole number");
    });

    test("zero price returns error", () => {
      const errors = validate({ name: "Facial", price: "0", duration: "60", description: "" });
      expect(errors.price).toBe("Price must be a positive whole number");
    });

    test("decimal price returns error", () => {
      const errors = validate({ name: "Facial", price: "9.99", duration: "60", description: "" });
      expect(errors.price).toBe("Price must be a positive whole number");
    });

    test("price exceeding 10000 returns error", () => {
      const errors = validate({ name: "Facial", price: "10001", duration: "60", description: "" });
      expect(errors.price).toBe("Price cannot exceed $10,000");
    });

    test("price with $ symbol is valid", () => {
      const errors = validate({ name: "Facial", price: "$50", duration: "60", description: "" });
      expect(errors.price).toBeUndefined();
    });

    test("valid price returns no error", () => {
      const errors = validate({ name: "Facial", price: "50", duration: "60", description: "" });
      expect(errors.price).toBeUndefined();
    });
  });

  // DURATION
  describe("duration", () => {
    test("empty duration returns error", () => {
      const errors = validate({ name: "Facial", price: "50", duration: "", description: "" });
      expect(errors.duration).toBe("Duration is required");
    });

    test("negative duration returns error", () => {
      const errors = validate({ name: "Facial", price: "50", duration: "-30", description: "" });
      expect(errors.duration).toBe("Duration must be a positive whole number");
    });

    test("zero duration returns error", () => {
      const errors = validate({ name: "Facial", price: "50", duration: "0", description: "" });
      expect(errors.duration).toBe("Duration must be a positive whole number");
    });

    test("duration exceeding 480 returns error", () => {
      const errors = validate({ name: "Facial", price: "50", duration: "481", description: "" });
      expect(errors.duration).toBe("Duration cannot exceed 480 minutes (8 hours)");
    });

    test("duration with 'minutes' text is valid", () => {
      const errors = validate({ name: "Facial", price: "50", duration: "60 minutes", description: "" });
      expect(errors.duration).toBeUndefined();
    });

    test("valid duration returns no error", () => {
      const errors = validate({ name: "Facial", price: "50", duration: "60", description: "" });
      expect(errors.duration).toBeUndefined();
    });
  });

  // DESCRIPTION
  describe("description", () => {
    test("description over 200 characters returns error", () => {
      const errors = validate({ name: "Facial", price: "50", duration: "60", description: "A".repeat(201) });
      expect(errors.description).toBe("Description cannot exceed 200 characters");
    });

    test("empty description returns no error", () => {
      const errors = validate({ name: "Facial", price: "50", duration: "60", description: "" });
      expect(errors.description).toBeUndefined();
    });

    test("valid description returns no error", () => {
      const errors = validate({ name: "Facial", price: "50", duration: "60", description: "A nice treatment" });
      expect(errors.description).toBeUndefined();
    });
  });

  // FULL VALID FORM
  test("fully valid form returns no errors", () => {
    const errors = validate({ name: "Facial", price: "50", duration: "60", description: "Nice treatment" });
    expect(Object.keys(errors).length).toBe(0);
  });
});