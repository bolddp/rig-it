import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios';
import { TestResponse } from './TestResponse';
import { TestReporter } from '../reporter/TestReporter';

const DEFAULT_REQUEST_TIMEOUT = 5000;

export class TestConnector {
  private reporter: TestReporter;
  private config: TestConnectorConfig;
  private axiosConfig: AxiosRequestConfig;
  private bearerToken?: string;
  private basicAuth?: string;
  private xApiKey?: string;

  constructor(config: TestConnectorConfig, reporter: TestReporter) {
    this.config = config;
    this.reporter = reporter;
    this.axiosConfig = {
      baseURL: this.config.baseUrl,
      timeout: this.config.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT,
      headers: {
        ...config.authHeaders,
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
  private constructParams(params?: any): RequestParams | undefined {
    if (!params) {
      return undefined;
    }
    return Object.keys(params).reduce<RequestParams>((p, c) => {
      const value = params[c];
      if (value != undefined) {
        if (Array.isArray(value)) {
          p[c] = value.join(',');
        } else {
          p[c] = value;
        }
      }
      return p;
    }, {});
  }

  private constructBody(request: TestConnectorMethodRequest): any {
    if (request.body) {
      return request.body;
    }
    if (!request.formData) {
      return undefined;
    }
    const formData = Object.keys(request.formData)
      .map((key) => `${key}=${request.formData![key]}`)
      .join('&');
    return formData;
  }

  private constructCompositeAxiosConfig(request: TestConnectorMethodRequest) {
    const result: AxiosRequestConfig = {
      ...this.axiosConfig,
      url: request.url,
      data: this.constructBody(request),
      headers: {
        ...this.axiosConfig.headers,
        ...(request.headers ?? {}),
      },
      params: this.constructParams(request.params),
      method: request.method,
    };
    if (!request.isUnauthorized) {
      const authHeaders: { [key: string]: string } = {
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
      result.headers = {
        ...result.headers,
        ...authHeaders,
      };
    }
    return result;
  }

  async request(request: TestConnectorMethodRequest): Promise<TestResponse> {
    const config = this.constructCompositeAxiosConfig(request);
    const ts = Date.now();
    this.reporter?.log?.testStep?.info?.(
      `${config.method} ${config.baseURL}${axios.getUri(config)}`
    );
    try {
      const response = await axios.request(config);
      this.reporter.log?.testStep?.success?.(
        `HTTP ${response.status} - ${JSON.stringify(response.data ?? '').length} bytes in ${
          Date.now() - ts
        } ms`
      );
      return {
        isOk: true,
        status: response.status,
        headers: response.headers,
        data: response.data,
      };
    } catch (error: any) {
      if (!error.response) {
        // No response at all was received, e.g. timeout or invalid URL
        this.reporter.log?.testStep?.error?.(
          `${config.method} failed in ${Date.now() - ts} ms : ${error.message}`
        );
        throw error;
      }
      this.reporter.log?.testStep?.error?.(
        `HTTP ${error.response.status} - ${
          JSON.stringify(error.response.data ?? '').length
        } bytes in ${Date.now() - ts} ms`
      );
      const rsp: TestResponse = {
        isOk: false,
        status: error.response.status,
        headers: error.response.headers,
        errorMessage: error.response.statusText,
        data: error.response.data,
      };
      return rsp;
    }
  }

  /**
   * Sets a request header on this connector, e.g. for authentication. The header will be present in
   * all requests that are performed by the connector until the header is cleared.
   *
   * @example setHeader('Authorization', 'Bearer xxx');
   * The header is cleared by setting value = undefined.
   */
  setHeader(name: string, value: string | undefined) {
    if (value == undefined) {
      delete this.axiosConfig.headers?.[name];
    } else {
      this.axiosConfig.headers = {
        ...this.axiosConfig.headers,
        [name]: value,
      };
    }
  }

  async get(request: TestConnectorRequest): Promise<TestResponse> {
    return this.request({ ...request, method: 'GET' });
  }

  async put(request: TestConnectorRequest): Promise<TestResponse> {
    return this.request({ ...request, method: 'PUT' });
  }

  async patch(request: TestConnectorRequest): Promise<TestResponse> {
    return this.request({ ...request, method: 'PATCH' });
  }

  async post(request: TestConnectorRequest): Promise<TestResponse> {
    return this.request({ ...request, method: 'POST' });
  }

  async delete(request: TestConnectorRequest): Promise<TestResponse> {
    return this.request({ ...request, method: 'DELETE' });
  }
}

export type RequestParams = { [key: string]: any };

export interface TestConnectorConfig {
  baseUrl: string;
  authHeaders?: AxiosRequestHeaders;
  timeoutMs?: number;
}

export interface TestConnectorRequest {
  url: string;
  body?: any;
  formData?: { [key: string]: any };
  headers?: AxiosRequestHeaders;
  params?: any;
  isUnauthorized?: boolean;
}

export interface TestConnectorMethodRequest extends TestConnectorRequest {
  method: Method;
}
