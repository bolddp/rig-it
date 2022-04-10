import { Indent, TestLogger } from './TestLogger';
export declare class CompositeLogger implements TestLogger {
    private loggers;
    constructor(loggers: TestLogger[]);
    setup(): Promise<void>;
    white(indent: Indent, msg: string): void;
    blue(indent: Indent, msg: string): void;
    green(indent: Indent, msg: string): void;
    red(indent: Indent, msg: string): void;
    gray(indent: Indent, msg: string): void;
    finish(): Promise<void>;
}
