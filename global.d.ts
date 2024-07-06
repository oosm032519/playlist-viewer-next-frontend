import '@jest/globals';
import '@testing-library/jest-dom';
import {TestingLibraryMatchers} from "@testing-library/jest-dom/matchers";

declare module "expect" {
    interface Matchers<R extends void | Promise<void>, T = unknown>
        extends TestingLibraryMatchers<typeof expect.stringContaining, R> {
    }
}
