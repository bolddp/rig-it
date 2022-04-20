import { TestResponse } from '../connector/TestResponse';
export interface TestReporter {
    setup?(): Promise<void>;
    log?: OptionalTestReporterLoggers;
    reportTestResponse?(testId: string, response: TestResponse): Promise<void>;
    finish?(success: boolean): Promise<void>;
}
export interface OptionalTestReporterLogger {
    info?: (msg: string) => void;
    success?: (msg: string) => void;
    error?: (msg: string) => void;
}
export interface OptionalTestReporterLoggers {
    rig?: OptionalTestReporterLogger;
    test?: OptionalTestReporterLogger;
    testStep?: OptionalTestReporterLogger;
}
export interface TestReporterLogger {
    info: (msg: string) => void;
    success: (msg: string) => void;
    error: (msg: string) => void;
}
