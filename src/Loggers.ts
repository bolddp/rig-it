import chalk from 'chalk';

class ConsoleLogger {
  private indent: string;

  constructor(indent: number) {
    this.indent = ' '.repeat(indent * 2);
  }

  log(msg: string): void {
    console.log(`${this.indent}${msg}`);
  }

  info(msg: string): void {
    this.log(chalk.blue(msg));
  }

  success(msg: string): void {
    this.log(chalk.green(msg));
  }

  failure(msg: string): void {
    this.log(chalk.red(msg));
  }
}

export class TestRigLogger extends ConsoleLogger {
  constructor() {
    super(0);
  }
}

export class TestLogger extends ConsoleLogger {
  constructor() {
    super(1);
  }
}

export class TestConnectorLogger extends ConsoleLogger {
  constructor() {
    super(2);
  }

  request(msg: string): void {
    super.log(chalk.gray(msg));
  }
}
