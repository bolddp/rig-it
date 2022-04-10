import { listeners } from 'process';
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

  private log(indent: Indent, color: string, msg: string) {
    this.lines.push(`<p style="color: ${color}">${'&nbsp;'.repeat(indent * indentSize)}${msg}</p>`);
  }

  white(indent: Indent, msg: string): void {
    this.log(indent, whiteColor, msg);
  }

  blue(indent: Indent, msg: string): void {
    this.log(indent, blueColor, msg);
  }

  green(indent: Indent, msg: string): void {
    this.log(indent, greenColor, msg);
  }

  red(indent: Indent, msg: string): void {
    this.log(indent, redColor, msg);
  }

  gray(indent: Indent, msg: string): void {
    this.log(indent, grayColor, msg);
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
