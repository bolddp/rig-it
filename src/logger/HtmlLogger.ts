import chalk from 'chalk';
import { Indent, TestLogger } from './TestLogger';

export type HtmlLoggerCallback = (html: string) => Promise<void>;

const whiteColor = '#ffffff';
const blueColor = '#1e90ff';
const greenColor = '#00ff00';
const redColor = '#ff0000';
const grayColor = '#999999';

const indentSize = 4;

export class HtmlLogger implements TestLogger {
  private lines: string[] = [];
  private callback: HtmlLoggerCallback;

  constructor(callback: HtmlLoggerCallback) {
    this.callback = callback;
  }

  private htmlLog(indent: Indent, color: string, msg: string) {
    this.lines.push(
      `<p style="color: ${color}">${'&nbsp;'.repeat(indent * indentSize)}${msg.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ''
      )}</p>`
    );
  }

  printWhite(indent: Indent, msg: string): void {
    this.htmlLog(indent, whiteColor, msg);
  }

  printBlue(indent: Indent, msg: string): void {
    this.htmlLog(indent, blueColor, msg);
  }

  printGreen(indent: Indent, msg: string): void {
    this.htmlLog(indent, greenColor, msg);
  }

  printRed(indent: Indent, msg: string): void {
    this.htmlLog(indent, redColor, msg);
  }

  printGray(indent: Indent, msg: string): void {
    this.htmlLog(indent, grayColor, msg);
  }

  async finish(): Promise<void> {
    const style = `<style>
    p { margin: 0 }
    </style>`;
    const body = `${style}<body style="background-color: #000000; font-family: sans-serif">${this.lines.join(
      ''
    )}</body>`;
    await this.callback(body);
  }
}
