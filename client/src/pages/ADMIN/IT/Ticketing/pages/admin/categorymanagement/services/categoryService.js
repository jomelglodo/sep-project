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

function callApi(endpoint, { id, body } = {}) {
  let url = endpoint.url;

  if (id !== undefined && url.includes(":id")) {
    url = url.replace(":id", id);
  }

  return request(url, {
    method: endpoint.method,
    ...(body && {
      body: JSON.stringify(body),
    }),
  });
}

export const categoryService = {
  getAll(config) {
    return callApi(config.api.getAll);
  },

  create(config, body) {
    return callApi(config.api.create, {
      body,
    });
  },

  update(config, id, body) {
    return callApi(config.api.update, {
      id,
      body,
    });
  },

  delete(config, id) {
    return callApi(config.api.delete, {
      id,
    });
  },
};
