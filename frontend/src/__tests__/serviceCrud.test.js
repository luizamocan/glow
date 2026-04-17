const INITIAL_SERVICES = [
  { id: 1, name: "Facial",        price: "$50",  duration: "60 minutes", description: "Deep skin cleansing" },
  { id: 2, name: "Haircut",       price: "$35",  duration: "45 minutes", description: "Precision haircut" },
  { id: 3, name: "Manicure",      price: "$30",  duration: "90 minutes", description: "Full manicure" },
  { id: 4, name: "Spa Treatment", price: "$100", duration: "120 minutes", description: "Full body spa" },
];

// Simulate the CRUD handlers from ServicesPage
const handleAdd = (services, form) => [
  ...services,
  { ...form, id: Date.now() }
];

const handleEdit = (services, form) =>
  services.map(sv => sv.id === form.id ? form : sv);

const handleDelete = (services, target) =>
  services.filter(sv => sv.id !== target.id);

const cleanForm = (form) => ({
  ...form,
  price: "$" + form.price.replace("$", "").trim(),
  duration: form.duration.replace("minutes", "").trim() + " minutes",
  description: form.description.trim(),
});

describe("CRUD Operations", () => {

  // ADD
  describe("Add Service", () => {
    test("adds a new service to the list", () => {
      const newService = cleanForm({ name: "Pedicure", price: "40", duration: "60", description: "Full pedicure" });
      const result = handleAdd(INITIAL_SERVICES, newService);
      expect(result).toHaveLength(5);
      expect(result[4].name).toBe("Pedicure");
    });

    test("added service has correct price format", () => {
      const newService = cleanForm({ name: "Pedicure", price: "40", duration: "60", description: "" });
      const result = handleAdd(INITIAL_SERVICES, newService);
      expect(result[4].price).toBe("$40");
    });

    test("added service has correct duration format", () => {
      const newService = cleanForm({ name: "Pedicure", price: "40", duration: "60", description: "" });
      const result = handleAdd(INITIAL_SERVICES, newService);
      expect(result[4].duration).toBe("60 minutes");
    });

    test("added service with $ in price formats correctly", () => {
      const newService = cleanForm({ name: "Pedicure", price: "$40", duration: "60", description: "" });
      const result = handleAdd(INITIAL_SERVICES, newService);
      expect(result[4].price).toBe("$40");
    });

    test("added service with 'minutes' in duration formats correctly", () => {
      const newService = cleanForm({ name: "Pedicure", price: "40", duration: "60 minutes", description: "" });
      const result = handleAdd(INITIAL_SERVICES, newService);
      expect(result[4].duration).toBe("60 minutes");
    });

    test("does not modify existing services", () => {
      const newService = cleanForm({ name: "Pedicure", price: "40", duration: "60", description: "" });
      const result = handleAdd(INITIAL_SERVICES, newService);
      expect(result[0]).toEqual(INITIAL_SERVICES[0]);
      expect(result[1]).toEqual(INITIAL_SERVICES[1]);
    });

    test("empty description is preserved as empty string", () => {
      const newService = cleanForm({ name: "Pedicure", price: "40", duration: "60", description: "" });
      const result = handleAdd(INITIAL_SERVICES, newService);
      expect(result[4].description).toBe("");
    });
  });

  // EDIT
  describe("Edit Service", () => {
    test("edits an existing service", () => {
      const updated = { ...INITIAL_SERVICES[0], name: "Deep Facial", price: "$60" };
      const result = handleEdit(INITIAL_SERVICES, updated);
      expect(result[0].name).toBe("Deep Facial");
      expect(result[0].price).toBe("$60");
    });

    test("does not change list length after edit", () => {
      const updated = { ...INITIAL_SERVICES[0], name: "Deep Facial" };
      const result = handleEdit(INITIAL_SERVICES, updated);
      expect(result).toHaveLength(4);
    });

    test("does not modify other services", () => {
      const updated = { ...INITIAL_SERVICES[0], name: "Deep Facial" };
      const result = handleEdit(INITIAL_SERVICES, updated);
      expect(result[1]).toEqual(INITIAL_SERVICES[1]);
      expect(result[2]).toEqual(INITIAL_SERVICES[2]);
    });

    test("edited service retains same id", () => {
      const updated = { ...INITIAL_SERVICES[0], name: "Deep Facial" };
      const result = handleEdit(INITIAL_SERVICES, updated);
      expect(result[0].id).toBe(INITIAL_SERVICES[0].id);
    });

    test("edits service in the middle of the list", () => {
      const updated = { ...INITIAL_SERVICES[2], price: "$45" };
      const result = handleEdit(INITIAL_SERVICES, updated);
      expect(result[2].price).toBe("$45");
    });
  });

  // DELETE
  describe("Delete Service", () => {
    test("removes a service from the list", () => {
      const result = handleDelete(INITIAL_SERVICES, INITIAL_SERVICES[0]);
      expect(result).toHaveLength(3);
    });

    test("removed service is no longer in the list", () => {
      const result = handleDelete(INITIAL_SERVICES, INITIAL_SERVICES[0]);
      expect(result.find(sv => sv.id === INITIAL_SERVICES[0].id)).toBeUndefined();
    });

    test("does not modify other services after delete", () => {
      const result = handleDelete(INITIAL_SERVICES, INITIAL_SERVICES[0]);
      expect(result[0]).toEqual(INITIAL_SERVICES[1]);
      expect(result[1]).toEqual(INITIAL_SERVICES[2]);
    });

    test("deletes service from the middle of the list", () => {
      const result = handleDelete(INITIAL_SERVICES, INITIAL_SERVICES[2]);
      expect(result).toHaveLength(3);
      expect(result.find(sv => sv.id === INITIAL_SERVICES[2].id)).toBeUndefined();
    });

    test("deletes last service in the list", () => {
      const result = handleDelete(INITIAL_SERVICES, INITIAL_SERVICES[3]);
      expect(result).toHaveLength(3);
      expect(result.find(sv => sv.id === INITIAL_SERVICES[3].id)).toBeUndefined();
    });

    test("deleting non-existent service does not change list", () => {
      const result = handleDelete(INITIAL_SERVICES, { id: 999 });
      expect(result).toHaveLength(4);
    });
  });

  // SEARCH/FILTER
  describe("Search/Filter", () => {
    test("filters services by name", () => {
      const result = INITIAL_SERVICES.filter(sv =>
        sv.name.toLowerCase().includes("facial")
      );
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Facial");
    });

    test("search is case insensitive", () => {
      const result = INITIAL_SERVICES.filter(sv =>
        sv.name.toLowerCase().includes("FACIAL".toLowerCase())
      );
      expect(result).toHaveLength(1);
    });

    test("empty search returns all services", () => {
      const result = INITIAL_SERVICES.filter(sv =>
        sv.name.toLowerCase().includes("")
      );
      expect(result).toHaveLength(4);
    });

    test("search with no match returns empty list", () => {
      const result = INITIAL_SERVICES.filter(sv =>
        sv.name.toLowerCase().includes("xyz")
      );
      expect(result).toHaveLength(0);
    });
  });

  // PAGINATION
  describe("Pagination", () => {
    test("shows correct number of items per page", () => {
      const perPage = 4;
      const displayed = INITIAL_SERVICES.slice(0, perPage);
      expect(displayed).toHaveLength(4);
    });

    test("calculates correct total pages", () => {
      const perPage = 4;
      const totalPages = Math.ceil(INITIAL_SERVICES.length / perPage);
      expect(totalPages).toBe(1);
    });

    test("calculates correct total pages for 8 services", () => {
      const eightServices = [...INITIAL_SERVICES, ...INITIAL_SERVICES.map((s, i) => ({ ...s, id: i + 10 }))];
      const perPage = 4;
      const totalPages = Math.ceil(eightServices.length / perPage);
      expect(totalPages).toBe(2);
    });

    test("page 2 shows correct items", () => {
      const eightServices = [...INITIAL_SERVICES, ...INITIAL_SERVICES.map((s, i) => ({ ...s, id: i + 10 }))];
      const perPage = 4;
      const page2 = eightServices.slice(perPage, perPage * 2);
      expect(page2).toHaveLength(4);
      expect(page2[0].id).toBe(10);
    });
  });
});