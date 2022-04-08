import { TestResponse } from './TestResponse';

export interface TestRigTestRequest {
  setup?: () => Promise<void>;
  execute: () => Promise<TestResponse>;
  assert?: (rsp: TestResponse) => Promise<void>;
  assertError?: (rsp: TestResponse) => Promise<void>;
  teardown?: (rsp: TestResponse) => Promise<void>;
}
