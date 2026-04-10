export interface TestResponse {
  isOk: boolean;
  status?: number;
  headers?: Record<string, string>;
  data?: any;
  errorMessage?: string;
}
