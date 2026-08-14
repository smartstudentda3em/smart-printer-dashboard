import { r as __toESM } from "../_runtime.mjs";
import { l as setToken, s as login, t as ApiError } from "./api-BO16JMcg.mjs";
import { C as require_jsx_runtime, w as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { P as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as LoaderCircle, l as LogIn } from "../_libs/lucide-react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, o as Input, r as CardDescription, s as Label, t as Card } from "./label-BTM8KNNw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BsH8OiO7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [fieldErrors, setFieldErrors] = (0, import_react.useState)({});
	async function onSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setFieldErrors({});
		try {
			const res = await login(email, password);
			setToken(res.data.token);
			toast.success(res.message || "Logged in");
			navigate({
				to: "/products",
				replace: true
			});
		} catch (err) {
			if (err instanceof ApiError) {
				if (err.errors) setFieldErrors(err.errors);
				toast.error(err.message);
			} else toast.error("Login failed");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-muted/30 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-center text-xl",
						children: "Admin Login"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
						className: "text-center",
						children: "Sign in to manage products and settings"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								autoComplete: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								disabled: loading
							}),
							fieldErrors.email?.[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-destructive",
								children: fieldErrors.email[0]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "password",
								children: "Password"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: "password",
								autoComplete: "current-password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								disabled: loading
							}),
							fieldErrors.password?.[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-destructive",
								children: fieldErrors.password[0]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						className: "w-full",
						disabled: loading,
						children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Sign in"]
					})
				]
			}) })]
		})
	});
}
//#endregion
export { LoginPage as component };
