import { TestConnector, TestConnectorConfig } from '../connector/TestConnector';
import { TestSetup } from '../test/TestSetup';
import { TestReporterLogger } from '../reporter/TestReporter';

export interface TestRigRunContext {
  logger: TestReporterLogger;
  createConnector(config: TestConnectorConfig): TestConnector;
  /**
   * Setup and execute a test. The function returns a Promise that contains the
   * response data from the test action.
   */
  test(request: TestSetup): Promise<any>;
}
