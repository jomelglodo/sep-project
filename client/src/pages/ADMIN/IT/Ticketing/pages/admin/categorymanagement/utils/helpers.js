export function getCategoryName(config, row) {
  return row[config.nameField];
}

export function sortAlphabetically(data, field) {
  return [...data].sort((a, b) => a[field].localeCompare(b[field]));
}
