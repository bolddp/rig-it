import { TestReporter } from '../reporter/TestReporter';
import { TestConnector, TestConnectorConfig } from '../connector/TestConnector';
import { TestRig } from './TestRig';
import { TestRigTestRequest } from './TestRigTestRequest';

export interface TestRigRunContext {
  rig: TestRig;
  reporter?: TestReporter;
  createConnector(config: TestConnectorConfig): TestConnector;
  test(request: TestRigTestRequest): Promise<any>;
}
