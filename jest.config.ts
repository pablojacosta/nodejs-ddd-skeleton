import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node",
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
export default config;
