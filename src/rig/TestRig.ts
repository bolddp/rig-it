import { TestConnector, TestConnectorConfig } from '../connector/TestConnector';
import { ConsoleLogger } from '../logger/ConsoleLogger';
import { Indent, TestLogger } from '../logger/TestLogger';
import { TestReporter } from '../reporter/TestReporter';
import { TestSetup } from '../test/TestSetup';
import { Test } from '../test/Test';
import { TeardownEntry } from './TeardownEntry';
import { CompositeLogger } from '../logger/CompositeLogger';
import { TestRigRunContext } from './TestRigRunContext';

export type TestRigRunFunction = (ctx: TestRigRunContext) => Promise<any>;

export interface TestRigConfig {
  loggers?: TestLogger[];
  name?: string;
  reporter?: TestReporter;
}

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
    if ((loggers ?? []).length == 0) {
      loggers = [new ConsoleLogger()];
    }
    return new CompositeLogger(loggers!);
  }

  async run(fnc: TestRigRunFunction) {
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
          return new TestConnector(config, this.logger);
        },
        test: async (request: TestSetup): Promise<any> => {
          try {
            const test = new Test({
              rig: this,
              logger: this.logger,
            });
            return test.execute(request);
          } catch (error: any) {
            this.logger.red(Indent.TestContent, error.message);
            throw error;
          }
        },
      });
      this.logger.blue(
        Indent.TestRig,
        this.config?.name ? `Finished: ${this.config.name}` : 'Finished'
      );
      await this.performSuccessTeardown();
    } catch (error: any) {
      this.logger.red(Indent.TestRig, this.config?.name ? `Failed: ${this.config.name}` : 'Failed');
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

  removeRigFailureTeardown(id: string): number {
    const count = this.rigFailureTeardownEntries.length;
    this.rigFailureTeardownEntries = this.rigFailureTeardownEntries.filter(
      (t) => t.request.id != id
    );
    return count - this.rigFailureTeardownEntries.length;
  }

  removeRigSuccessTeardown(id: string): number {
    const count = this.rigSuccessTeardownEntries.length;
    this.rigSuccessTeardownEntries = this.rigSuccessTeardownEntries.filter(
      (t) => t.request.id != id
    );
    return count - this.rigSuccessTeardownEntries.length;
  }

  async performSuccessTeardown(): Promise<void> {
    if (this.rigSuccessTeardownEntries.length == 0) {
      return;
    }
    this.logger.blue(Indent.TestRig, 'Starting teardown after test success');
    for (const entry of this.rigSuccessTeardownEntries) {
      this.logger.white(Indent.TestHeader, `Tearing down on success: ${entry.request.id}`);
      try {
        await entry.request.rigSuccessTeardown?.(entry.testStepResponseContext);
      } catch (error: any) {
        // Only log, all teardown steps should be attempted
      }
    }
    this.logger.blue(Indent.TestRig, 'Teardown after test success completed');
  }

  async performFailureTeardown(): Promise<void> {
    if (this.rigFailureTeardownEntries.length == 0) {
      return;
    }
    this.logger.blue(Indent.TestRig, 'Starting teardown after test failure');
    for (const entry of this.rigFailureTeardownEntries) {
      this.logger.white(Indent.TestHeader, `Tearing down on failure: ${entry.request.id}`);
      try {
        await entry.request.rigFailureTeardown?.(entry.testStepResponseContext);
      } catch (error: any) {
        // Only log, all teardown steps should be attempted
      }
    }
    this.logger.blue(Indent.TestRig, 'Teardown after test failure completed');
  }
}
