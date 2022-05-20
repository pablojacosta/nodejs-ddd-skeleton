import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

if (!fs.existsSync(path.join(__dirname, ".env.test"))) {
    console.log(
        `⚠️  ERROR: cannot start application, .env file not found. Did you forget to create it using .env.dist as template? ⚠️`
    );

    process.exit(1);
}

dotenv.config({ path: path.join(__dirname, ".env.test") });
