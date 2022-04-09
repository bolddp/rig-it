import { Indent, TestLogger } from './TestLogger';
export declare class ConsoleLogger implements TestLogger {
    private getIndent;
    private log;
    white(indent: Indent, msg: string): void;
    blue(indent: Indent, msg: string): void;
    green(indent: Indent, msg: string): void;
    red(indent: Indent, msg: string): void;
    gray(indent: Indent, msg: string): void;
}
