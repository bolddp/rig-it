import { TestConnector, TestConnectorConfig } from '../connector/TestConnector';
import { TestSetup } from '../test/TestSetup';
import { TestReporterLogger } from '../reporter/TestReporter';
export interface TestRigRunContext {
    logger: TestReporterLogger;
    createConnector(config: TestConnectorConfig): TestConnector;
    test(request: TestSetup): Promise<any>;
}
