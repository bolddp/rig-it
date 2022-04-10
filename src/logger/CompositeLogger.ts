import { Indent, TestLogger } from './TestLogger';

export class CompositeLogger implements TestLogger {
  private loggers: TestLogger[];

  constructor(loggers: TestLogger[]) {
    this.loggers = loggers ?? [];
  }

  async setup() {
    for (const logger of this.loggers) {
      logger.setup?.();
    }
  }

  white(indent: Indent, msg: string): void {
    for (const logger of this.loggers) {
      logger.white(indent, msg);
    }
  }
  blue(indent: Indent, msg: string): void {
    for (const logger of this.loggers) {
      logger.blue(indent, msg);
    }
  }
  green(indent: Indent, msg: string): void {
    for (const logger of this.loggers) {
      logger.green(indent, msg);
    }
  }
  red(indent: Indent, msg: string): void {
    for (const logger of this.loggers) {
      logger.red(indent, msg);
    }
  }
  gray(indent: Indent, msg: string): void {
    for (const logger of this.loggers) {
      logger.gray(indent, msg);
    }
  }

  async finish() {
    for (const logger of this.loggers) {
      logger.finish?.();
    }
  }
}
