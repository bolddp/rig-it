import { AxiosRequestHeaders, Method } from 'axios';
import { TestResponse } from './TestResponse';
import { TestReporter } from '../reporter/TestReporter';
export declare class TestConnector {
    private reporter;
    private config;
    private axiosConfig;
    private bearerToken?;
    private basicAuth?;
    private xApiKey?;
    constructor(config: TestConnectorConfig, reporter: TestReporter);
    /**
     * Filters out request values whose value is undefined and prevents them from being added to
     * the query parameters of the URL. E.g. { a: "defined", b: undefined } becomes { a: "defined" }
     *
     * If the provided parameter value is an array, its values are converted to a comma separated string.
     */
    private constructParams;
    private constructBody;
    private constructCompositeAxiosConfig;
    request(request: TestConnectorMethodRequest): Promise<TestResponse>;
    /**
     * Sets a request header on this connector, e.g. for authentication. The header will be present in
     * all requests that are performed by the connector until the header is cleared.
     *
     * @example setHeader('Authorization', 'Bearer xxx');
     * The header is cleared by setting value = undefined.
     */
    setHeader(name: string, value: string | undefined): void;
    get(request: TestConnectorRequest): Promise<TestResponse>;
    put(request: TestConnectorRequest): Promise<TestResponse>;
    patch(request: TestConnectorRequest): Promise<TestResponse>;
    post(request: TestConnectorRequest): Promise<TestResponse>;
    delete(request: TestConnectorRequest): Promise<TestResponse>;
}
export declare type RequestParams = {
    [key: string]: any;
};
export interface TestConnectorConfig {
    baseUrl: string;
    authHeaders?: AxiosRequestHeaders;
    timeoutMs?: number;
}
export interface TestConnectorRequest {
    url: string;
    body?: any;
    formData?: {
        [key: string]: any;
    };
    headers?: AxiosRequestHeaders;
    params?: any;
    isUnauthorized?: boolean;
}
export interface TestConnectorMethodRequest extends TestConnectorRequest {
    method: Method;
}
