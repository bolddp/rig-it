import { TestReporter } from '../reporter/TestReporter';
import { TestConnector, TestConnectorConfig } from '../connector/TestConnector';
import { TestRig, TestRigMetadata } from './TestRig';
import { TestSetup } from '../test/TestSetup';

export interface TestRigRunContext {
  rig: TestRig;
  reporter?: TestReporter;
  metadata?: TestRigMetadata;
  createConnector(config: TestConnectorConfig): TestConnector;
  test(request: TestSetup): Promise<any>;
}
