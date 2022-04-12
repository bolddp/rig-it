import chalk from 'chalk';
import { Indent, TestLogger } from './TestLogger';

export class ConsoleLogger implements TestLogger {
  private getIndent(indent: Indent): string {
    return ' '.repeat(indent * 2);
  }

  private log(indent: Indent, msg: string): void {
    console.log(`${this.getIndent(indent)}${msg}`);
  }

  printWhite(indent: Indent, msg: string): void {
    this.log(indent, chalk.white(msg));
  }
  printBlue(indent: Indent, msg: string): void {
    this.log(indent, chalk.blue(msg));
  }
  printGreen(indent: Indent, msg: string): void {
    this.log(indent, chalk.green(msg));
  }
  printRed(indent: Indent, msg: string): void {
    this.log(indent, chalk.red(msg));
  }
  printGray(indent: Indent, msg: string): void {
    this.log(indent, chalk.gray(msg));
  }
}
