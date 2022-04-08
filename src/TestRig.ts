import { TestConnector, TestConnectorConfig } from './TestConnector';
import { TestReporter } from './TestReporter';
import { TestRigRunContext } from './TestRigRunContext';

/**
 * The test rig keeps track of the execution of an integration test: running tests, keeping
 * track of any teardown necessary and producing test results.
 */
export class TestRig {
  private config: TestRigConfig;

  constructor(config: TestRigConfig) {
    this.config = config;
  }

  async run(fnc: (ctx: TestRigRunContext) => Promise<any>) {
    return await fnc({
      rig: this,
      reporter: this.config.reporter,
      createConnector: (config) => {
        return new TestConnector(this, config);
      },
      test: async (request) => {
        await request.setup?.();
        const rsp = await request.execute();
        await request.assert?.(rsp);
        await request.assertError?.(rsp);
        await request.teardown?.(rsp);
      },
    });
  }
}

export interface TestRigConfig {
  reporter?: TestReporter;
}
