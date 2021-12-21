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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateUrl = exports.translatePath = exports.removeLangPrefix = exports.ignoreSegmentPathRegex = void 0;
var path_to_regexp_1 = require("path-to-regexp");
var querystring_1 = require("querystring");
var url_1 = require("url");
var getEnv_1 = require("./getEnv");
/**
 * A segment can be ignored by setting its path to "." in _routes.json.
 * It can be done for some lang only and not others.
 *
 * It can cause troubles with the redirections. Ex:
 * Given the /a/[b]/[c] and /a/[b]/[c]/d file paths. [b] is ignored and the b param is merged with the c param: ":b-:c".
 * Then /a/b/c will be redirected to /a/b-c and that is fine.
 * But /a/b-c/d will be redirected to /a/b-c-d and that is not fine.
 *
 * To handle this case, one can add a path-to-regex pattern to the default ignore token. Ex: '.(\\d+)', or '.(\[\^-\]+)'.
 * This path-to-regex pattern will be added after the segment name in the redirect.
 * Then /a/b(\\d+)/c will be redirected to /a/b-c, and /a/b-c/d will not be redirected to /a/b-c-d.
 * /!\ This is only handled in default paths (i.e. "/": ".(\\d+)" or "/": { "default": ".(\\d+)" }), not in lang-specific paths.
 */
exports.ignoreSegmentPathRegex = /^\.(\(.+\))?$/;
/** Get children + (grand)children of children whose path must be ignord (path === '.' or path === `.(${pathRegex})`) */
var getAllCandidates = function (lang, children) {
    return children
        ? children.reduce(function (acc, child) {
            var path = child.paths[lang] || child.paths.default;
            return __spreadArray(__spreadArray([], __read(acc), false), __read((path === '' ? getAllCandidates(lang, child.children) : [child])), false);
        }, [])
        : [];
};
var getSingleDynamicPathPartName = function (pathPartName) { var _a; return ((_a = /^\[([^/[\].]+)\]$/.exec(pathPartName)) === null || _a === void 0 ? void 0 : _a[1]) || null; };
var getSpreadDynamicPathPartName = function (pathPartName) { var _a; return ((_a = /^\[\[?\.{3}([^/[\].]+)\]?\]$/.exec(pathPartName)) === null || _a === void 0 ? void 0 : _a[1]) || null; };
/**
 * Recursively translate paths from file path, and extract parameters
 */
var translatePathParts = function (_a) {
    var _b, _c;
    var locale = _a.locale, pathParts = _a.pathParts, routeBranch = _a.routeBranch, query = _a.query;
    var children = routeBranch.children;
    if (!Array.isArray(pathParts)) {
        throw new Error('Wrong pathParts argument in translatePathParts');
    }
    if (pathParts.length === 0) {
        return { translatedPathParts: [], augmentedQuery: query };
    }
    var pathPart = pathParts[0];
    var nextPathParts = pathParts.slice(1);
    if (!pathPart) {
        return translatePathParts({ locale: locale, pathParts: nextPathParts, routeBranch: routeBranch, query: query });
    }
    var candidates = getAllCandidates(locale, children).filter(function (child) {
        return pathParts.length === 1 // Last path part
            ? !child.children ||
                child.children.some(function (grandChild) { return grandChild.name === 'index' || /\[\[\.{3}\w+\]\]/.exec(grandChild.name); })
            : !!child.children;
    });
    var currentQuery = query;
    var childRouteBranch = candidates.find(function (_a) {
        var name = _a.name;
        return pathPart === name;
    });
    // If defined: pathPart is a route segment name that should be translated.
    // If dynamic, the value should already be contained in the query.
    if (!childRouteBranch) {
        // If not defined: pathPart is either a dynamic value either a wrong path.
        childRouteBranch = candidates.find(function (candidate) { return getSingleDynamicPathPartName(candidate.name); });
        if (childRouteBranch) {
            // Single dynamic route segment value => store it in the query
            currentQuery = __assign(__assign({}, currentQuery), (_b = {}, _b[childRouteBranch.name.replace(/\[|\]|\./g, '')] = pathPart, _b));
        }
        else {
            childRouteBranch = candidates.find(function (candidate) { return getSpreadDynamicPathPartName(candidate.name); });
            if (childRouteBranch) {
                // Catch all route => store it in the query, then return the current data.
                currentQuery = __assign(__assign({}, currentQuery), (_c = {}, _c[childRouteBranch.name.replace(/\[|\]|\./g, '')] = pathParts, _c));
                return {
                    translatedPathParts: [childRouteBranch.name],
                    augmentedQuery: currentQuery,
                };
            }
            // No route match => return the remaining path as is
            return { translatedPathParts: pathParts, augmentedQuery: query };
        }
    }
    // Get the descendants translated path parts and query values
    var _d = (childRouteBranch === null || childRouteBranch === void 0 ? void 0 : childRouteBranch.children)
        ? translatePathParts({ locale: locale, pathParts: nextPathParts, routeBranch: childRouteBranch, query: currentQuery })
        : { augmentedQuery: currentQuery, translatedPathParts: [] }, augmentedQuery = _d.augmentedQuery, nextTranslatedPathsParts = _d.translatedPathParts;
    var translatedPathPart = childRouteBranch.paths[locale] || childRouteBranch.paths.default;
    return {
        translatedPathParts: __spreadArray(__spreadArray([], __read((exports.ignoreSegmentPathRegex.test(translatedPathPart) ? [] : [translatedPathPart])), false), __read((nextTranslatedPathsParts || [])), false),
        augmentedQuery: augmentedQuery,
    };
};
function removeLangPrefix(pathname, toArray) {
    var _a;
    var pathParts = pathname.split('/').filter(Boolean);
    var routesTree = (0, getEnv_1.getRoutesTree)();
    var locales = (0, getEnv_1.getLocales)();
    var defaultLocale = (0, getEnv_1.getDefaultLocale)();
    var getLangRoot = function (lang) { return routesTree.paths[lang] || routesTree.paths.default; };
    var defaultLocaleRoot = defaultLocale && getLangRoot(defaultLocale);
    var hasLangPrefix = locales.includes(pathParts[0]);
    var hasDefaultLocalePrefix = !hasLangPrefix && !!defaultLocaleRoot && pathParts[0] === defaultLocaleRoot;
    if (!hasLangPrefix && !hasDefaultLocalePrefix) {
        return toArray ? pathParts : pathname;
    }
    var locale = hasLangPrefix ? pathParts[0] : defaultLocale;
    var localeRootParts = locale && ((_a = getLangRoot(locale)) === null || _a === void 0 ? void 0 : _a.split('/'));
    var nbPathPartsToRemove = (hasLangPrefix ? 1 : 0) +
        (localeRootParts && (!hasLangPrefix || pathParts[1] === localeRootParts[0]) ? localeRootParts.length : 0);
    return toArray ? pathParts.slice(nbPathPartsToRemove) : "/" + pathParts.slice(nbPathPartsToRemove).join('/');
}
exports.removeLangPrefix = removeLangPrefix;
function translatePath(url, locale, _a) {
    var _b = _a === void 0 ? {} : _a, format = _b.format;
    var routesTree = (0, getEnv_1.getRoutesTree)();
    var returnFormat = format || typeof url;
    var urlObject = typeof url === 'object' ? url : (0, url_1.parse)(url, true);
    var pathname = urlObject.pathname, query = urlObject.query, hash = urlObject.hash;
    if (!pathname || !locale) {
        return returnFormat === 'object' ? url : (0, url_1.format)(url);
    }
    var pathParts = removeLangPrefix(pathname, true);
    var _c = translatePathParts({
        locale: locale,
        pathParts: pathParts,
        query: (0, querystring_1.parse)(typeof query === 'string' ? query : (0, querystring_1.stringify)(query || {})),
        routeBranch: routesTree,
    }), translatedPathParts = _c.translatedPathParts, _d = _c.augmentedQuery, augmentedQuery = _d === void 0 ? {} : _d;
    var path = translatedPathParts.join('/');
    var compiledPath = (0, path_to_regexp_1.compile)(path, { validate: false })(augmentedQuery);
    var paramNames = (0, path_to_regexp_1.parse)(path).filter(function (token) { return typeof token === 'object'; }).map(function (token) { return token.name; });
    var remainingQuery = Object.keys(augmentedQuery).reduce(function (acc, key) {
        var _a;
        return (__assign(__assign({}, acc), (paramNames.includes(key)
            ? {}
            : (_a = {}, _a[key] = (typeof query === 'object' && (query === null || query === void 0 ? void 0 : query[key])) || augmentedQuery[key], _a))));
    }, {});
    var translatedPathname = (routesTree.paths[locale] ? "/" + routesTree.paths[locale] : '') + "/" + compiledPath;
    var translatedUrlObject = __assign(__assign({}, urlObject), { hash: hash, pathname: translatedPathname, query: remainingQuery });
    return returnFormat === 'object' ? translatedUrlObject : (0, url_1.format)(translatedUrlObject);
}
exports.translatePath = translatePath;
/**
 * Translate url into locale
 *
 * @param url string url or UrlObject
 * @param locale string
 * @param options (optional)
 * @param options.format `'string'` or `'object'`
 * @return string if `options.format === 'string'`,
 * UrlObject if `options.format === 'object'`,
 * same type as url if options.format is not defined
 */
exports.translateUrl = (function (url, locale, options) {
    var defaultLocale = (0, getEnv_1.getDefaultLocale)();
    // Handle external urls
    var parsedUrl = typeof url === 'string' ? (0, url_1.parse)(url) : url;
    if (parsedUrl.host) {
        if (typeof window === 'undefined' || parsedUrl.host !== (0, url_1.parse)(window.location.href).host) {
            return url;
        }
    }
    var translatedPath = translatePath(url, locale, options);
    var prefix = locale === defaultLocale || (options === null || options === void 0 ? void 0 : options.withoutLangPrefix) ? '' : "/" + locale;
    if (typeof translatedPath === 'object') {
        return __assign(__assign({}, translatedPath), { pathname: prefix + translatedPath.pathname });
    }
    return prefix + translatedPath;
});
exports.default = exports.translateUrl;
//# sourceMappingURL=translateUrl.js.map