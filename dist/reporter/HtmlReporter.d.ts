import { TestReporter, TestReporterLogger } from './TestReporter';
export interface HtmlReporterConfig {
    fileName: string;
}
export declare class HtmlReporter implements TestReporter {
    private config;
    private lines;
    constructor(config: HtmlReporterConfig);
    private htmlLog;
    log: TestReporterLogger;
    finish(): Promise<void>;
}
export declare type HtmlReporterCallback = (html: string) => Promise<void>;
