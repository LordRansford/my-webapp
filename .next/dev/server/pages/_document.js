"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_document";
exports.ids = ["pages/_document"];
exports.modules = {

/***/ "(pages-dir-node)/./src/pages/_document.js":
/*!********************************!*\
  !*** ./src/pages/_document.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ pageWrapperTemplate),\n/* harmony export */   getServerSideProps: () => (/* binding */ getServerSideProps),\n/* harmony export */   getStaticProps: () => (/* binding */ getStaticProps)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/document */ \"(pages-dir-node)/./node_modules/next/document.js\");\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_document__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/nextjs */ \"@sentry/nextjs\");\n/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\nfunction Document() {\n    const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.Html, {\n        lang: \"en\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.Head, {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"viewport\",\n                        content: \"width=device-width, initial-scale=1, viewport-fit=cover\"\n                    }, void 0, false, {\n                        fileName: \"/workspace/src/pages/_document.js\",\n                        lineNumber: 9,\n                        columnNumber: 9\n                    }, this),\n                    plausibleDomain && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"script\", {\n                        async: true,\n                        defer: true,\n                        \"data-domain\": plausibleDomain,\n                        src: \"https://plausible.io/js/script.tagged-events.js\"\n                    }, void 0, false, {\n                        fileName: \"/workspace/src/pages/_document.js\",\n                        lineNumber: 11,\n                        columnNumber: 11\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/workspace/src/pages/_document.js\",\n                lineNumber: 8,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"body\", {\n                className: \"antialiased\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.Main, {}, void 0, false, {\n                        fileName: \"/workspace/src/pages/_document.js\",\n                        lineNumber: 20,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.NextScript, {}, void 0, false, {\n                        fileName: \"/workspace/src/pages/_document.js\",\n                        lineNumber: 21,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/workspace/src/pages/_document.js\",\n                lineNumber: 19,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/workspace/src/pages/_document.js\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n\nvar serverComponentModule = /*#__PURE__*/Object.freeze({\n    __proto__: null,\n    default: Document\n});\n\n/*\n * This file is a template for the code which will be substituted when our webpack loader handles non-API files in the\n * `pages/` directory.\n *\n * We use `__SENTRY_WRAPPING_TARGET_FILE__.cjs` as a placeholder for the path to the file being wrapped. Because it's not a real package,\n * this causes both TS and ESLint to complain, hence the pragma comments below.\n */\n\n\nconst userPageModule = serverComponentModule ;\n\nconst pageComponent = userPageModule ? userPageModule.default : undefined;\n\nconst origGetInitialProps = pageComponent ? pageComponent.getInitialProps : undefined;\nconst origGetStaticProps = userPageModule ? userPageModule.getStaticProps : undefined;\nconst origGetServerSideProps = userPageModule ? userPageModule.getServerSideProps : undefined;\n\n// Rollup will aggressively tree-shake what it perceives to be unused properties\n// on objects. Because the key that's used to index into this object (/_document)\n// is replaced during bundling, Rollup can't see that these properties are in fact\n// used. Using `Object.freeze` signals to Rollup that it should not tree-shake\n// this object.\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nconst getInitialPropsWrappers = Object.freeze({\n  '/_app': _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.wrapAppGetInitialPropsWithSentry,\n  '/_document': _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.wrapDocumentGetInitialPropsWithSentry,\n  '/_error': _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.wrapErrorGetInitialPropsWithSentry,\n});\n\nconst getInitialPropsWrapper = getInitialPropsWrappers['/_document'] || _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.wrapGetInitialPropsWithSentry;\n\nif (pageComponent && typeof origGetInitialProps === 'function') {\n  pageComponent.getInitialProps = getInitialPropsWrapper(origGetInitialProps) ;\n}\n\nconst getStaticProps =\n  typeof origGetStaticProps === 'function'\n    ? _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.wrapGetStaticPropsWithSentry(origGetStaticProps, '/_document')\n    : undefined;\nconst getServerSideProps =\n  typeof origGetServerSideProps === 'function'\n    ? _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.wrapGetServerSidePropsWithSentry(origGetServerSideProps, '/_document')\n    : undefined;\n\nconst pageWrapperTemplate = pageComponent ? _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.wrapPageComponentWithSentry(pageComponent ) : pageComponent;\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9wYWdlcy9fZG9jdW1lbnQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUVlLFNBQVNBLFFBQUFBLEdBQUFBO0FBQ3RCLFVBQU1DLGVBQUFBLEdBQWtCQyxPQUFBQSxDQUFRQyxHQUFHLENBQUNDLDRCQUE0QjtBQUVoRSx5QkFDRUMsNkRBQUEsQ0FBQ0MsK0NBQUFBLEVBQUFBO1FBQUtDLElBQUFBLEVBQUs7OzBCQUNURiw2REFBQSxDQUFDRywrQ0FBQUEsRUFBQUE7O2tDQUNDSCw2REFBQSxDQUFDSSxNQUFBQSxFQUFBQTt3QkFBS0MsSUFBQUEsRUFBSzt3QkFBV0MsT0FBQUEsRUFBUTs7Ozs7O0FBQzdCVixvQkFBQUEsZUFBQUEsa0JBQ0NJLDZEQUFBLENBQUNPLFFBQUFBLEVBQUFBO3dCQUNDQyxLQUFLO3dCQUNMQyxLQUFLO3dCQUNMQyxhQUFBQSxFQUFhZCxlQUFBQTt3QkFDYmUsR0FBQUEsRUFBSTs7Ozs7Ozs7Ozs7OzBCQUlWWCw2REFBQSxDQUFDWSxNQUFBQSxFQUFBQTtnQkFBS0MsU0FBQUEsRUFBVTs7a0NBQ2RiLDZEQUFBLENBQUNjLCtDQUFBQSxFQUFBQSxFQUFBQSxFQUFBQSxNQUFBQSxFQUFBQSxLQUFBQSxFQUFBQTs7Ozs7a0NBQ0RkLDZEQUFBLENBQUNlLHFEQUFBQSxFQUFBQSxFQUFBQSxFQUFBQSxNQUFBQSxFQUFBQSxLQUFBQSxFQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJVDs7Ozs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0EsTUFBTSxjQUFjLEdBQUcscUJBQXFCOztBQUU1QyxNQUFNLGFBQWEsR0FBRyxjQUFjLEdBQUcsY0FBYyxDQUFDLE9BQU8sR0FBRyxTQUFTOztBQUV6RSxNQUFNLG1CQUFtQixHQUFHLGFBQWEsR0FBRyxhQUFhLENBQUMsZUFBZSxHQUFHLFNBQVM7QUFDckYsTUFBTSxrQkFBa0IsR0FBRyxjQUFjLEdBQUcsY0FBYyxDQUFDLGNBQWMsR0FBRyxTQUFTO0FBQ3JGLE1BQU0sc0JBQXNCLEdBQUcsY0FBYyxHQUFHLGNBQWMsQ0FBQyxrQkFBa0IsR0FBRyxTQUFTOztBQUU3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLHVCQUF1QixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDOUMsRUFBRSxPQUFPLEVBQUUsNEVBQXVDO0FBQ2xELEVBQUUsWUFBWSxFQUFFLGlGQUE0QztBQUM1RCxFQUFFLFNBQVMsRUFBRSw4RUFBeUM7QUFDdEQsQ0FBQyxDQUFDOztBQUVGLE1BQU0sc0JBQXNCLEdBQUcsdUJBQXVCLENBQUMsWUFBWSxDQUFDLElBQUkseUVBQW9DOztBQUU1RyxJQUFJLGFBQWEsSUFBSSxPQUFPLG1CQUFtQixLQUFLLFVBQVUsRUFBRTtBQUNoRSxFQUFFLGFBQWEsQ0FBQyxlQUFlLEdBQUcsc0JBQXNCLENBQUMsbUJBQW1CLENBQUM7QUFDN0U7O0FBRUssTUFBQyxjQUFjO0FBQ3BCLEVBQUUsT0FBTyxrQkFBa0IsS0FBSztBQUNoQyxNQUFNLHdFQUFtQyxDQUFDLGtCQUFrQixFQUFFLFlBQVk7QUFDMUUsTUFBTTtBQUNELE1BQUMsa0JBQWtCO0FBQ3hCLEVBQUUsT0FBTyxzQkFBc0IsS0FBSztBQUNwQyxNQUFNLDRFQUF1QyxDQUFDLHNCQUFzQixFQUFFLFlBQVk7QUFDbEYsTUFBTTs7QUFFRCxNQUFDLG1CQUFtQixHQUFHLGFBQWEsR0FBRyx1RUFBa0MsQ0FBQyxhQUFhLEVBQUUsR0FBRyIsInNvdXJjZXMiOlsic3JjL3BhZ2VzL19kb2N1bWVudC5qcyIsInNlbnRyeS13cmFwcGVyLW1vZHVsZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdG1sLCBIZWFkLCBNYWluLCBOZXh0U2NyaXB0IH0gZnJvbSBcIm5leHQvZG9jdW1lbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRG9jdW1lbnQoKSB7XG4gIGNvbnN0IHBsYXVzaWJsZURvbWFpbiA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1BMQVVTSUJMRV9ET01BSU47XG5cbiAgcmV0dXJuIChcbiAgICA8SHRtbCBsYW5nPVwiZW5cIj5cbiAgICAgIDxIZWFkPlxuICAgICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEsIHZpZXdwb3J0LWZpdD1jb3ZlclwiIC8+XG4gICAgICAgIHtwbGF1c2libGVEb21haW4gJiYgKFxuICAgICAgICAgIDxzY3JpcHRcbiAgICAgICAgICAgIGFzeW5jXG4gICAgICAgICAgICBkZWZlclxuICAgICAgICAgICAgZGF0YS1kb21haW49e3BsYXVzaWJsZURvbWFpbn1cbiAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vcGxhdXNpYmxlLmlvL2pzL3NjcmlwdC50YWdnZWQtZXZlbnRzLmpzXCJcbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9IZWFkPlxuICAgICAgPGJvZHkgY2xhc3NOYW1lPVwiYW50aWFsaWFzZWRcIj5cbiAgICAgICAgPE1haW4gLz5cbiAgICAgICAgPE5leHRTY3JpcHQgLz5cbiAgICAgIDwvYm9keT5cbiAgICA8L0h0bWw+XG4gICk7XG59XG4iLCJpbXBvcnQgKiBhcyBzZXJ2ZXJDb21wb25lbnRNb2R1bGUgZnJvbSAnX19TRU5UUllfV1JBUFBJTkdfVEFSR0VUX0ZJTEVfXy5janMnO1xuZXhwb3J0ICogZnJvbSAnX19TRU5UUllfV1JBUFBJTkdfVEFSR0VUX0ZJTEVfXy5janMnO1xuaW1wb3J0ICogYXMgU2VudHJ5IGZyb20gJ0BzZW50cnkvbmV4dGpzJztcblxuLypcbiAqIFRoaXMgZmlsZSBpcyBhIHRlbXBsYXRlIGZvciB0aGUgY29kZSB3aGljaCB3aWxsIGJlIHN1YnN0aXR1dGVkIHdoZW4gb3VyIHdlYnBhY2sgbG9hZGVyIGhhbmRsZXMgbm9uLUFQSSBmaWxlcyBpbiB0aGVcbiAqIGBwYWdlcy9gIGRpcmVjdG9yeS5cbiAqXG4gKiBXZSB1c2UgYF9fU0VOVFJZX1dSQVBQSU5HX1RBUkdFVF9GSUxFX18uY2pzYCBhcyBhIHBsYWNlaG9sZGVyIGZvciB0aGUgcGF0aCB0byB0aGUgZmlsZSBiZWluZyB3cmFwcGVkLiBCZWNhdXNlIGl0J3Mgbm90IGEgcmVhbCBwYWNrYWdlLFxuICogdGhpcyBjYXVzZXMgYm90aCBUUyBhbmQgRVNMaW50IHRvIGNvbXBsYWluLCBoZW5jZSB0aGUgcHJhZ21hIGNvbW1lbnRzIGJlbG93LlxuICovXG5cblxuY29uc3QgdXNlclBhZ2VNb2R1bGUgPSBzZXJ2ZXJDb21wb25lbnRNb2R1bGUgO1xuXG5jb25zdCBwYWdlQ29tcG9uZW50ID0gdXNlclBhZ2VNb2R1bGUgPyB1c2VyUGFnZU1vZHVsZS5kZWZhdWx0IDogdW5kZWZpbmVkO1xuXG5jb25zdCBvcmlnR2V0SW5pdGlhbFByb3BzID0gcGFnZUNvbXBvbmVudCA/IHBhZ2VDb21wb25lbnQuZ2V0SW5pdGlhbFByb3BzIDogdW5kZWZpbmVkO1xuY29uc3Qgb3JpZ0dldFN0YXRpY1Byb3BzID0gdXNlclBhZ2VNb2R1bGUgPyB1c2VyUGFnZU1vZHVsZS5nZXRTdGF0aWNQcm9wcyA6IHVuZGVmaW5lZDtcbmNvbnN0IG9yaWdHZXRTZXJ2ZXJTaWRlUHJvcHMgPSB1c2VyUGFnZU1vZHVsZSA/IHVzZXJQYWdlTW9kdWxlLmdldFNlcnZlclNpZGVQcm9wcyA6IHVuZGVmaW5lZDtcblxuLy8gUm9sbHVwIHdpbGwgYWdncmVzc2l2ZWx5IHRyZWUtc2hha2Ugd2hhdCBpdCBwZXJjZWl2ZXMgdG8gYmUgdW51c2VkIHByb3BlcnRpZXNcbi8vIG9uIG9iamVjdHMuIEJlY2F1c2UgdGhlIGtleSB0aGF0J3MgdXNlZCB0byBpbmRleCBpbnRvIHRoaXMgb2JqZWN0ICgvX2RvY3VtZW50KVxuLy8gaXMgcmVwbGFjZWQgZHVyaW5nIGJ1bmRsaW5nLCBSb2xsdXAgY2FuJ3Qgc2VlIHRoYXQgdGhlc2UgcHJvcGVydGllcyBhcmUgaW4gZmFjdFxuLy8gdXNlZC4gVXNpbmcgYE9iamVjdC5mcmVlemVgIHNpZ25hbHMgdG8gUm9sbHVwIHRoYXQgaXQgc2hvdWxkIG5vdCB0cmVlLXNoYWtlXG4vLyB0aGlzIG9iamVjdC5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG5jb25zdCBnZXRJbml0aWFsUHJvcHNXcmFwcGVycyA9IE9iamVjdC5mcmVlemUoe1xuICAnL19hcHAnOiBTZW50cnkud3JhcEFwcEdldEluaXRpYWxQcm9wc1dpdGhTZW50cnksXG4gICcvX2RvY3VtZW50JzogU2VudHJ5LndyYXBEb2N1bWVudEdldEluaXRpYWxQcm9wc1dpdGhTZW50cnksXG4gICcvX2Vycm9yJzogU2VudHJ5LndyYXBFcnJvckdldEluaXRpYWxQcm9wc1dpdGhTZW50cnksXG59KTtcblxuY29uc3QgZ2V0SW5pdGlhbFByb3BzV3JhcHBlciA9IGdldEluaXRpYWxQcm9wc1dyYXBwZXJzWycvX2RvY3VtZW50J10gfHwgU2VudHJ5LndyYXBHZXRJbml0aWFsUHJvcHNXaXRoU2VudHJ5O1xuXG5pZiAocGFnZUNvbXBvbmVudCAmJiB0eXBlb2Ygb3JpZ0dldEluaXRpYWxQcm9wcyA9PT0gJ2Z1bmN0aW9uJykge1xuICBwYWdlQ29tcG9uZW50LmdldEluaXRpYWxQcm9wcyA9IGdldEluaXRpYWxQcm9wc1dyYXBwZXIob3JpZ0dldEluaXRpYWxQcm9wcykgO1xufVxuXG5jb25zdCBnZXRTdGF0aWNQcm9wcyA9XG4gIHR5cGVvZiBvcmlnR2V0U3RhdGljUHJvcHMgPT09ICdmdW5jdGlvbidcbiAgICA/IFNlbnRyeS53cmFwR2V0U3RhdGljUHJvcHNXaXRoU2VudHJ5KG9yaWdHZXRTdGF0aWNQcm9wcywgJy9fZG9jdW1lbnQnKVxuICAgIDogdW5kZWZpbmVkO1xuY29uc3QgZ2V0U2VydmVyU2lkZVByb3BzID1cbiAgdHlwZW9mIG9yaWdHZXRTZXJ2ZXJTaWRlUHJvcHMgPT09ICdmdW5jdGlvbidcbiAgICA/IFNlbnRyeS53cmFwR2V0U2VydmVyU2lkZVByb3BzV2l0aFNlbnRyeShvcmlnR2V0U2VydmVyU2lkZVByb3BzLCAnL19kb2N1bWVudCcpXG4gICAgOiB1bmRlZmluZWQ7XG5cbmNvbnN0IHBhZ2VXcmFwcGVyVGVtcGxhdGUgPSBwYWdlQ29tcG9uZW50ID8gU2VudHJ5LndyYXBQYWdlQ29tcG9uZW50V2l0aFNlbnRyeShwYWdlQ29tcG9uZW50ICkgOiBwYWdlQ29tcG9uZW50O1xuXG5leHBvcnQgeyBwYWdlV3JhcHBlclRlbXBsYXRlIGFzIGRlZmF1bHQsIGdldFNlcnZlclNpZGVQcm9wcywgZ2V0U3RhdGljUHJvcHMgfTtcbiJdLCJuYW1lcyI6WyJEb2N1bWVudCIsInBsYXVzaWJsZURvbWFpbiIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19QTEFVU0lCTEVfRE9NQUlOIiwiX2pzeERFViIsIkh0bWwiLCJsYW5nIiwiSGVhZCIsIm1ldGEiLCJuYW1lIiwiY29udGVudCIsInNjcmlwdCIsImFzeW5jIiwiZGVmZXIiLCJkYXRhLWRvbWFpbiIsInNyYyIsImJvZHkiLCJjbGFzc05hbWUiLCJNYWluIiwiTmV4dFNjcmlwdCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/pages/_document.js\n");

/***/ }),

/***/ "@opentelemetry/api":
/*!*************************************!*\
  !*** external "@opentelemetry/api" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("@opentelemetry/api");

/***/ }),

/***/ "@sentry/nextjs":
/*!*********************************!*\
  !*** external "@sentry/nextjs" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@sentry/nextjs");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./src/pages/_document.js")));
module.exports = __webpack_exports__;

})();