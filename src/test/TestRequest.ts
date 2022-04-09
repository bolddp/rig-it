import { TestResponse } from '../connector/TestResponse';
import { TestStepContext, TestStepResponseContext } from './TestStepContext';

export interface TestRequest {
  id: string;
  arrange?: (ctx: TestStepContext) => Promise<void>;
  act: (ctx: TestStepContext) => Promise<TestResponse>;
  assert?: (ctx: TestStepResponseContext) => Promise<void>;
  assertError?: TestStepResponseCtxFnc;
  /**
   * Add cleanup code here, e.g. deletion of a resource that the test creates, that should be run
   * only if the test rig fails at some point.
   *
   * When the rig fails, the onRigFailure functions that have been encountered will be executed in
   * reverse order of how they were declared, e.g. the onRigFailure code of an early test will be
   * executed after the onRigFailure code of a later test.
   */
  onRigFailureTeardown?: TestStepResponseCtxFnc;
  /**
   * Add cleanup code here, e.g. deletion of a resource that the test creates, that should be run
   * only if the test rig succeeds.
   */
  onRigSuccessTeardown?: TestStepResponseCtxFnc;
}

export type TestStepResponseCtxFnc = (
  ctx: TestStepResponseContext
) => Promise<void>;
