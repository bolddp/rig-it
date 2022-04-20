import { TestResponse } from '../connector/TestResponse';
import { TestReporterLogger } from '../reporter/TestReporter';

/**
 * Contains data and operations that can be used in the test steps arrange() and act().
 */
export interface TestStepContext {
  /**
   * Use this logger to output customized log messages during the test execution.
   */
  logger: TestReporterLogger;
  /**
   * This function can be used to remove a success teardown function that was added by a previous test,
   * e.g. if this test performs the same cleanup action as the teardown would.
   * @param id the id of the test whose success teardown function should be removed
   */
  removeSuccessTeardown(id: string): void;
  /**
   * This function can be used to remove a failure teardown function that was added by a previous test,
   * e.g. if this test performs the same cleanup action as the teardown would.
   * @param id the id of the test whose failure teardown function should be removed
   */
  removeFailureTeardown(id: string): void;
}

export interface TestStepResponseContext extends TestStepContext {
  /**
   * Contains the response from the act() function of the test, e.g. HTTP headers and status code,
   * as well as the response body, if there was any.
   */
  response?: TestResponse;
}
