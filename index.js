"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateUrl = exports.Link = exports.withTranslateRoutes = exports.withRouter = exports.useRouter = void 0;
var react_1 = __importDefault(require("react"));
var router_1 = require("next/router");
var router_context_1 = require("next/dist/shared/lib/router-context");
var getEnv_1 = require("./getEnv");
var translateUrl_1 = require("./translateUrl");
Object.defineProperty(exports, "translateUrl", { enumerable: true, get: function () { return translateUrl_1.translateUrl; } });
var link_1 = require("./link");
Object.defineProperty(exports, "Link", { enumerable: true, get: function () { return link_1.Link; } });
var enhanceNextRouter = function (_a) {
    var push = _a.push, replace = _a.replace, prefetch = _a.prefetch, locale = _a.locale, otherRouterProps = __rest(_a, ["push", "replace", "prefetch", "locale"]);
    return (__assign({ push: function (url, as, options) {
            var translatedPath = as ||
                ((options === null || options === void 0 ? void 0 : options.locale) || locale ? (0, translateUrl_1.translateUrl)(url, (options === null || options === void 0 ? void 0 : options.locale) || locale, { format: 'object' }) : url);
            return push(translatedPath, as, options);
        }, replace: function (url, as, options) {
            var translatedPath = as ||
                ((options === null || options === void 0 ? void 0 : options.locale) || locale ? (0, translateUrl_1.translateUrl)(url, (options === null || options === void 0 ? void 0 : options.locale) || locale, { format: 'object' }) : url);
            return replace(translatedPath, as, options);
        }, prefetch: function (inputUrl, asPath, options) {
            var as = asPath ||
                ((options === null || options === void 0 ? void 0 : options.locale) || locale
                    ? (0, translateUrl_1.translateUrl)(inputUrl, (options === null || options === void 0 ? void 0 : options.locale) || locale, { format: 'string' })
                    : inputUrl);
            return prefetch(inputUrl, as, options);
        }, locale: locale }, otherRouterProps));
};
/**
 * Get router with route translation capabilities
 *
 * @deprecated since version 1.2.0
 * Use withTranslateRoutes in _app instead, then use Next useRouter (`next/router`)
 */
var useRouter = function () {
    var nextRouter = (0, router_1.useRouter)();
    return enhanceNextRouter(nextRouter);
};
exports.useRouter = useRouter;
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Inject router prop with route translation capabilities
 *
 * @deprecated since version 1.2.0
 * Use withTranslateRoutes in _app instead, then use Next withRouter (`next/router`)
 */
var withRouter = function (Component) {
    return Object.assign(function (props) { return react_1.default.createElement(Component, __assign({ router: (0, router_1.useRouter)() }, props)); }, {
        displayName: "withRouter(" + Component.displayName + ")",
    });
};
exports.withRouter = withRouter;
/**
 * Must wrap the App component in `pages/_app`.
 * This HOC will make the route push, replace, and refetch functions able to translate routes.
 */
var withTranslateRoutes = function (AppComponent) {
    if (!(0, getEnv_1.getRoutesTree)()) {
        throw new Error('> next-translate-routes - No routes tree defined. next-translate-routes plugin is probably missing from next.config.js');
    }
    var WithTranslateRoutesApp = function (props) {
        var nextRouter = (0, router_1.useRouter)();
        if (nextRouter && !nextRouter.locale) {
            var fallbackLocale = (0, getEnv_1.getDefaultLocale)() || (0, getEnv_1.getLocales)()[0];
            nextRouter.locale = fallbackLocale;
            console.error("> next-translate-routes - No locale prop in Router: fallback to " + fallbackLocale + ".");
        }
        return (react_1.default.createElement(router_context_1.RouterContext.Provider, { value: nextRouter ? enhanceNextRouter(nextRouter) : props.router },
            react_1.default.createElement(AppComponent, __assign({}, props))));
    };
    return WithTranslateRoutesApp;
};
exports.withTranslateRoutes = withTranslateRoutes;
exports.default = exports.withTranslateRoutes;
//# sourceMappingURL=index.js.map