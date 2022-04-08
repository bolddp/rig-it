import expect from 'expect';
import { TestConnector, TestConnectorConfig } from '../connector/TestConnector';
import { TestReporter } from '../reporter/TestReporter';
import { TestRigRunContext } from './TestRigRunContext';
import { TestConnectorLogger, TestLogger, TestRigLogger } from '../Loggers';
import { TestRigTestRequest } from './TestRigTestRequest';

/**
 * The test rig keeps track of the execution of an integration test: running tests, keeping
 * track of any teardown necessary and producing test results.
 */
export class TestRig {
  private config?: TestRigConfig;

  constructor(config?: TestRigConfig) {
    this.config = config;
  }

  private createConnector(config: TestConnectorConfig): TestConnector {
    return new TestConnector(this, {
      ...config,
      log: new TestConnectorLogger(),
    });
  }

  private async test(request: TestRigTestRequest): Promise<any> {
    const testLogger = new TestLogger();
    testLogger.log(`Test: ${request.testName}`);
    await request.setup?.();
    const rsp = await request.execute();
    await request.assert?.(rsp, expect);
    await request.assertError?.(rsp);
    await request.onRigFailure?.(rsp);
  }

  async run(fnc: (ctx: TestRigRunContext) => Promise<any>) {
    const rigLog = new TestRigLogger();
    rigLog.info(
      this.config?.name ? `Starting: ${this.config.name}` : 'Starting'
    );
    await fnc({
      rig: this,
      reporter: this.config?.reporter,
      createConnector: this.createConnector,
      test: this.test,
    });
    rigLog.info(
      this.config?.name ? `Finished: ${this.config.name}` : 'Finished'
    );
  }
}

export interface TestRigConfig {
  name?: string;
  reporter?: TestReporter;
}
