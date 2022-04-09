export interface TestLogger {
    setup?(): Promise<void>;
    white(indent: Indent, msg: string): void;
    blue(indent: Indent, msg: string): void;
    green(indent: Indent, msg: string): void;
    red(indent: Indent, msg: string): void;
    gray(indent: Indent, msg: string): void;
    finish?(): Promise<void>;
}
export declare enum Indent {
    TestRig = 0,
    TestHeader = 1,
    TestContent = 2
}
