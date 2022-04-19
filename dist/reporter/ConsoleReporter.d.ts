import { TestReporter, TestReporterLogger } from './TestReporter';
export declare class ConsoleReporter implements TestReporter {
    log: TestReporterLogger;
    private logRow;
}
