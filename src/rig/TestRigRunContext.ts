import { TestReporter } from '../reporter/TestReporter';
import { TestConnector, TestConnectorConfig } from '../connector/TestConnector';
import { TestRig } from './TestRig';
import { TestRequest } from '../test/TestRequest';

export interface TestRigRunContext {
  rig: TestRig;
  reporter?: TestReporter;
  createConnector(config: TestConnectorConfig): TestConnector;
  test(request: TestRequest): Promise<any>;
}
