export const COMMAND = Symbol.for("Command");

export interface ICommand {
    name: string;
    execute(args: string[]): Promise<void>;
}
