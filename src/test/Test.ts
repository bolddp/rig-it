import { Indent, TestLogger } from '../logger/TestLogger';
import { TeardownEntry } from '../rig/TeardownEntry';
import { TestRig } from '../rig/TestRig';
import { TestRequest } from './TestRequest';
import { TestStepContext, TestStepResponseContext } from './TestStepContext';

export class Test {
  private config: TestConfig;

  constructor(config: TestConfig) {
    this.config = config;
  }

  async execute(request: TestRequest): Promise<void> {
    const ctx: TestStepContext = {
      rig: this.config.rig,
      test: this,
    };
    this.config.logger.white(Indent.TestHeader, `Test: ${request.id}`);

    await request.arrange?.(ctx);

    const ts = Date.now();
    const response = await request.act(ctx);
    const testStepResponseContext: TestStepResponseContext = {
      ...ctx,
      response,
    };

    if (response.isOk) {
      if (!request.assertError) {
        // Expected and got success
        this.config.logger?.green(
          Indent.TestContent,
          `Success : HTTP ${response.status} - ${
            JSON.stringify(response.data ?? '').length
          } bytes in ${Date.now() - ts} ms`
        );

        // Adding teardown entry before the assertion to get proper teardown
        this.addTeardownEntries({ request, testStepResponseContext });

        try {
          await request.assert?.(testStepResponseContext);
        } catch (error: any) {
          this.config.logger?.red(
            Indent.TestContent,
            `Assertion failed! ${error.message.replace(/[\r\n]/g, ', ')}`
          );
          throw new Error('Assertion failed');
        }
      } else {
        // Expected failure, got success
        this.config.logger?.red(
          Indent.TestContent,
          `Unexpected success : HTTP ${response.status} - ${
            JSON.stringify(response.data ?? '').length
          } bytes in ${Date.now() - ts} ms`
        );

        throw new Error('Unexpected success');
      }
    } else {
      if (!request.assertError) {
        // Expected success, but the test failed
        this.config.logger?.red(
          Indent.TestContent,
          `Unexpected failure : HTTP ${response.status} - ${
            JSON.stringify(response.data ?? '').length
          } bytes in ${Date.now() - ts} ms`
        );

        throw new Error('Unexpected failure');
      } else {
        // Expected and got failure
        this.config.logger?.green(
          Indent.TestContent,
          `Expected failure : HTTP ${response.status} - ${
            JSON.stringify(response.data ?? '').length
          } bytes in ${Date.now() - ts} ms`
        );

        this.addTeardownEntries({ request, testStepResponseContext });

        await request.assertError?.(testStepResponseContext);
      }
    }
  }

  private addTeardownEntries(entry: TeardownEntry) {
    if (entry.request.onRigSuccessTeardown) {
      this.config.rig.addRigSuccessTeardown(entry);
    }
    if (entry.request.onRigFailureTeardown) {
      this.config.rig.addRigFailureTeardown(entry);
    }
  }
}

export interface TestConfig {
  rig: TestRig;
  logger: TestLogger;
}
