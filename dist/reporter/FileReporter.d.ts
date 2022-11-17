import { TestResponse } from '../connector/TestResponse';
import { OptionalTestReporterLoggers, TestReporter } from './TestReporter';
export interface FileReporterConfig {
    /**
     * Function that resolves the filename where the response JSON of a tests act()
     * method (typically a REST API call) should be stored. If this is not defined,
     * the test responses will not be persisted to file.
     */
    testResponseFileNameResolver?: (testId: string) => string;
    /**
     * The full path where the log rows text file should be stored
     * at the end of the test rig run. If this is not defined, the logs will not be
     * persisted to file.
     */
    logsFileName?: string;
}
/**
 * Test reporter that logs to file. This includes the responses from the tests, if
 * the FileReporterConfig.testResponseFileNameResolver property is set.
 *
 * If the path of a file that is about to be written by the reporter doesn't exist,
 * the reporter will try to create it.
 */
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
