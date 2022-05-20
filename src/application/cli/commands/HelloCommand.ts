import { provideSingleton } from "infrastructure/inversify/CustomProviders";
import { COMMAND, ICommand } from "../Command";
import { writeSuccess } from "../utils";

@provideSingleton(COMMAND)
export class HelloCommand implements ICommand {
    public name: string = "hello";

    public async execute(args: string[]): Promise<void> {
        if (args.length === 0) {
            throw new Error("Missing HelloCommand argument.");
        }

        writeSuccess(`Hello ${args[0]}`);
    }
}
