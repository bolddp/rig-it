import { TestConnector, TestConnectorConfig } from './TestConnector';
import { TestReporter } from './TestReporter';
import { TestRig } from './TestRig';
import { TestRigTestRequest } from './TestRigTestRequest';

export interface TestRigRunContext {
  rig: TestRig;
  reporter: TestReporter;
  createConnector(config: TestConnectorConfig): TestConnector;
  test(request: TestRigTestRequest): Promise<any>;
}
