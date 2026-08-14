import { a as getToken } from "./api-BO16JMcg.mjs";
import { C as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { N as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CuDRqvm5.js
var import_jsx_runtime = require_jsx_runtime();
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: getToken() ? "/products" : "/login",
		replace: true
	});
}
//#endregion
export { Index as component };
