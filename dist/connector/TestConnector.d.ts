import { AxiosRequestHeaders, Method } from 'axios';
import { TestConnectorLogger } from '../Loggers';
import { TestResponse } from './TestResponse';
import { TestRig } from '../rig/TestRig';
export declare class TestConnector {
    private rig;
    private config;
    private axiosConfig;
    private bearerToken?;
    private basicAuth?;
    private xApiKey?;
    constructor(rig: TestRig, config: TestConnectorConfig);
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
    log?: TestConnectorLogger;
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
