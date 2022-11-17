import { TestResponse } from '../connector/TestResponse';
import { TestRigRunResult } from '../rig/TestRig';
import { OptionalTestReporterLoggers, TestReporter } from './TestReporter';

export class CompositeReporter implements TestReporter {
  private reporters: TestReporter[];

  constructor(reporters: TestReporter[]) {
    this.reporters = reporters ?? [];
  }

  async setup() {
    this.reporters.forEach((logger) => {
      logger.setup?.();
    });
  }

  log: OptionalTestReporterLoggers = {
    rig: {
      info: (msg) => this.reporters.forEach((r) => r.log?.rig?.info?.(msg)),
      success: (msg) => this.reporters.forEach((r) => r.log?.rig?.success?.(msg)),
      error: (msg) => this.reporters.forEach((r) => r.log?.rig?.error?.(msg)),
    },
    test: {
      info: (msg) => this.reporters.forEach((r) => r.log?.test?.info?.(msg)),
      success: (msg) => this.reporters.forEach((r) => r.log?.test?.success?.(msg)),
      error: (msg) => this.reporters.forEach((r) => r.log?.test?.error?.(msg)),
    },
    testStep: {
      info: (msg) => this.reporters.forEach((r) => r.log?.testStep?.info?.(msg)),
      success: (msg) => this.reporters.forEach((r) => r.log?.testStep?.success?.(msg)),
      error: (msg) => this.reporters.forEach((r) => r.log?.testStep?.error?.(msg)),
    },
  };

  async reportTestResponse?(testId: string, response: TestResponse): Promise<void> {
    for (const logger of this.reporters) {
      await logger.reportTestResponse?.(testId, response);
    }
  }

  async finish(result: TestRigRunResult) {
    this.reporters.forEach((logger) => {
      logger.finish?.(result);
    });
  }
}
