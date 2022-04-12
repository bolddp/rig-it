import { TestResponse } from '../connector/TestResponse';
import { Indent, TestReporter } from './TestReporter';
export declare class CompositeReporter implements TestReporter {
    private reporters;
    constructor(reporters: TestReporter[]);
    setup(): Promise<void>;
    printWhite(indent: Indent, msg: string): void;
    printBlue(indent: Indent, msg: string): void;
    printGreen(indent: Indent, msg: string): void;
    printRed(indent: Indent, msg: string): void;
    printGray(indent: Indent, msg: string): void;
    reportTestResponse?(testId: string, response: TestResponse): Promise<void>;
    finish(isSuccess: boolean): Promise<void>;
}
