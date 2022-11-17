"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestConnector = void 0;
const axios_1 = __importDefault(require("axios"));
const DEFAULT_REQUEST_TIMEOUT = 5000;
class TestConnector {
    constructor(config, reporter) {
        var _a;
        this.config = config;
        this.reporter = reporter;
        this.axiosConfig = {
            baseURL: this.config.baseUrl,
            timeout: (_a = this.config.timeoutMs) !== null && _a !== void 0 ? _a : DEFAULT_REQUEST_TIMEOUT,
            headers: Object.assign(Object.assign({}, config.authHeaders), { Accept: '*/*', 'Content-Type': 'application/json' }),
        };
    }
    /**
     * Filters out request values whose value is undefined and prevents them from being added to
     * the query parameters of the URL. E.g. { a: "defined", b: undefined } becomes { a: "defined" }
     *
     * If the provided parameter value is an array, its values are converted to a comma separated string.
     */
    constructParams(params) {
        if (!params) {
            return undefined;
        }
        return Object.keys(params).reduce((p, c) => {
            const value = params[c];
            if (value != undefined) {
                if (Array.isArray(value)) {
                    p[c] = value.join(',');
                }
                else {
                    p[c] = value;
                }
            }
            return p;
        }, {});
    }
    constructBody(request) {
        if (request.body) {
            return request.body;
        }
        if (!request.formData) {
            return undefined;
        }
        const formData = Object.keys(request.formData)
            .map((key) => `${key}=${request.formData[key]}`)
            .join('&');
        return formData;
    }
    constructCompositeAxiosConfig(request) {
        var _a;
        const result = Object.assign(Object.assign({}, this.axiosConfig), { url: request.url, data: this.constructBody(request), headers: Object.assign(Object.assign({}, this.axiosConfig.headers), ((_a = request.headers) !== null && _a !== void 0 ? _a : {})), params: this.constructParams(request.params), method: request.method });
        if (!request.isUnauthorized) {
            const authHeaders = {
                'Authorization-Provider': 'husqvarna',
            };
            if (this.bearerToken) {
                authHeaders['Authorization'] = `Bearer ${this.bearerToken}`;
            }
            if (this.basicAuth) {
                authHeaders['Authorization'] = `Basic ${this.basicAuth}`;
            }
            if (this.xApiKey) {
                authHeaders['x-api-key'] = this.xApiKey;
            }
            result.headers = Object.assign(Object.assign({}, result.headers), authHeaders);
        }
        return result;
    }
    request(request) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __awaiter(this, void 0, void 0, function* () {
            const config = this.constructCompositeAxiosConfig(request);
            const ts = Date.now();
            (_d = (_c = (_b = (_a = this.reporter) === null || _a === void 0 ? void 0 : _a.log) === null || _b === void 0 ? void 0 : _b.testStep) === null || _c === void 0 ? void 0 : _c.info) === null || _d === void 0 ? void 0 : _d.call(_c, `${config.method} ${config.baseURL}${axios_1.default.getUri(config)}`);
            try {
                const response = yield axios_1.default.request(config);
                (_g = (_f = (_e = this.reporter.log) === null || _e === void 0 ? void 0 : _e.testStep) === null || _f === void 0 ? void 0 : _f.success) === null || _g === void 0 ? void 0 : _g.call(_f, `HTTP ${response.status} - ${JSON.stringify((_h = response.data) !== null && _h !== void 0 ? _h : '').length} bytes in ${Date.now() - ts} ms`);
                return {
                    isOk: true,
                    status: response.status,
                    headers: response.headers,
                    data: response.data,
                };
            }
            catch (error) {
                if (!error.response) {
                    // No response at all was received, e.g. timeout or invalid URL
                    (_l = (_k = (_j = this.reporter.log) === null || _j === void 0 ? void 0 : _j.testStep) === null || _k === void 0 ? void 0 : _k.error) === null || _l === void 0 ? void 0 : _l.call(_k, `${config.method} failed in ${Date.now() - ts} ms : ${error.message}`);
                    throw error;
                }
                (_p = (_o = (_m = this.reporter.log) === null || _m === void 0 ? void 0 : _m.testStep) === null || _o === void 0 ? void 0 : _o.error) === null || _p === void 0 ? void 0 : _p.call(_o, `HTTP ${error.response.status} - ${JSON.stringify((_q = error.response.data) !== null && _q !== void 0 ? _q : '').length} bytes in ${Date.now() - ts} ms`);
                const rsp = {
                    isOk: false,
                    status: error.response.status,
                    headers: error.response.headers,
                    errorMessage: error.response.statusText,
                    data: error.response.data,
                };
                return rsp;
            }
        });
    }
    /**
     * Sets a request header on this connector, e.g. for authentication. The header will be present in
     * all requests that are performed by the connector until the header is cleared.
     *
     * @example setHeader('Authorization', 'Bearer xxx');
     * The header is cleared by setting value = undefined.
     */
    setHeader(name, value) {
        var _a;
        if (value == undefined) {
            (_a = this.axiosConfig.headers) === null || _a === void 0 ? true : delete _a[name];
        }
        else {
            this.axiosConfig.headers = Object.assign(Object.assign({}, this.axiosConfig.headers), { [name]: value });
        }
    }
    get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(Object.assign(Object.assign({}, request), { method: 'GET' }));
        });
    }
    put(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(Object.assign(Object.assign({}, request), { method: 'PUT' }));
        });
    }
    patch(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(Object.assign(Object.assign({}, request), { method: 'PATCH' }));
        });
    }
    post(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(Object.assign(Object.assign({}, request), { method: 'POST' }));
        });
    }
    delete(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(Object.assign(Object.assign({}, request), { method: 'DELETE' }));
        });
    }
}
exports.TestConnector = TestConnector;
