import { TYPES } from "application/config/ioc/types";
import { IConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { Container } from "inversify";
import { COMMAND, ICommand } from "./Command";
import { writeError } from "./utils";

export interface ICli {
    run(): Promise<void>;
}

export class Cli implements ICli {
    private readonly connectionManager: IConnectionManager;
    private readonly commands: ICommand[];

    constructor(container: Container) {
        this.connectionManager = container.get<IConnectionManager>(TYPES.ConnectionManager);
        this.commands = container.getAll(COMMAND);
    }

    public async run(): Promise<void> {
        const args = process.argv.slice(2);
        let exitCode = 0;

        try {
            const command = this.findCommand(args);
            await command.execute(args);
        } catch (error: unknown) {
            exitCode = 1;
            writeError((error as Error).message);
        }

        await this.tearDown();
        process.exit(exitCode);
    }

    private findCommand(args: string[]): ICommand {
        if (!args[0]) {
            throw new Error("Missing command name");
        }

        const commandName = args.shift();

        for (const command of this.commands) {
            if (command.name === commandName) {
                return command;
            }
        }

        throw new Error(`Command ${commandName} not found.`);
    }

    private async tearDown(): Promise<void> {
        await this.connectionManager.close();
    }
}
