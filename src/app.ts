import "reflect-metadata";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import { bootstrapApplication } from "application/config/bootstrap";
import { DEV, PROD, STAGING } from "application/config/environments";

if (![PROD, STAGING].includes(process.env.NODE_ENV || DEV)) {
    if (!fs.existsSync(path.join(__dirname, "../.env"))) {
        console.log(
            `⚠️  ERROR: cannot start application, .env file not found. Did you forget to create it using .env.dist as template? ⚠️`
        );
        process.exit(1);
    }

    console.log(`Loading configuration from .env file.`);
    dotenv.config({ path: path.join(__dirname, "../.env") });
}

bootstrapApplication();
