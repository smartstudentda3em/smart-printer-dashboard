//#region node_modules/.nitro/vite/services/ssr/assets/api-BO16JMcg.js
var API_BASE = "https://whitesmoke-jaguar-842419.hostingersite.com/api";
var TOKEN_KEY = "admin_token";
function getToken() {
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(TOKEN_KEY);
}
function setToken(token) {
	if (typeof window === "undefined") return;
	if (token) window.localStorage.setItem(TOKEN_KEY, token);
	else window.localStorage.removeItem(TOKEN_KEY);
}
var ApiError = class extends Error {
	status;
	errors;
	constructor(message, status, errors) {
		super(message);
		this.status = status;
		this.errors = errors;
	}
};
async function request(path, options = {}) {
	const { method = "GET", body, auth = false, isForm = false } = options;
	const headers = { Accept: "application/json" };
	if (auth) {
		const token = getToken();
		if (token) headers["Authorization"] = `Bearer ${token}`;
	}
	let payload;
	if (body !== void 0) if (isForm && body instanceof FormData) payload = body;
	else {
		headers["Content-Type"] = "application/json";
		payload = JSON.stringify(body);
	}
	const res = await fetch(`${API_BASE}${path}`, {
		method,
		headers,
		body: payload
	});
	let json;
	try {
		json = await res.json();
	} catch {
		throw new ApiError(`Request failed (${res.status})`, res.status);
	}
	if (!res.ok || json.success === false) {
		if (res.status === 401) setToken(null);
		throw new ApiError(json.message || "Request failed", res.status, json.errors);
	}
	return json;
}
var login = (email, password) => request("/dashboard/login", {
	method: "POST",
	body: {
		email,
		password
	}
});
var logout = () => request("/dashboard/logout", {
	method: "POST",
	auth: true
});
var getSettings = () => request("/settings");
var updateSettings = (data) => request("/dashboard/settings", {
	method: "PUT",
	body: data,
	auth: true
});
var listProducts = (page = 1) => request(`/products?page=${page}`);
var createProduct = (form) => request("/dashboard/products", {
	method: "POST",
	body: form,
	auth: true,
	isForm: true
});
var updateProduct = (id, form) => {
	form.append("_method", "PUT");
	return request(`/dashboard/products/${id}`, {
		method: "POST",
		body: form,
		auth: true,
		isForm: true
	});
};
var deleteProduct = (id) => request(`/dashboard/products/${id}`, {
	method: "DELETE",
	auth: true
});
//#endregion
export { getToken as a, logout as c, updateSettings as d, getSettings as i, setToken as l, createProduct as n, listProducts as o, deleteProduct as r, login as s, ApiError as t, updateProduct as u };
