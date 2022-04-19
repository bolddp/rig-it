import { TestResponse } from '../connector/TestResponse';
export interface TestReporter {
    setup?(): Promise<void>;
    log?: TestReporterLogger;
    reportTestResponse?(testId: string, response: TestResponse): Promise<void>;
    finish?(success: boolean): Promise<void>;
}
export interface TestReporterLoggerLevels {
    info?: (msg: string) => void;
    success?: (msg: string) => void;
    error?: (msg: string) => void;
}
export interface TestReporterLogger {
    rig?: TestReporterLoggerLevels;
    test?: TestReporterLoggerLevels;
    testStep?: TestReporterLoggerLevels;
}
export declare enum Indent {
    TestRig = 0,
    TestHeader = 1,
    TestContent = 2
}
