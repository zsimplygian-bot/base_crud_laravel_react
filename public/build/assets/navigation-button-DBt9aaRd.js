import{e as m,j as t,L as r}from"./app-CTHJeX1L.js";import{a as u,B as c}from"./button-COEW_BXt.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],x=u("ArrowLeft",d),i="lastPage";function h({href:e,label:a,icon:s,className:n}){const{url:o}=m(),l=()=>{localStorage.setItem(i,o)};return t.jsx(r,{href:e,onClick:l,children:t.jsxs(c,{size:"sm",variant:"outline",className:`gap-1 text-sm ${n||""}`,children:[s,a]})})}function g({label:e,icon:a,className:s,fallback:n="/"}){const o=typeof window<"u"?localStorage.getItem(i):null;return t.jsx(r,{href:o||n,children:t.jsxs(c,{size:"sm",variant:"outline",className:`gap-1 text-sm ${s||""}`,children:[a||t.jsx(x,{className:"w-4 h-4 opacity-80 hover:opacity-100 transition"}),e]})})}export{x as A,g as B,h as F};
