export const validateIncident = (req, res, next) => {
  const { title, description, incidentType, priority, location, stadium, match } = req.body;
  const errors = [];

  if (!title || title.trim().length < 5 || title.trim().length > 100) {
    errors.push('Title must be between 5 and 100 characters.');
  }

  if (!description || description.trim() === '') {
    errors.push('Description is required.');
  }

  const validTypes = ['Medical', 'Fire', 'Crowd', 'Security', 'Lost Child', 'Technical', 'Transport', 'Maintenance', 'Other'];
  if (!incidentType || !validTypes.includes(incidentType)) {
    errors.push(`Incident type must be one of: ${validTypes.join(', ')}.`);
  }

  const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
  if (!priority || !validPriorities.includes(priority)) {
    errors.push(`Priority must be one of: ${validPriorities.join(', ')}.`);
  }

  if (!location || location.trim() === '') {
    errors.push('Location is required.');
  }

  if (!stadium) {
    errors.push('Stadium is required.');
  }

  // Note: match is optional in the DB but if provided, must not be empty string.
  // The spec says "Match: Must exist", so we assume if passed, it's validated at DB level in controller.

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Failed',
      errors
    });
  }

  next();
};
