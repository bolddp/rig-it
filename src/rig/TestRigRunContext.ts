import { TestReporter } from '../reporter/TestReporter';
import { TestConnector, TestConnectorConfig } from '../connector/TestConnector';
import { TestRig } from './TestRig';
import { TestSetup } from '../test/TestSetup';

export interface TestRigRunContext {
  rig: TestRig;
  reporter?: TestReporter;
  createConnector(config: TestConnectorConfig): TestConnector;
  test(request: TestSetup): Promise<any>;
}
