const validateAppointment = (data) => {
  const errors = [];
  if (!data.service) errors.push("Service name is required");
  if (!data.date) errors.push("Date is required");
  if (!data.time) errors.push("Time is required");
  if (!data.clientId && !data.userEmail) errors.push("Client ID or user email is required");
  if (data.userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail)) {
    errors.push("User email must be valid");
  }
  
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.push("Invalid date format. Use YYYY-MM-DD");
  }

  return errors;
};

module.exports = { validateAppointment };
