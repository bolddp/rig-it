import { AxiosResponseHeaders } from 'axios';
export interface TestResponse {
    status?: number;
    isOk: boolean;
    headers: AxiosResponseHeaders;
    data?: any;
    errorMessage?: string;
}
