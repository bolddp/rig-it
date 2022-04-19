import { TestConnector, TestConnectorConfig } from '../connector/TestConnector';
import { ConsoleReporter } from '../reporter/ConsoleReporter';
import { TestReporter } from '../reporter/TestReporter';
import { TestSetup } from '../test/TestSetup';
import { Test } from '../test/Test';
import { CompositeReporter } from '../reporter/CompositeReporter';
import { TestRigRunContext } from './TestRigRunContext';
import { TestStepResponseContext } from '../test/TestStepContext';

export type TestRigRunFunction = (ctx: TestRigRunContext) => Promise<any>;

export interface TestRigConfig {
  reporters?: TestReporter[];
  name?: string;
}

export interface TeardownEntry {
  request: TestSetup;
  testStepResponseContext: TestStepResponseContext;
}

/**
 * The test rig keeps track of the execution of an integration test: running tests, keeping
 * track of any teardown necessary and producing test results.
 */
export class TestRig {
  private config?: TestRigConfig;
  private reporter: CompositeReporter;
  private rigFailureTeardownEntries: TeardownEntry[] = [];
  private rigSuccessTeardownEntries: TeardownEntry[] = [];

  constructor(config?: TestRigConfig) {
    this.config = config;
    this.reporter = this.createCompositeReporter(config?.reporters);
  }

  private createCompositeReporter(reporters?: TestReporter[]): CompositeReporter {
    if ((reporters ?? []).length == 0) {
      reporters = [new ConsoleReporter()];
    }
    return new CompositeReporter(reporters!);
  }

  getConfig(): TestRigConfig | undefined {
    return this.config;
  }

  async run(fnc: TestRigRunFunction) {
    let isSuccess = true;
    await this.reporter.setup?.();
    this.reporter.log?.rig?.info?.(
      this.config?.name ? `Starting: ${this.config.name}` : 'Starting'
    );
    try {
      await fnc({
        rig: this,
        createConnector: (config: TestConnectorConfig): TestConnector => {
          return new TestConnector(config, this.reporter);
        },
        test: async (request: TestSetup): Promise<any> => {
          try {
            const test = new Test({
              rig: this,
              reporter: this.reporter,
            });
            const rsp = await test.execute(request);
            return rsp;
          } catch (error: any) {
            this.reporter.log?.testStep?.error?.(error.message);
            throw error;
          }
        },
      });
      this.reporter.log?.rig?.success?.(
        this.config?.name ? `Finished: ${this.config.name}` : 'Finished'
      );
      await this.performSuccessTeardown();
    } catch (error: any) {
      isSuccess = false;
      this.reporter.log?.rig?.error?.(this.config?.name ? `Failed: ${this.config.name}` : 'Failed');
      await this.performFailureTeardown();
    }
    await this.reporter.finish?.(isSuccess);
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
    this.reporter.log?.rig?.info?.('Starting teardown after test success');
    for (const entry of this.rigSuccessTeardownEntries) {
      this.reporter.log?.test?.info?.(`Tearing down on success: ${entry.request.id}`);
      try {
        await entry.request.rigSuccessTeardown?.(entry.testStepResponseContext);
      } catch (error: any) {
        // Only log, all teardown steps should be attempted
      }
    }
    this.reporter.log?.rig?.info?.('Teardown after test success completed');
  }

  async performFailureTeardown(): Promise<void> {
    if (this.rigFailureTeardownEntries.length == 0) {
      return;
    }
    this.reporter.log?.rig?.info?.('Starting teardown after test failure');
    for (const entry of this.rigFailureTeardownEntries) {
      this.reporter.log?.test?.info?.(`Tearing down on failure: ${entry.request.id}`);
      try {
        await entry.request.rigFailureTeardown?.(entry.testStepResponseContext);
      } catch (error: any) {
        // Only log, all teardown steps should be attempted
      }
    }
    this.reporter.log?.rig?.info?.('Teardown after test failure completed');
  }
}
