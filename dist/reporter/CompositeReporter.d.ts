import { TestResponse } from '../connector/TestResponse';
import { TestReporter, OptionalTestReporterLoggers } from './TestReporter';
export declare class CompositeReporter implements TestReporter {
    private reporters;
    constructor(reporters: TestReporter[]);
    setup(): Promise<void>;
    log: OptionalTestReporterLoggers;
    reportTestResponse?(testId: string, response: TestResponse): Promise<void>;
    finish(isSuccess: boolean): Promise<void>;
}
