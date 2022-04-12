import { Indent, TestReporter } from './TestReporter';
export declare type HtmlReporterCallback = (html: string) => Promise<void>;
export declare class HtmlReporter implements TestReporter {
    private lines;
    private callback;
    constructor(callback: HtmlReporterCallback);
    private htmlLog;
    printWhite(indent: Indent, msg: string): void;
    printBlue(indent: Indent, msg: string): void;
    printGreen(indent: Indent, msg: string): void;
    printRed(indent: Indent, msg: string): void;
    printGray(indent: Indent, msg: string): void;
    finish(): Promise<void>;
}
