"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestConnector = void 0;
const DEFAULT_REQUEST_TIMEOUT = 5000;
class TestConnector {
    reporter;
    config;
    defaultHeaders;
    bearerToken;
    basicAuth;
    xApiKey;
    constructor(config, reporter) {
        this.config = config;
        this.reporter = reporter;
        this.defaultHeaders = {
            ...config.authHeaders,
            Accept: '*/*',
            'Content-Type': 'application/json',
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
            return JSON.stringify(request.body);
        }
        if (!request.formData) {
            return undefined;
        }
        return Object.keys(request.formData)
            .map((key) => `${key}=${request.formData[key]}`)
            .join('&');
    }
    constructUrl(request) {
        const params = this.constructParams(request.params);
        let url = `${this.config.baseUrl}${request.url}`;
        if (params) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }
        return url;
    }
    constructHeaders(request) {
        const headers = {
            ...this.defaultHeaders,
            ...(request.headers ?? {}),
        };
        if (!request.isUnauthorized) {
            headers['Authorization-Provider'] = 'husqvarna';
            if (this.bearerToken) {
                headers['Authorization'] = `Bearer ${this.bearerToken}`;
            }
            if (this.basicAuth) {
                headers['Authorization'] = `Basic ${this.basicAuth}`;
            }
            if (this.xApiKey) {
                headers['x-api-key'] = this.xApiKey;
            }
        }
        return headers;
    }
    headersToRecord(headers) {
        const result = {};
        headers.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }
    async request(request) {
        const url = this.constructUrl(request);
        const headers = this.constructHeaders(request);
        const body = request.method !== 'GET' ? this.constructBody(request) : undefined;
        const ts = Date.now();
        this.reporter?.log?.testStep?.info?.(`${request.method} ${url}`);
        const controller = new AbortController();
        const timeoutMs = this.config.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, {
                method: request.method,
                headers,
                body,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            let data;
            const contentType = response.headers.get('content-type') ?? '';
            const text = await response.text();
            if (contentType.includes('application/json') && text) {
                try {
                    data = JSON.parse(text);
                }
                catch {
                    data = text;
                }
            }
            else {
                data = text || undefined;
            }
            if (response.ok) {
                this.reporter.log?.testStep?.success?.(`HTTP ${response.status} - ${JSON.stringify(data ?? '').length} bytes in ${Date.now() - ts} ms`);
                return {
                    isOk: true,
                    status: response.status,
                    headers: this.headersToRecord(response.headers),
                    data,
                };
            }
            this.reporter.log?.testStep?.error?.(`HTTP ${response.status} - ${JSON.stringify(data ?? '').length} bytes in ${Date.now() - ts} ms`);
            return {
                isOk: false,
                status: response.status,
                headers: this.headersToRecord(response.headers),
                errorMessage: response.statusText,
                data,
            };
        }
        catch (error) {
            clearTimeout(timeoutId);
            this.reporter.log?.testStep?.error?.(`${request.method} failed in ${Date.now() - ts} ms : ${error.message}`);
            throw error;
        }
    }
    /**
     * Sets a request header on this connector, e.g. for authentication. The header will be present in
     * all requests that are performed by the connector until the header is cleared.
     *
     * @example setHeader('Authorization', 'Bearer xxx');
     * The header is cleared by setting value = undefined.
     */
    setHeader(name, value) {
        if (value == undefined) {
            delete this.defaultHeaders[name];
        }
        else {
            this.defaultHeaders[name] = value;
        }
    }
    async get(request) {
        return this.request({ ...request, method: 'GET' });
    }
    async put(request) {
        return this.request({ ...request, method: 'PUT' });
    }
    async patch(request) {
        return this.request({ ...request, method: 'PATCH' });
    }
    async post(request) {
        return this.request({ ...request, method: 'POST' });
    }
    async delete(request) {
        return this.request({ ...request, method: 'DELETE' });
    }
}
exports.TestConnector = TestConnector;
