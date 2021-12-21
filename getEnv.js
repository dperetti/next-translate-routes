"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultLocale = exports.getLocales = exports.getRoutesTree = void 0;
var getRoutesTree = function () {
    var _a, _b;
    if (typeof window === 'undefined') {
        return ((_a = global.i18nConfig) === null || _a === void 0 ? void 0 : _a.routesTree) || {};
    }
    return ((_b = window.i18nConfig) === null || _b === void 0 ? void 0 : _b.routesTree) || {};
};
exports.getRoutesTree = getRoutesTree;
// export const getRoutesTree = () => JSON.parse(process.env.NEXT_PUBLIC_ROUTES || 'null') as TRouteBranch
var getLocales = function () { return (process.env.NEXT_PUBLIC_LOCALES || '').split(','); };
exports.getLocales = getLocales;
var getDefaultLocale = function () { return process.env.NEXT_PUBLIC_DEFAULT_LOCALE; };
exports.getDefaultLocale = getDefaultLocale;
//# sourceMappingURL=getEnv.js.map