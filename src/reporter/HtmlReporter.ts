import * as path from 'path';
import * as fs from 'fs';
import { OptionalTestReporterLoggers, TestReporter } from './TestReporter';

export interface HtmlReporterConfig {
  /**
   * The full path to the filename where the HTML logs should be persisted.
   * If the path doesn't exist, the reporter will try to create it recursively.
   */
  fileName: string;
}

export class HtmlReporter implements TestReporter {
  private config: HtmlReporterConfig;
  private lines: string[] = [];

  constructor(config: HtmlReporterConfig) {
    this.config = config;
  }

  private htmlLog(indent: number, color: string, msg: string) {
    this.lines.push(
      `<p style="color: ${color}">${'&nbsp;'.repeat(indent * indentSize)}${msg.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ''
      )}</p>`
    );
  }

  log: OptionalTestReporterLoggers = {
    rig: {
      info: (msg) => this.htmlLog(0, blueColor, msg),
      error: (msg) => this.htmlLog(0, redColor, msg),
      success: (msg) => this.htmlLog(0, blueColor, msg),
    },
    test: {
      info: (msg) => this.htmlLog(1, whiteColor, msg),
      error: (msg) => this.htmlLog(1, redColor, msg),
      success: (msg) => this.htmlLog(1, greenColor, msg),
    },
    testStep: {
      info: (msg) => this.htmlLog(2, grayColor, msg),
      error: (msg) => this.htmlLog(2, redColor, msg),
      success: (msg) => this.htmlLog(2, greenColor, msg),
    },
  };

  async finish(): Promise<void> {
    const style = `<style>
    p { margin: 0 }
    </style>`;
    const body = `${style}<body style="background-color: #000000; font-family: sans-serif">${this.lines.join(
      ''
    )}</body>`;
    const filePath = path.dirname(this.config.fileName);
    fs.mkdirSync(filePath, { recursive: true });
    fs.writeFileSync(this.config.fileName, body);
  }
}

export type HtmlReporterCallback = (html: string) => Promise<void>;

const whiteColor = '#ffffff';
const blueColor = '#1e90ff';
const greenColor = '#00ff00';
const redColor = '#ff0000';
const grayColor = '#999999';

const indentSize = 4;
