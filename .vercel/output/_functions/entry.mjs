import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_pt2J26qg.mjs';
import { manifest } from './manifest_DPXqgHeI.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/capture-lead.astro.mjs');
const _page2 = () => import('./pages/empresarial.astro.mjs');
const _page3 = () => import('./pages/pad.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/capture-lead.ts", _page1],
    ["src/pages/empresarial.astro", _page2],
    ["src/pages/pad.astro", _page3]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "f33efc69-58fe-4391-9d8f-578ce9fcf738",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
