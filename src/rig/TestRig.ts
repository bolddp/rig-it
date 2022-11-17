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
  testConnectorFactory?: (config: TestConnectorConfig, logger: TestReporter) => TestConnector;
}

export interface TeardownEntry {
  request: TestSetup;
  testStepResponseContext: TestStepResponseContext;
}

export interface TestRigRunResult {
  /**
   * Indicates whether the test rig failed or succeeded.
   */
  success: boolean;
  /**
   * A map of all test ids in the test rig, together with their durations (milliseconds)
   */
  durationsMs: { [id: string]: number };
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
  private testIds: string[] = [];

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

  /**
   * Runs the test rig, keeping track of the test in it and performing teardown, logging etc.
   */
  async run(fnc: TestRigRunFunction): Promise<TestRigRunResult> {
    const result: TestRigRunResult = {
      success: true,
      durationsMs: {},
    };
    await this.reporter.setup?.();
    this.reporter.log?.rig?.info?.(
      this.config?.name ? `Starting: ${this.config.name}` : 'Starting'
    );
    try {
      await fnc({
        logger: {
          info: (msg) => this.reporter.log?.test?.info?.(msg),
          success: (msg) => this.reporter.log?.test?.success?.(msg),
          error: (msg) => this.reporter.log?.test?.error?.(msg),
        },
        createConnector: (config: TestConnectorConfig): TestConnector => {
          return (
            this.config?.testConnectorFactory?.(config, this.reporter) ??
            new TestConnector(config, this.reporter)
          );
        },
        test: async (request: TestSetup): Promise<any> => {
          const ts = Date.now();
          try {
            if (this.testIds.includes(request.id)) {
              throw new Error(`Duplicate test id: ${request.id}`);
            } else {
              this.testIds.push(request.id);
            }

            const test = new Test({
              rig: this,
              reporter: this.reporter,
            });
            const rsp = await test.execute(request);
            result.durationsMs[request.id] = Date.now() - ts;

            return rsp;
          } catch (error: any) {
            result.durationsMs[request.id] = Date.now() - ts;
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
      result.success = false;
      this.reporter.log?.rig?.error?.(this.config?.name ? `Failed: ${this.config.name}` : 'Failed');
      await this.performFailureTeardown();
    }
    await this.reporter.finish?.(result);
    return result;
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
        // Only log, to allow all teardown steps to be attempted
        this.reporter.log?.rig?.error?.(
          `Error during teardown of test '${entry.request.id}': ${error.message}`
        );
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
        this.reporter.log?.rig?.error?.(
          `Error during teardown of test '${entry.request.id}': ${error.message}`
        );
      }
    }
    this.reporter.log?.rig?.info?.('Teardown after test failure completed');
  }
}
