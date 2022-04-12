import { Indent, TestReporter } from './TestReporter';
export declare class ConsoleReporter implements TestReporter {
    private getIndent;
    private log;
    printWhite(indent: Indent, msg: string): void;
    printBlue(indent: Indent, msg: string): void;
    printGreen(indent: Indent, msg: string): void;
    printRed(indent: Indent, msg: string): void;
    printGray(indent: Indent, msg: string): void;
}
