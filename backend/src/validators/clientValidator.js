const validateClient = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    } else if (data.name.trim().length > 80) {
      errors.push("Name must be under 80 characters");
    }
  }

  if (!isUpdate || data.email !== undefined) {
    if (!data.email || typeof data.email !== "string") {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.push("Email must be valid");
    }
  }

  if (data.phone !== undefined && data.phone !== null && String(data.phone).length > 30) {
    errors.push("Phone must be under 30 characters");
  }

  return errors;
};

module.exports = { validateClient };
