"use strict";
/**
 * ## Vocabulary ##
 *
 * Paths:
 * - path: path in path-to-regexp syntax
 * - file path: path in the Next.js file system syntax
 * - base path: file path in path-to-regexp syntax
 * - translated path: file path translated in path-to-regexp syntax
 * - translated file path: translated file path
 * - default path: path of user specified default path values or, when empty, from file names translated into path-to-regexp syntax
 * - default locale path: translated path for default locale
 *
 * Routes:
 * - route segment data: data entered in the route data file for a segment
 *   It is either a path, either an object, with locales or "default" as keys and paths as values.
 * - route segments data: all the data entered in the route data file.
 *   It is an object with file names, or "/" for the containing folder, as keys and route segment data as values.
 * - route segment path: same as route segment data, but with the "default" value calculated from the file name it it did not exist
 * - route branch: route object with details and optionally children
 * - route tree: root route branch
 * - reroutes: object containing a redirects array and a rewrites array
 *
 * Translations:
 * - translations: object that associate a path segment translation to locales
 * - routesData: content of a routes file (object that associate translated path to file names)
 */
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTranslateRoutes = exports.getRouteBranchReRoutes = exports.getPageReRoutes = exports.parsePagesTree = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var translateUrl_1 = require("./translateUrl");
/** Keep 'routes.json' for backward compatibility */
var ROUTES_DATA_FILE_NAMES = ['_routes.json', 'routes.json'];
/** Transform Next file-system synthax to path-to-regexp synthax */
var fileNameToPath = function (fileName) {
    return fileName
        .replace(/\[\[\.\.\.(\S+)\]\]/g, ':$1*') // [[...param]]
        .replace(/\[\.\.\.(\S+)\]/g, ':$1') // [...param]
        .replace(/\[(\S+)\]/g, ':$1');
}; // [param]
/** Get path and path translations from name and all translations */
var getRouteSegment = function (name, routeSegmentsData, isDirectory) {
    var routeSegmentData = routeSegmentsData === null || routeSegmentsData === void 0 ? void 0 : routeSegmentsData[isDirectory ? '/' : name];
    var _a = typeof routeSegmentData === 'object' ? routeSegmentData : { default: routeSegmentData }, _b = _a.default, defaultPath = _b === void 0 ? fileNameToPath(name) : _b, localized = __rest(_a, ["default"]);
    var paths = __assign({ default: defaultPath }, localized);
    return {
        name: name,
        paths: paths,
    };
};
/**
 * Recursively parse pages directory and build a page tree object
 */
var parsePagesTree = function (directoryPath, isTrunk) {
    var dirPath = directoryPath || path_1.default.resolve(process.cwd(), 'pages');
    var directoryItems = fs_1.default.readdirSync(dirPath);
    var routesDataFileName = directoryItems.find(function (directoryItem) { return ROUTES_DATA_FILE_NAMES.includes(directoryItem); });
    var routeSegmentsData = routesDataFileName ? require(path_1.default.join(dirPath, routesDataFileName)) : {};
    var directoryPathParts = dirPath.split(/[\\/]/);
    var name = !directoryPath || isTrunk ? '' : directoryPathParts[directoryPathParts.length - 1];
    var children = directoryItems.reduce(function (acc, item) {
        var isDirectory = fs_1.default.statSync(path_1.default.join(dirPath, item)).isDirectory();
        var pageMatch = item.match(/(.+)\.[jt]sx?$/);
        var pageName = (!isDirectory && (pageMatch === null || pageMatch === void 0 ? void 0 : pageMatch[1])) || '';
        if ((isTrunk || !directoryPath) &&
            (['_app', '_document', '_error', '404', '500'].includes(pageName) || item === 'api')) {
            return acc;
        }
        if (isDirectory || pageName) {
            return __spreadArray(__spreadArray([], __read(acc), false), [
                isDirectory
                    ? (0, exports.parsePagesTree)(path_1.default.join(dirPath, item))
                    : getRouteSegment(pageName || item, routeSegmentsData),
            ], false);
        }
        return acc;
    }, []);
    return __assign(__assign({}, getRouteSegment(name, routeSegmentsData, true)), { children: children });
};
exports.parsePagesTree = parsePagesTree;
/** Remove brackets and custom regexp from source to get valid destination */
var sourceToDestination = function (sourcePath) {
    return sourcePath.replace(/[{}]|(:\w+)\([^)]+\)/g, function (_match, arg) { return arg || ''; });
};
var staticSegmentRegex = /^[\w-_]+$|^\([\w-_|]+\)$/;
/**
 * Find index of a similar redirect/rewrite
 * This is used to merge similar redirects and rewrites
 */
var getSimilarIndex = function (sourceSegments, acc) {
    return acc.findIndex(function (_a) {
        var otherSource = _a.source;
        var otherSourceSegments = otherSource.split('/');
        return (
        // source and otherSource must have the same segments number
        otherSourceSegments.length === sourceSegments.length &&
            // each corresponding source and otherSource segments should be compatible, which means that...
            sourceSegments.every(function (sourceSegment, index) {
                var correspondingSegment = otherSourceSegments[index];
                return (
                // ...either they are equal
                sourceSegment === correspondingSegment ||
                    // ...either they are both static
                    (staticSegmentRegex.test(sourceSegment) && staticSegmentRegex.test(correspondingSegment)));
            }));
    });
};
/**
 * Get redirects and rewrites for a page
 */
var getPageReRoutes = function (_a) {
    var locales = _a.locales, routeSegments = _a.routeSegments, defaultLocale = _a.defaultLocale;
    /** If there is only one path possible: it is common to all locales and to files. No redirection nor rewrite is needed. */
    if (!routeSegments.some(function (_a) {
        var paths = _a.paths;
        return Object.keys(paths).length > 1;
    })) {
        return { rewrites: [], redirects: [] };
    }
    /** Get a translated path or base path */
    var getPath = function (locale) {
        return "/" + routeSegments
            .map(function (_a) {
            var paths = _a.paths;
            return paths[locale] || paths.default;
        })
            .filter(function (pathPart) { return pathPart && !translateUrl_1.ignoreSegmentPathRegex.test(pathPart); })
            .join('/');
    };
    /** File path in path-to-regexp syntax (cannot be customised in routes data files) */
    var basePath = "/" + routeSegments
        .map(function (_a) {
        var name = _a.name, defaultPath = _a.paths.default;
        var match = defaultPath.match(translateUrl_1.ignoreSegmentPathRegex) || [];
        // If a pattern is added to the ignore token "."
        return fileNameToPath(name) + (match[1] || '');
    })
        .filter(function (pathPart) { return pathPart; })
        .join('/');
    /**
     * ```
     * [
     *   { locales: ['en'], path: '/english/path/without/locale/prefix' },
     *   { locales: ['fr'], path: '/french/path/without/locale/prefix' },
     *   { locales: ['es', 'pt'], path: '/path/common/to/several/locales' },
     * ]
     * ```
     * Each locale cannot appear more than once. Item is ignored if its path would be the same as basePath.
     */
    var sourceList = locales.reduce(function (acc, locale) {
        var source = getPath(locale);
        if (source === basePath) {
            return acc;
        }
        var _a = (acc.find(function (sourceItem) { return sourceItem.source === source; }) || {}).sourceLocales, sourceLocales = _a === void 0 ? [] : _a;
        return __spreadArray(__spreadArray([], __read(acc.filter(function (sourceItem) { return sourceItem.source !== source; })), false), [
            { source: source, sourceLocales: __spreadArray(__spreadArray([], __read(sourceLocales), false), [locale], false) },
        ], false);
    }, []);
    var redirects = locales.reduce(function (acc, locale) {
        var _a;
        var localePath = getPath(locale);
        var destination = "" + (locale === defaultLocale ? '' : "/" + locale) + sourceToDestination(localePath);
        return __spreadArray(__spreadArray([], __read(acc), false), __read((_a = sourceList
            .filter(function (_a) {
            var sourceLocales = _a.sourceLocales;
            return !sourceLocales.includes(locale);
        }))
            .concat.apply(_a, __spreadArray([], __read((localePath === basePath ? [] : [{ sourceLocales: [], source: basePath }])), false)).reduce(function (acc, _a) {
            var rawSource = _a.source;
            var source = "/" + locale + rawSource;
            var sourceSegments = source.split('/');
            // Look for similar redirects
            var similarIndex = getSimilarIndex(sourceSegments, acc);
            // If similar redirect exist, merge the new one
            if (similarIndex >= 0) {
                var similar = acc[similarIndex];
                return __spreadArray(__spreadArray(__spreadArray([], __read(acc.slice(0, similarIndex)), false), [
                    __assign(__assign({}, similar), { source: similar.source
                            .split('/')
                            .map(function (similarSegment, index) {
                            return similarSegment === sourceSegments[index]
                                ? similarSegment
                                : "(" + similarSegment.replace(/\(|\)/g, '').split('|').concat(sourceSegments[index]).join('|') + ")";
                        })
                            .join('/') })
                ], false), __read(acc.slice(similarIndex + 1)), false);
            }
            // Else append the new redirect
            return __spreadArray(__spreadArray([], __read(acc), false), [
                {
                    source: source,
                    destination: destination,
                    locale: false,
                    permanent: true,
                },
            ], false);
        }, [])
            .filter(function (_a) {
            var source = _a.source, destination = _a.destination;
            return sourceToDestination(source) !== destination;
        })), false);
    }, []);
    var destination = sourceToDestination(basePath);
    var rewrites = sourceList.reduce(function (acc, _a) {
        var source = _a.source;
        if (sourceToDestination(source) === destination) {
            return acc;
        }
        var sourceSegments = source.split('/');
        // Look for similar rewrites
        var similarIndex = getSimilarIndex(sourceSegments, acc);
        // If similar rewrite exist, merge the new one
        if (similarIndex >= 0) {
            var similar = acc[similarIndex];
            return __spreadArray(__spreadArray(__spreadArray([], __read(acc.slice(0, similarIndex)), false), [
                __assign(__assign({}, similar), { source: similar.source
                        .split('/')
                        .map(function (similarSegment, index) {
                        return similarSegment === sourceSegments[index]
                            ? similarSegment
                            : "(" + similarSegment.replace(/\(|\)/g, '').split('|').concat(sourceSegments[index]).join('|') + ")";
                    })
                        .join('/') })
            ], false), __read(acc.slice(similarIndex + 1)), false);
        }
        // Else append a new rewrite
        return __spreadArray(__spreadArray([], __read(acc), false), [
            {
                source: source,
                destination: destination,
            },
        ], false);
    }, []);
    return { redirects: redirects, rewrites: rewrites };
};
exports.getPageReRoutes = getPageReRoutes;
/**
 * Generate reroutes in route branch to feed the rewrite section of next.config
 */
var getRouteBranchReRoutes = function (_a) {
    var locales = _a.locales, _b = _a.routeBranch, children = _b.children, routeSegment = __rest(_b, ["children"]), _c = _a.previousRouteSegments, previousRouteSegments = _c === void 0 ? [] : _c, defaultLocale = _a.defaultLocale;
    var routeSegments = __spreadArray(__spreadArray([], __read(previousRouteSegments), false), [routeSegment], false);
    return children
        ? children.reduce(function (acc, child) {
            var childReRoutes = child.name === 'index'
                ? (0, exports.getPageReRoutes)({ locales: locales, routeSegments: routeSegments, defaultLocale: defaultLocale })
                : (0, exports.getRouteBranchReRoutes)({
                    locales: locales,
                    routeBranch: child,
                    previousRouteSegments: routeSegments,
                    defaultLocale: defaultLocale,
                });
            return {
                redirects: __spreadArray(__spreadArray([], __read(acc.redirects), false), __read(childReRoutes.redirects), false),
                rewrites: __spreadArray(__spreadArray([], __read(acc.rewrites), false), __read(childReRoutes.rewrites), false),
            };
        }, { redirects: [], rewrites: [] })
        : (0, exports.getPageReRoutes)({ locales: locales, routeSegments: routeSegments, defaultLocale: defaultLocale });
};
exports.getRouteBranchReRoutes = getRouteBranchReRoutes;
/**
 * Sort redirects and rewrites by descending specificity:
 * - first by descending number of regexp in source
 * - then by descending number of path segments
 */
var sortBySpecificity = function (rArray) {
    return rArray.sort(function (a, b) {
        if (a.source.includes(':') && !b.source.includes(':')) {
            return 1;
        }
        if (!a.source.includes(':') && b.source.includes(':')) {
            return -1;
        }
        return b.source.split('/').length - a.source.split('/').length;
    });
};
/**
 * Inject translated routes
 */
var withTranslateRoutes = function (nextConfig) {
    var _a, _b, _c, _d;
    var _e = (nextConfig.i18n || {}).locales, locales = _e === void 0 ? [] : _e;
    var defaultLocale = (_a = nextConfig.i18n) === null || _a === void 0 ? void 0 : _a.defaultLocale;
    var existingRoutesTree = (_b = nextConfig === null || nextConfig === void 0 ? void 0 : nextConfig.env) === null || _b === void 0 ? void 0 : _b.NEXT_PUBLIC_ROUTES;
    var routesTree = existingRoutesTree ? JSON.parse(existingRoutesTree) : (0, exports.parsePagesTree)();
    // TODO: validateRoutesTree(routesTree)
    var _f = (0, exports.getRouteBranchReRoutes)({ locales: locales, routeBranch: routesTree, defaultLocale: defaultLocale }), redirects = _f.redirects, rewrites = _f.rewrites;
    process.env.NEXT_PUBLIC_ROUTES = JSON.stringify(routesTree);
    process.env.NEXT_PUBLIC_LOCALES = ((_d = (_c = nextConfig.i18n) === null || _c === void 0 ? void 0 : _c.locales) === null || _d === void 0 ? void 0 : _d.join(',')) || '';
    process.env.NEXT_PUBLIC_DEFAULT_LOCALE = defaultLocale || '';
    return __assign(__assign({}, nextConfig), { redirects: function () {
            return __awaiter(this, void 0, void 0, function () {
                var existingRedirects, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = nextConfig.redirects;
                            if (!_a) return [3 /*break*/, 2];
                            return [4 /*yield*/, nextConfig.redirects()];
                        case 1:
                            _a = (_b.sent());
                            _b.label = 2;
                        case 2:
                            existingRedirects = (_a) || [];
                            return [2 /*return*/, __spreadArray(__spreadArray([], __read(sortBySpecificity(redirects)), false), __read(existingRedirects), false)];
                    }
                });
            });
        }, rewrites: function () {
            return __awaiter(this, void 0, void 0, function () {
                var existingRewrites, _a, sortedRewrites;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = nextConfig.rewrites;
                            if (!_a) return [3 /*break*/, 2];
                            return [4 /*yield*/, nextConfig.rewrites()];
                        case 1:
                            _a = (_b.sent());
                            _b.label = 2;
                        case 2:
                            existingRewrites = (_a) || [];
                            sortedRewrites = sortBySpecificity(rewrites);
                            if (Array.isArray(existingRewrites)) {
                                return [2 /*return*/, __spreadArray(__spreadArray([], __read(existingRewrites), false), __read(sortedRewrites), false)];
                            }
                            return [2 /*return*/, __assign(__assign({}, existingRewrites), { afterFiles: __spreadArray(__spreadArray([], __read((existingRewrites.afterFiles || [])), false), __read(sortedRewrites), false) })];
                    }
                });
            });
        } });
};
exports.withTranslateRoutes = withTranslateRoutes;
//# sourceMappingURL=config.js.map