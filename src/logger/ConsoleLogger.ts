import chalk from 'chalk';
import { Indent, TestLogger } from './TestLogger';

export class ConsoleLogger implements TestLogger {
  private getIndent(indent: Indent): string {
    return ' '.repeat(indent * 2);
  }

  private log(indent: Indent, msg: string): void {
    console.log(`${this.getIndent(indent)}${msg}`);
  }

  white(indent: Indent, msg: string): void {
    this.log(indent, chalk.white(msg));
  }
  blue(indent: Indent, msg: string): void {
    this.log(indent, chalk.blue(msg));
  }
  green(indent: Indent, msg: string): void {
    this.log(indent, chalk.green(msg));
  }
  red(indent: Indent, msg: string): void {
    this.log(indent, chalk.red(msg));
  }
  gray(indent: Indent, msg: string): void {
    this.log(indent, chalk.gray(msg));
  }
}
