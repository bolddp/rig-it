import { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';

export interface TestResponse {
  isOk: boolean;
  status?: number;
  headers?: RawAxiosResponseHeaders | AxiosResponseHeaders;
  data?: any;
  errorMessage?: string;
}
