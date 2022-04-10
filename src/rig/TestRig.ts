import { TestConnector, TestConnectorConfig } from '../connector/TestConnector';
import { ConsoleLogger } from '../logger/ConsoleLogger';
import { Indent, TestLogger } from '../logger/TestLogger';
import { TestReporter } from '../reporter/TestReporter';
import { TestRigRunContext } from './TestRigRunContext';
import { TestRequest } from '../test/TestRequest';
import { Test } from '../test/Test';
import { TeardownEntry } from './TeardownEntry';
import { CompositeLogger } from '../logger/CompositeLogger';

/**
 * The test rig keeps track of the execution of an integration test: running tests, keeping
 * track of any teardown necessary and producing test results.
 */
export class TestRig {
  private config?: TestRigConfig;
  private logger: CompositeLogger;
  private rigFailureTeardownEntries: TeardownEntry[] = [];
  private rigSuccessTeardownEntries: TeardownEntry[] = [];

  constructor(config?: TestRigConfig) {
    this.config = config;
    this.logger = this.createCompositeLogger(config?.loggers);
  }

  createCompositeLogger(loggers?: TestLogger[]): CompositeLogger {
    return new CompositeLogger(loggers ?? [new ConsoleLogger()]);
  }

  async run(fnc: (ctx: TestRigRunContext) => Promise<any>) {
    await this.logger.setup?.();
    this.logger.blue(
      Indent.TestRig,
      this.config?.name ? `Starting: ${this.config.name}` : 'Starting'
    );
    try {
      await fnc({
        rig: this,
        reporter: this.config?.reporter,
        createConnector: (config: TestConnectorConfig): TestConnector => {
          return new TestConnector(this, {
            ...config,
            logger: this.logger,
          });
        },
        test: async (request: TestRequest): Promise<any> => {
          const test = new Test({
            rig: this,
            logger: this.logger,
          });
          await test.execute(request);
        },
      });
      this.logger.blue(
        Indent.TestRig,
        `${this.config?.name ? `Finished: ${this.config.name}` : 'Finished'} - Starting teardown`
      );
      await this.performSuccessTeardown();
    } catch (error: any) {
      this.logger.red(
        Indent.TestRig,
        `${this.config?.name ? `Failed: ${this.config.name}` : 'Failed'} - Starting teardown`
      );
      await this.performFailureTeardown();
    }
    await this.logger.finish?.();
  }

  addRigFailureTeardown(entry: TeardownEntry): void {
    this.rigFailureTeardownEntries.unshift(entry);
  }

  addRigSuccessTeardown(entry: TeardownEntry): void {
    this.rigSuccessTeardownEntries.unshift(entry);
  }

  removeRigFailureTeardown(id: string): void {
    this.rigFailureTeardownEntries = this.rigFailureTeardownEntries.filter(
      (t) => t.request.id != id
    );
  }

  removeRigSuccessTeardown(id: string): void {
    this.rigSuccessTeardownEntries = this.rigSuccessTeardownEntries.filter(
      (t) => t.request.id != id
    );
  }

  async performSuccessTeardown(): Promise<void> {
    for (const entry of this.rigSuccessTeardownEntries) {
      this.logger.white(Indent.TestHeader, `Tearing down on success: ${entry.request.id}`);
      try {
        await entry.request.onRigSuccessTeardown?.(entry.testStepResponseContext);
      } catch (error: any) {
        // Only log, all teardown steps should be attempted
      }
    }
  }

  async performFailureTeardown(): Promise<void> {
    for (const entry of this.rigFailureTeardownEntries) {
      this.logger.white(Indent.TestHeader, `Tearing down on failure: ${entry.request.id}`);
      try {
        await entry.request.onRigFailureTeardown?.(entry.testStepResponseContext);
      } catch (error: any) {
        // Only log, all teardown steps should be attempted
      }
    }
  }
}

export interface TestRigConfig {
  loggers?: TestLogger[];
  name?: string;
  reporter?: TestReporter;
}
