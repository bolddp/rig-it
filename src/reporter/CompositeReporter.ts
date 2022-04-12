import { TestResponse } from '../connector/TestResponse';
import { Indent, TestReporter } from './TestReporter';

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

  printWhite(indent: Indent, msg: string): void {
    this.reporters.forEach((logger) => {
      logger.printWhite(indent, msg);
    });
  }

  printBlue(indent: Indent, msg: string): void {
    this.reporters.forEach((logger) => {
      logger.printBlue(indent, msg);
    });
  }

  printGreen(indent: Indent, msg: string): void {
    this.reporters.forEach((logger) => {
      logger.printGreen(indent, msg);
    });
  }

  printRed(indent: Indent, msg: string): void {
    this.reporters.forEach((logger) => {
      logger.printRed(indent, msg);
    });
  }

  printGray(indent: Indent, msg: string): void {
    this.reporters.forEach((logger) => {
      logger.printGray(indent, msg);
    });
  }

  async reportTestResponse?(testId: string, response: TestResponse): Promise<void> {
    for (const logger of this.reporters) {
      await logger.reportTestResponse?.(testId, response);
    }
  }

  async finish(isSuccess: boolean) {
    this.reporters.forEach((logger) => {
      logger.finish?.(isSuccess);
    });
  }
}
