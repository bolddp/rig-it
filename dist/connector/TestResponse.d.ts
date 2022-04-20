import { AxiosResponseHeaders } from 'axios';
export interface TestResponse {
    isOk: boolean;
    status?: number;
    headers?: AxiosResponseHeaders;
    data?: any;
    errorMessage?: string;
}
