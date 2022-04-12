import { TestResponse } from '../connector/TestResponse';
import { Indent, TestLogger } from './TestLogger';
export declare class CompositeLogger implements TestLogger {
    private loggers;
    constructor(loggers: TestLogger[]);
    setup(): Promise<void>;
    printWhite(indent: Indent, msg: string): void;
    printBlue(indent: Indent, msg: string): void;
    printGreen(indent: Indent, msg: string): void;
    printRed(indent: Indent, msg: string): void;
    printGray(indent: Indent, msg: string): void;
    reportTestResponse?(params: {
        testRigName?: string;
        testId: string;
        response: TestResponse;
    }): Promise<void>;
    finish(): Promise<void>;
}
