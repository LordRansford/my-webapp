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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ pageWrapperTemplate),\n/* harmony export */   getServerSideProps: () => (/* binding */ getServerSideProps),\n/* harmony export */   getStaticProps: () => (/* binding */ getStaticProps)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/document */ \"(pages-dir-node)/./node_modules/next/document.js\");\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_document__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/nextjs */ \"@sentry/nextjs\");\n/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\nfunction Document() {\n    const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.Html, {\n        lang: \"en\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.Head, {\n                children: plausibleDomain && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"script\", {\n                    async: true,\n                    defer: true,\n                    \"data-domain\": plausibleDomain,\n                    src: \"https://plausible.io/js/script.tagged-events.js\"\n                }, void 0, false, {\n                    fileName: \"/workspace/src/pages/_document.js\",\n                    lineNumber: 10,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"/workspace/src/pages/_document.js\",\n                lineNumber: 8,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"body\", {\n                className: \"antialiased\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.Main, {}, void 0, false, {\n                        fileName: \"/workspace/src/pages/_document.js\",\n                        lineNumber: 19,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.NextScript, {}, void 0, false, {\n                        fileName: \"/workspace/src/pages/_document.js\",\n                        lineNumber: 20,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/workspace/src/pages/_document.js\",\n                lineNumber: 18,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/workspace/src/pages/_document.js\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n\nvar serverComponentModule = /*#__PURE__*/Object.freeze({\n    __proto__: null,\n    default: Document\n});\n\n/*\n * This file is a template for the code which will be substituted when our webpack loader handles non-API files in the\n * `pages/` directory.\n *\n * We use `__SENTRY_WRAPPING_TARGET_FILE__.cjs` as a placeholder for the path to the file being wrapped. Because it's not a real package,\n * this causes both TS and ESLint to complain, hence the pragma comments below.\n */\n\n\nconst userPageModule = serverComponentModule ;\n\nconst pageComponent = userPageModule ? userPageModule.default : undefined;\n\nconst origGetInitialProps = pageComponent ? pageComponent.getInitialProps : undefined;\nconst origGetStaticProps = userPageModule ? userPageModule.getStaticProps : undefined;\nconst origGetServerSideProps = userPageModule ? userPageModule.getServerSideProps : undefined;\n\n// Rollup will aggressively tree-shake what it perceives to be unused properties\n// on objects. Because the key that's used to index into this object (/_document)\n// is replaced during bundling, Rollup can't see that these properties are in fact\n// used. Using `Object.freeze` signals to Rollup that it should not tree-shake\n// this object.\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nconst getInitialPropsWrappers = Object.freeze({\n  '/_app': _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.wrapAppGetInitialPropsWithSentry,\n  '/_document': _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.wrapDocumentGetInitialPropsWithSentry,\n  '/_error': _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.wrapErrorGetInitialPropsWithSentry,\n});\n\nconst getInitialPropsWrapper = getInitialPropsWrappers['/_document'] || _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.wrapGetInitialPropsWithSentry;\n\nif (pageComponent && typeof origGetInitialProps === 'function') {\n  pageComponent.getInitialProps = getInitialPropsWrapper(origGetInitialProps) ;\n}\n\nconst getStaticProps =\n  typeof origGetStaticProps === 'function'\n    ? _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.wrapGetStaticPropsWithSentry(origGetStaticProps, '/_document')\n    : undefined;\nconst getServerSideProps =\n  typeof origGetServerSideProps === 'function'\n    ? _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.wrapGetServerSidePropsWithSentry(origGetServerSideProps, '/_document')\n    : undefined;\n\nconst pageWrapperTemplate = pageComponent ? _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.wrapPageComponentWithSentry(pageComponent ) : pageComponent;\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9wYWdlcy9fZG9jdW1lbnQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUVlLFNBQVNBLFFBQUFBLEdBQUFBO0FBQ3RCLFVBQU1DLGVBQUFBLEdBQWtCQyxPQUFBQSxDQUFRQyxHQUFHLENBQUNDLDRCQUE0QjtBQUVoRSx5QkFDRUMsNkRBQUEsQ0FBQ0MsK0NBQUFBLEVBQUFBO1FBQUtDLElBQUFBLEVBQUs7OzBCQUNURiw2REFBQSxDQUFDRywrQ0FBQUEsRUFBQUE7QUFDRVAsZ0JBQUFBLFFBQUFBLEVBQUFBLGVBQUFBLGtCQUNDSSw2REFBQSxDQUFDSSxRQUFBQSxFQUFBQTtvQkFDQ0MsS0FBSztvQkFDTEMsS0FBSztvQkFDTEMsYUFBQUEsRUFBYVgsZUFBQUE7b0JBQ2JZLEdBQUFBLEVBQUk7Ozs7Ozs7Ozs7OzBCQUlWUiw2REFBQSxDQUFDUyxNQUFBQSxFQUFBQTtnQkFBS0MsU0FBQUEsRUFBVTs7a0NBQ2RWLDZEQUFBLENBQUNXLCtDQUFBQSxFQUFBQSxFQUFBQSxFQUFBQSxNQUFBQSxFQUFBQSxLQUFBQSxFQUFBQTs7Ozs7a0NBQ0RYLDZEQUFBLENBQUNZLHFEQUFBQSxFQUFBQSxFQUFBQSxFQUFBQSxNQUFBQSxFQUFBQSxLQUFBQSxFQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJVDs7Ozs7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0EsTUFBTSxjQUFjLEdBQUcscUJBQXFCOztBQUU1QyxNQUFNLGFBQWEsR0FBRyxjQUFjLEdBQUcsY0FBYyxDQUFDLE9BQU8sR0FBRyxTQUFTOztBQUV6RSxNQUFNLG1CQUFtQixHQUFHLGFBQWEsR0FBRyxhQUFhLENBQUMsZUFBZSxHQUFHLFNBQVM7QUFDckYsTUFBTSxrQkFBa0IsR0FBRyxjQUFjLEdBQUcsY0FBYyxDQUFDLGNBQWMsR0FBRyxTQUFTO0FBQ3JGLE1BQU0sc0JBQXNCLEdBQUcsY0FBYyxHQUFHLGNBQWMsQ0FBQyxrQkFBa0IsR0FBRyxTQUFTOztBQUU3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLHVCQUF1QixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDOUMsRUFBRSxPQUFPLEVBQUUsNEVBQXVDO0FBQ2xELEVBQUUsWUFBWSxFQUFFLGlGQUE0QztBQUM1RCxFQUFFLFNBQVMsRUFBRSw4RUFBeUM7QUFDdEQsQ0FBQyxDQUFDOztBQUVGLE1BQU0sc0JBQXNCLEdBQUcsdUJBQXVCLENBQUMsWUFBWSxDQUFDLElBQUkseUVBQW9DOztBQUU1RyxJQUFJLGFBQWEsSUFBSSxPQUFPLG1CQUFtQixLQUFLLFVBQVUsRUFBRTtBQUNoRSxFQUFFLGFBQWEsQ0FBQyxlQUFlLEdBQUcsc0JBQXNCLENBQUMsbUJBQW1CLENBQUM7QUFDN0U7O0FBRUssTUFBQyxjQUFjO0FBQ3BCLEVBQUUsT0FBTyxrQkFBa0IsS0FBSztBQUNoQyxNQUFNLHdFQUFtQyxDQUFDLGtCQUFrQixFQUFFLFlBQVk7QUFDMUUsTUFBTTtBQUNELE1BQUMsa0JBQWtCO0FBQ3hCLEVBQUUsT0FBTyxzQkFBc0IsS0FBSztBQUNwQyxNQUFNLDRFQUF1QyxDQUFDLHNCQUFzQixFQUFFLFlBQVk7QUFDbEYsTUFBTTs7QUFFRCxNQUFDLG1CQUFtQixHQUFHLGFBQWEsR0FBRyx1RUFBa0MsQ0FBQyxhQUFhLEVBQUUsR0FBRyIsInNvdXJjZXMiOlsic3JjL3BhZ2VzL19kb2N1bWVudC5qcyIsInNlbnRyeS13cmFwcGVyLW1vZHVsZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdG1sLCBIZWFkLCBNYWluLCBOZXh0U2NyaXB0IH0gZnJvbSBcIm5leHQvZG9jdW1lbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRG9jdW1lbnQoKSB7XG4gIGNvbnN0IHBsYXVzaWJsZURvbWFpbiA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1BMQVVTSUJMRV9ET01BSU47XG5cbiAgcmV0dXJuIChcbiAgICA8SHRtbCBsYW5nPVwiZW5cIj5cbiAgICAgIDxIZWFkPlxuICAgICAgICB7cGxhdXNpYmxlRG9tYWluICYmIChcbiAgICAgICAgICA8c2NyaXB0XG4gICAgICAgICAgICBhc3luY1xuICAgICAgICAgICAgZGVmZXJcbiAgICAgICAgICAgIGRhdGEtZG9tYWluPXtwbGF1c2libGVEb21haW59XG4gICAgICAgICAgICBzcmM9XCJodHRwczovL3BsYXVzaWJsZS5pby9qcy9zY3JpcHQudGFnZ2VkLWV2ZW50cy5qc1wiXG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvSGVhZD5cbiAgICAgIDxib2R5IGNsYXNzTmFtZT1cImFudGlhbGlhc2VkXCI+XG4gICAgICAgIDxNYWluIC8+XG4gICAgICAgIDxOZXh0U2NyaXB0IC8+XG4gICAgICA8L2JvZHk+XG4gICAgPC9IdG1sPlxuICApO1xufVxuIiwiaW1wb3J0ICogYXMgc2VydmVyQ29tcG9uZW50TW9kdWxlIGZyb20gJ19fU0VOVFJZX1dSQVBQSU5HX1RBUkdFVF9GSUxFX18uY2pzJztcbmV4cG9ydCAqIGZyb20gJ19fU0VOVFJZX1dSQVBQSU5HX1RBUkdFVF9GSUxFX18uY2pzJztcbmltcG9ydCAqIGFzIFNlbnRyeSBmcm9tICdAc2VudHJ5L25leHRqcyc7XG5cbi8qXG4gKiBUaGlzIGZpbGUgaXMgYSB0ZW1wbGF0ZSBmb3IgdGhlIGNvZGUgd2hpY2ggd2lsbCBiZSBzdWJzdGl0dXRlZCB3aGVuIG91ciB3ZWJwYWNrIGxvYWRlciBoYW5kbGVzIG5vbi1BUEkgZmlsZXMgaW4gdGhlXG4gKiBgcGFnZXMvYCBkaXJlY3RvcnkuXG4gKlxuICogV2UgdXNlIGBfX1NFTlRSWV9XUkFQUElOR19UQVJHRVRfRklMRV9fLmNqc2AgYXMgYSBwbGFjZWhvbGRlciBmb3IgdGhlIHBhdGggdG8gdGhlIGZpbGUgYmVpbmcgd3JhcHBlZC4gQmVjYXVzZSBpdCdzIG5vdCBhIHJlYWwgcGFja2FnZSxcbiAqIHRoaXMgY2F1c2VzIGJvdGggVFMgYW5kIEVTTGludCB0byBjb21wbGFpbiwgaGVuY2UgdGhlIHByYWdtYSBjb21tZW50cyBiZWxvdy5cbiAqL1xuXG5cbmNvbnN0IHVzZXJQYWdlTW9kdWxlID0gc2VydmVyQ29tcG9uZW50TW9kdWxlIDtcblxuY29uc3QgcGFnZUNvbXBvbmVudCA9IHVzZXJQYWdlTW9kdWxlID8gdXNlclBhZ2VNb2R1bGUuZGVmYXVsdCA6IHVuZGVmaW5lZDtcblxuY29uc3Qgb3JpZ0dldEluaXRpYWxQcm9wcyA9IHBhZ2VDb21wb25lbnQgPyBwYWdlQ29tcG9uZW50LmdldEluaXRpYWxQcm9wcyA6IHVuZGVmaW5lZDtcbmNvbnN0IG9yaWdHZXRTdGF0aWNQcm9wcyA9IHVzZXJQYWdlTW9kdWxlID8gdXNlclBhZ2VNb2R1bGUuZ2V0U3RhdGljUHJvcHMgOiB1bmRlZmluZWQ7XG5jb25zdCBvcmlnR2V0U2VydmVyU2lkZVByb3BzID0gdXNlclBhZ2VNb2R1bGUgPyB1c2VyUGFnZU1vZHVsZS5nZXRTZXJ2ZXJTaWRlUHJvcHMgOiB1bmRlZmluZWQ7XG5cbi8vIFJvbGx1cCB3aWxsIGFnZ3Jlc3NpdmVseSB0cmVlLXNoYWtlIHdoYXQgaXQgcGVyY2VpdmVzIHRvIGJlIHVudXNlZCBwcm9wZXJ0aWVzXG4vLyBvbiBvYmplY3RzLiBCZWNhdXNlIHRoZSBrZXkgdGhhdCdzIHVzZWQgdG8gaW5kZXggaW50byB0aGlzIG9iamVjdCAoL19kb2N1bWVudClcbi8vIGlzIHJlcGxhY2VkIGR1cmluZyBidW5kbGluZywgUm9sbHVwIGNhbid0IHNlZSB0aGF0IHRoZXNlIHByb3BlcnRpZXMgYXJlIGluIGZhY3Rcbi8vIHVzZWQuIFVzaW5nIGBPYmplY3QuZnJlZXplYCBzaWduYWxzIHRvIFJvbGx1cCB0aGF0IGl0IHNob3VsZCBub3QgdHJlZS1zaGFrZVxuLy8gdGhpcyBvYmplY3QuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuY29uc3QgZ2V0SW5pdGlhbFByb3BzV3JhcHBlcnMgPSBPYmplY3QuZnJlZXplKHtcbiAgJy9fYXBwJzogU2VudHJ5LndyYXBBcHBHZXRJbml0aWFsUHJvcHNXaXRoU2VudHJ5LFxuICAnL19kb2N1bWVudCc6IFNlbnRyeS53cmFwRG9jdW1lbnRHZXRJbml0aWFsUHJvcHNXaXRoU2VudHJ5LFxuICAnL19lcnJvcic6IFNlbnRyeS53cmFwRXJyb3JHZXRJbml0aWFsUHJvcHNXaXRoU2VudHJ5LFxufSk7XG5cbmNvbnN0IGdldEluaXRpYWxQcm9wc1dyYXBwZXIgPSBnZXRJbml0aWFsUHJvcHNXcmFwcGVyc1snL19kb2N1bWVudCddIHx8IFNlbnRyeS53cmFwR2V0SW5pdGlhbFByb3BzV2l0aFNlbnRyeTtcblxuaWYgKHBhZ2VDb21wb25lbnQgJiYgdHlwZW9mIG9yaWdHZXRJbml0aWFsUHJvcHMgPT09ICdmdW5jdGlvbicpIHtcbiAgcGFnZUNvbXBvbmVudC5nZXRJbml0aWFsUHJvcHMgPSBnZXRJbml0aWFsUHJvcHNXcmFwcGVyKG9yaWdHZXRJbml0aWFsUHJvcHMpIDtcbn1cblxuY29uc3QgZ2V0U3RhdGljUHJvcHMgPVxuICB0eXBlb2Ygb3JpZ0dldFN0YXRpY1Byb3BzID09PSAnZnVuY3Rpb24nXG4gICAgPyBTZW50cnkud3JhcEdldFN0YXRpY1Byb3BzV2l0aFNlbnRyeShvcmlnR2V0U3RhdGljUHJvcHMsICcvX2RvY3VtZW50JylcbiAgICA6IHVuZGVmaW5lZDtcbmNvbnN0IGdldFNlcnZlclNpZGVQcm9wcyA9XG4gIHR5cGVvZiBvcmlnR2V0U2VydmVyU2lkZVByb3BzID09PSAnZnVuY3Rpb24nXG4gICAgPyBTZW50cnkud3JhcEdldFNlcnZlclNpZGVQcm9wc1dpdGhTZW50cnkob3JpZ0dldFNlcnZlclNpZGVQcm9wcywgJy9fZG9jdW1lbnQnKVxuICAgIDogdW5kZWZpbmVkO1xuXG5jb25zdCBwYWdlV3JhcHBlclRlbXBsYXRlID0gcGFnZUNvbXBvbmVudCA/IFNlbnRyeS53cmFwUGFnZUNvbXBvbmVudFdpdGhTZW50cnkocGFnZUNvbXBvbmVudCApIDogcGFnZUNvbXBvbmVudDtcblxuZXhwb3J0IHsgcGFnZVdyYXBwZXJUZW1wbGF0ZSBhcyBkZWZhdWx0LCBnZXRTZXJ2ZXJTaWRlUHJvcHMsIGdldFN0YXRpY1Byb3BzIH07XG4iXSwibmFtZXMiOlsiRG9jdW1lbnQiLCJwbGF1c2libGVEb21haW4iLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfUExBVVNJQkxFX0RPTUFJTiIsIl9qc3hERVYiLCJIdG1sIiwibGFuZyIsIkhlYWQiLCJzY3JpcHQiLCJhc3luYyIsImRlZmVyIiwiZGF0YS1kb21haW4iLCJzcmMiLCJib2R5IiwiY2xhc3NOYW1lIiwiTWFpbiIsIk5leHRTY3JpcHQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/pages/_document.js\n");

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