const API = process.env.REACT_APP_API_URL;

async function request(endpoint, options = {}) {
  const response = await fetch(`${API}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.message || `HTTP ${response.status}`);
  }

  return data;
}

export const categoryService = {
  getAll(config) {
    return request(config.api.getAll.url, {
      method: config.api.getAll.method,
    });
  },

  create(config, body) {
    return request(config.api.create.url, {
      method: config.api.create.method,
      body: JSON.stringify(body),
    });
  },

  update(config, id, body) {
    const url = config.api.update.url.replace(":id", id);

    return request(url, {
      method: config.api.update.method,
      body: JSON.stringify(body),
    });
  },

  delete(config, id) {
    const url = config.api.delete.url.replace(":id", id);

    return request(url, {
      method: config.api.delete.method,
    });
  },
};
