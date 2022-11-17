import { TestResponse } from '../connector/TestResponse';
import { TestRigRunResult } from '../rig/TestRig';
import { OptionalTestReporterLoggers, TestReporter } from './TestReporter';
export declare class CompositeReporter implements TestReporter {
    private reporters;
    constructor(reporters: TestReporter[]);
    setup(): Promise<void>;
    log: OptionalTestReporterLoggers;
    reportTestResponse?(testId: string, response: TestResponse): Promise<void>;
    finish(result: TestRigRunResult): Promise<void>;
}
