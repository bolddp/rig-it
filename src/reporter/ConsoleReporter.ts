import chalk from 'chalk';
import { OptionalTestReporterLoggers, TestReporter } from './TestReporter';

/**
 * Produces indented, colored (and thereby highly readable) logs to console.
 */
export class ConsoleReporter implements TestReporter {
  log: OptionalTestReporterLoggers = {
    rig: {
      info: (msg) => this.logRow(0, chalk.blue(msg)),
      error: (msg) => this.logRow(0, chalk.red(msg)),
      success: (msg) => this.logRow(0, chalk.blue(msg)),
    },
    test: {
      info: (msg) => this.logRow(1, chalk.white(msg)),
      error: (msg) => this.logRow(1, chalk.red(msg)),
      success: (msg) => this.logRow(1, chalk.green(msg)),
    },
    testStep: {
      info: (msg) => this.logRow(2, chalk.gray(msg)),
      error: (msg) => this.logRow(2, chalk.red(msg)),
      success: (msg) => this.logRow(2, chalk.green(msg)),
    },
  };

  private logRow(indent: number, msg: string): void {
    console.log(`${' '.repeat(indent * 2)}${msg}`);
  }
}
