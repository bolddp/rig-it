import { TestResponse } from '../connector/TestResponse';
import { TestReporter, TestReporterLogger } from './TestReporter';
export interface FileReporterConfig {
    testResponseFileNameResolver?: (testId: string) => string;
    logsFileNameResolver?: () => string;
}
export declare class FileReporter implements TestReporter {
    private config;
    private logRows;
    log: TestReporterLogger;
    constructor(config: FileReporterConfig);
    reportTestResponse(testId: string, response: TestResponse): Promise<void>;
    finish(): Promise<void>;
    private logRow;
    private writeFile;
}
