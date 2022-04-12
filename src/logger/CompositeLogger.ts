import { TestResponse } from '../connector/TestResponse';
import { Indent, TestLogger } from './TestLogger';

export class CompositeLogger implements TestLogger {
  private loggers: TestLogger[];

  constructor(loggers: TestLogger[]) {
    this.loggers = loggers ?? [];
  }

  async setup() {
    this.loggers.forEach((logger) => {
      logger.setup?.();
    });
  }

  printWhite(indent: Indent, msg: string): void {
    this.loggers.forEach((logger) => {
      logger.printWhite(indent, msg);
    });
  }

  printBlue(indent: Indent, msg: string): void {
    this.loggers.forEach((logger) => {
      logger.printBlue(indent, msg);
    });
  }

  printGreen(indent: Indent, msg: string): void {
    this.loggers.forEach((logger) => {
      logger.printGreen(indent, msg);
    });
  }

  printRed(indent: Indent, msg: string): void {
    this.loggers.forEach((logger) => {
      logger.printRed(indent, msg);
    });
  }

  printGray(indent: Indent, msg: string): void {
    this.loggers.forEach((logger) => {
      logger.printGray(indent, msg);
    });
  }

  async reportTestResponse?(params: {
    testRigName?: string;
    testId: string;
    response: TestResponse;
  }): Promise<void> {
    for (const logger of this.loggers) {
      await logger.reportTestResponse?.(params);
    }
  }

  async finish() {
    this.loggers.forEach((logger) => {
      logger.finish?.();
    });
  }
}
