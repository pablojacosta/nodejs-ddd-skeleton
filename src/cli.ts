import "reflect-metadata";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import { bootstrapCli } from "application/config/bootstrap";
import { DEV, PROD, STAGING } from "application/config/environments";

const run = async (): Promise<void> => {
    if (![PROD, STAGING].includes(process.env.NODE_ENV || DEV)) {
        if (!fs.existsSync(path.join(__dirname, "../.env"))) {
            console.log(
                `⚠️  ERROR: cannot start application, .env file not found. Did you forget to create it using .env.dist as template? ⚠️`
            );
            process.exit(1);
        }

        dotenv.config({ path: path.join(__dirname, "../.env") });
    }

    const bootstrap = await bootstrapCli();

    await bootstrap.cli.run();
};

run();
