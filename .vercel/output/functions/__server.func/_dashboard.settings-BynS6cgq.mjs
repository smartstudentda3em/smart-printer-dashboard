import { r as __toESM } from "./_runtime.mjs";
import { d as updateSettings, i as getSettings, t as ApiError } from "./_ssr/api-BO16JMcg.mjs";
import { C as require_jsx_runtime, w as require_react } from "./_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./_ssr/button-PwNqyxv_.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { a as Save, d as LoaderCircle } from "./_libs/lucide-react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, o as Input, r as CardDescription, s as Label, t as Card } from "./_ssr/label-BTM8KNNw.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dashboard.settings-BynS6cgq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const qc = useQueryClient();
	const { data, isLoading, error } = useQuery({
		queryKey: ["settings"],
		queryFn: () => getSettings().then((r) => r.data)
	});
	const [form, setForm] = (0, import_react.useState)({
		paper_price: 0,
		delivery_price: 0,
		whatsapp_number: ""
	});
	const [fieldErrors, setFieldErrors] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (data) setForm(data);
	}, [data]);
	const mutation = useMutation({
		mutationFn: (payload) => updateSettings(payload),
		onSuccess: (res) => {
			toast.success(res.message || "Saved");
			setFieldErrors({});
			qc.setQueryData(["settings"], res.data);
		},
		onError: (err) => {
			if (err instanceof ApiError) {
				if (err.errors) setFieldErrors(err.errors);
				toast.error(err.message);
			} else toast.error("Failed to update settings");
		}
	});
	function onSubmit(e) {
		e.preventDefault();
		mutation.mutate({
			paper_price: Number(form.paper_price),
			delivery_price: Number(form.delivery_price),
			whatsapp_number: form.whatsapp_number
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold",
			children: "Settings"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Pricing and contact information."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "General" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "These values are shown to customers." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 py-6 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Loading…"]
		}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-destructive",
			children: "Failed to load settings."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "paper_price",
								children: "Paper price"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "paper_price",
								type: "number",
								step: "0.01",
								min: "0",
								value: form.paper_price,
								onChange: (e) => setForm((f) => ({
									...f,
									paper_price: Number(e.target.value)
								}))
							}),
							fieldErrors.paper_price?.[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-destructive",
								children: fieldErrors.paper_price[0]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "delivery_price",
								children: "Delivery price"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "delivery_price",
								type: "number",
								step: "0.01",
								min: "0",
								value: form.delivery_price,
								onChange: (e) => setForm((f) => ({
									...f,
									delivery_price: Number(e.target.value)
								}))
							}),
							fieldErrors.delivery_price?.[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-destructive",
								children: fieldErrors.delivery_price[0]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "whatsapp_number",
							children: "WhatsApp number"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "whatsapp_number",
							type: "tel",
							placeholder: "+201234567890",
							value: form.whatsapp_number,
							onChange: (e) => setForm((f) => ({
								...f,
								whatsapp_number: e.target.value
							}))
						}),
						fieldErrors.whatsapp_number?.[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: fieldErrors.whatsapp_number[0]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: mutation.isPending,
						children: [mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), "Save changes"]
					})
				})
			]
		}) })] })]
	});
}
//#endregion
export { SettingsPage as component };
