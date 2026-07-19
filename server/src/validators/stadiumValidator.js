export const validateStadium = (req, res, next) => {
  const { name, city, country, address, capacity, parkingCapacity, gates, status } = req.body;
  const errors = [];

  if (!name || name.trim().length < 3) {
    errors.push('Name is required and must be at least 3 characters long.');
  }

  if (!city || city.trim().length === 0) {
    errors.push('City is required.');
  }

  if (!country || country.trim().length === 0) {
    errors.push('Country is required.');
  }

  if (!address || address.trim().length === 0) {
    errors.push('Address is required.');
  }

  if (capacity === undefined || isNaN(capacity) || Number(capacity) <= 1000) {
    errors.push('Capacity must be a number greater than 1000.');
  }

  if (parkingCapacity === undefined || isNaN(parkingCapacity) || Number(parkingCapacity) < 0) {
    errors.push('Parking capacity cannot be negative.');
  }

  if (gates === undefined || isNaN(gates) || Number(gates) <= 0) {
    errors.push('Gates must be a number greater than 0.');
  }

  const validStatuses = ['Active', 'Maintenance', 'Closed'];
  if (status && !validStatuses.includes(status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Failed',
      errors
    });
  }

  next();
};
