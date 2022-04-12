import { Indent, TestLogger } from './TestLogger';
export declare type HtmlLoggerCallback = (html: string) => Promise<void>;
export declare class HtmlLogger implements TestLogger {
    private lines;
    private callback;
    constructor(callback: HtmlLoggerCallback);
    private htmlLog;
    printWhite(indent: Indent, msg: string): void;
    printBlue(indent: Indent, msg: string): void;
    printGreen(indent: Indent, msg: string): void;
    printRed(indent: Indent, msg: string): void;
    printGray(indent: Indent, msg: string): void;
    finish(): Promise<void>;
}
