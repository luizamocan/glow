const validateService = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0)
      errors.push("Name is required and must be a non-empty string");
    else if (!/^[a-zA-Z\s]+$/.test(data.name.trim()))
      errors.push("Name must contain only letters and spaces");
    else if (data.name.trim().length < 3)
      errors.push("Name must be at least 3 characters");
    else if (data.name.trim().length > 50)
      errors.push("Name must be under 50 characters");
  }

  if (!isUpdate || data.price !== undefined) {
    if (data.price === undefined || data.price === null)
      errors.push("Price is required");
    else if (!Number.isInteger(data.price) || data.price <= 0)
      errors.push("Price must be a positive integer");
    else if (data.price > 10000)
      errors.push("Price cannot exceed 10000");
  }

  if (!isUpdate || data.duration !== undefined) {
    if (data.duration === undefined || data.duration === null)
      errors.push("Duration is required");
    else if (!Number.isInteger(data.duration) || data.duration <= 0)
      errors.push("Duration must be a positive integer (minutes)");
    else if (data.duration > 480)
      errors.push("Duration cannot exceed 480 minutes");
  }

  if (data.description !== undefined && data.description.length > 200)
    errors.push("Description cannot exceed 200 characters");

  return errors;
};

module.exports = { validateService };