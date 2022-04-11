import { Indent, TestLogger } from './TestLogger';
export declare type HtmlLoggerCallback = (html: string) => Promise<void>;
export declare class HtmlLogger implements TestLogger {
    private lines;
    private callback;
    constructor(callback: HtmlLoggerCallback);
    private htmlLog;
    white(indent: Indent, msg: string): void;
    blue(indent: Indent, msg: string): void;
    green(indent: Indent, msg: string): void;
    red(indent: Indent, msg: string): void;
    gray(indent: Indent, msg: string): void;
    finish(): Promise<void>;
}
