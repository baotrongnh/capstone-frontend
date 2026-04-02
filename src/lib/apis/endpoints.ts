const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || "";

export const createEndpoints = (resource: string) => {
  return `${API_PREFIX}/${resource}`;
};

export const endpoints = {
  apartments: createEndpoints("apartments"),
  userApartments: createEndpoints("user-apartments"),
  chat: createEndpoints("chat"),
  viewRequest: createEndpoints("viewing-requests"),
  apartmentPolicies: createEndpoints("apartment-policies/apartment"),
  contracts: createEndpoints("contracts"),
  auth: createEndpoints("auth"),
  users: createEndpoints("users"),
  reservations: createEndpoints("reservations"),
  notifications: createEndpoints("notifications"),
  invoices: createEndpoints("invoices"),
  payments: createEndpoints("payments")
};
