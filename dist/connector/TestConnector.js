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
const TestLogger_1 = require("../logger/TestLogger");
const DEFAULT_REQUEST_TIMEOUT = 5000;
class TestConnector {
    constructor(rig, config) {
        var _a;
        this.rig = rig;
        this.config = config;
        this.axiosConfig = {
            baseURL: this.config.baseUrl,
            timeout: (_a = this.config.timeoutMs) !== null && _a !== void 0 ? _a : DEFAULT_REQUEST_TIMEOUT,
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const config = this.constructCompositeAxiosConfig(request);
            const ts = Date.now();
            (_a = this.config.logger) === null || _a === void 0 ? void 0 : _a.gray(TestLogger_1.Indent.TestContent, `${config.method} ${config.baseURL}${axios_1.default.getUri(config)}`);
            try {
                const rsp = yield axios_1.default.request(config);
                return {
                    isOk: true,
                    status: rsp.status,
                    headers: rsp.headers,
                    data: rsp.data,
                };
            }
            catch (error) {
                if (!error.response) {
                    // No response at all was received, e.g. timeout or invalid URL
                    (_b = this.config.logger) === null || _b === void 0 ? void 0 : _b.red(TestLogger_1.Indent.TestContent, `${config.method} failed in ${Date.now() - ts} ms : ${error.message}`);
                    throw error;
                }
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
