import { TestResponse } from '../connector/TestResponse';
import { TestStepContext, TestStepResponseContext } from './TestStepContext';

/**
 * Describes the setup of a test.
 */
export interface TestSetup {
  /**
   * The id of the test, for logging and logic operation purposes. This id needs to be unique during
   * the execution of a test run.
   */
  id: string;
  /**
   * Add code here to perform preparations for test, if necessary.
   */
  arrange?: (ctx: TestStepContext) => Promise<void>;
  /**
   * Add code to perform the test here. The act() function must at the minimum return a {@link TestResponse}
   * where the isOk property is set, to indicate if the action was a success or failure.
   * The simplest way to return a usable result, if the test consists of an API call, is to use the {@link TestConnector}
   * class, that can perform HTTP calls and return them as TestResponses.
   */
  act: (ctx: TestStepContext) => Promise<TestResponse>;
  /**
   * If the act() function returns a response, e.g. from a {@link TestConnector}, and you expect the call to
   * succeed, you can perform your assertions in this function.
   * If this property is set and the act() functions returns a failure response, the test is considered a failure.
   * This also applies if either the assert() or the assertError() functions are set.
   *
   * If both this function and the assertError() function is set, an error is thrown since a test cannot
   * be expected to succeed and fail at the same time.
   */
  assert?: (ctx: TestStepResponseContext) => Promise<void>;
  /**
   * If the act() function returns a response, e.g. from a {@link TestConnector}, but you expect the call to
   * be a failure, you should perform your assertions in this function to indicate that the failure is expected.
   * If this property is set and the act() function succeeds, the test is considered a failure.
   *
   * If both this function and the assertError() function is set, an error is thrown since a test cannot
   * be expected to both succeed and fail at the same time.
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
  rigFailureTeardown?: (ctx: TestStepResponseContext) => Promise<void>;
  /**
   * Add test cleanup code here, e.g. deletion of a resource that the test creates, that should be run
   * only if the test rig succeeds.
   */
  rigSuccessTeardown?: (ctx: TestStepResponseContext) => Promise<void>;
}
