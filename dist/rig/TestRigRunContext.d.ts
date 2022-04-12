import { TestConnector, TestConnectorConfig } from '../connector/TestConnector';
import { TestRig } from './TestRig';
import { TestSetup } from '../test/TestSetup';
export interface TestRigRunContext {
    rig: TestRig;
    createConnector(config: TestConnectorConfig): TestConnector;
    test(request: TestSetup): Promise<any>;
}
