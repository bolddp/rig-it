import { TestResponse } from '../connector/TestResponse';
import { TestReporter, OptionalTestReporterLoggers } from './TestReporter';
export interface FileReporterConfig {
    /**
     * Function that resolves the filename where the response JSON of a tests act()
     * method (typically a REST API call) should be stored. If this is not defined,
     * the test responses will not be persisted to file.
     */
    testResponseFileNameResolver?: (testId: string) => string;
    /**
     * Function that resolves the filename where the log rows text file should be stored
     * at the end of the test rig run. If this is not defined, the logs will not be
     * persisted to file.
     */
    logsFileNameResolver?: () => string;
}
export declare class FileReporter implements TestReporter {
    private config;
    private logRows;
    log: OptionalTestReporterLoggers;
    constructor(config: FileReporterConfig);
    reportTestResponse(testId: string, response: TestResponse): Promise<void>;
    finish(): Promise<void>;
    private logRow;
    private writeFile;
}
