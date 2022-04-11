import { TestResponse } from '../connector/TestResponse';
import { TestStepContext, TestStepResponseContext } from './TestStepContext';

export interface TestRequest {
  id: string;
  arrange?: (ctx: TestStepContext) => Promise<void>;
  /**
   * Add code to perform the test here. The act() function must return a {@link TestResponse} that
   * can be asserted. Usually the test response should come from an API call made by a {@link TestConnector}.
   * If you're tempted to add code that does not return any response in the act() method,
   * you can add the code to the arrange() method instead.
   */
  act: (ctx: TestStepContext) => Promise<TestResponse>;
  /**
   * Perform assertions on the data returned by the act() function. If the act() method is expected to fail,
   * e.g. due to testing applying invalid data, use the assertError() function to perform the assertion instead.
   *
   * The response from the act() method is available in the ctx.response property.
   *
   * If both this function and the assertError() function is set, an error is thrown since a test cannot
   * be expected to succeed and fail at the same time.
   */
  assert?: (ctx: TestStepResponseContext) => Promise<void>;
  /**
   * Perform assertions on the data returned by the act() function, when you're expecting the call to fail.
   * If this property is set and the act() function succeeds, the test is considered a failure.
   *
   * If both this function and the assertError() function is set, an error is thrown since a test cannot
   * be expected to succeed and fail at the same time.
   */
  assertError?: (ctx: TestStepResponseContext) => Promise<void>;
  /**
   * Add test cleanup code here, e.g. deletion of a resource that the test creates, that should be run
   * only if the test rig fails at some point.
   *
   * When the rig fails, the onRigFailure functions that have been encountered will be executed in
   * reverse order of how they were declared, e.g. the onRigFailure code of an early test will be
   * executed after the onRigFailure code of a later test.
   */
  onRigFailureTeardown?: (ctx: TestStepResponseContext) => Promise<void>;
  /**
   * Add test cleanup code here, e.g. deletion of a resource that the test creates, that should be run
   * only if the test rig succeeds.
   */
  onRigSuccessTeardown?: (ctx: TestStepResponseContext) => Promise<void>;
}
