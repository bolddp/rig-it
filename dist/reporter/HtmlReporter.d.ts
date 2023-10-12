import { OptionalTestReporterLoggers, TestReporter } from './TestReporter';
export interface HtmlReporterConfig {
    /**
     * The full path to the filename where the HTML logs should be persisted.
     * If the path doesn't exist, the reporter will try to create it recursively.
     */
    fileName: string;
}
export declare class HtmlReporter implements TestReporter {
    private config;
    private lines;
    constructor(config: HtmlReporterConfig);
    private htmlLog;
    log: OptionalTestReporterLoggers;
    finish(): Promise<void>;
}
export type HtmlReporterCallback = (html: string) => Promise<void>;
