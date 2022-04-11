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

  white(indent: Indent, msg: string): void {
    this.loggers.forEach((logger) => {
      logger.white(indent, msg);
    });
  }

  blue(indent: Indent, msg: string): void {
    this.loggers.forEach((logger) => {
      logger.blue(indent, msg);
    });
  }

  green(indent: Indent, msg: string): void {
    this.loggers.forEach((logger) => {
      logger.green(indent, msg);
    });
  }

  red(indent: Indent, msg: string): void {
    this.loggers.forEach((logger) => {
      logger.red(indent, msg);
    });
  }

  gray(indent: Indent, msg: string): void {
    this.loggers.forEach((logger) => {
      logger.gray(indent, msg);
    });
  }

  async finish() {
    this.loggers.forEach((logger) => {
      logger.finish?.();
    });
  }
}
