export function validateCategory(config, values) {
  const errors = {};

  const field = config.nameField;

  if (!values[field]?.trim()) {
    errors[field] = `${config.singular} name is required.`;
  }

  return errors;
}
