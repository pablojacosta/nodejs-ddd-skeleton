export const writeSuccess = (message: string): void => write("\x1b[32m", "SUCCEESS", message);

export const writeInfo = (message: string): void => write("\x1b[34m", "INFO", message);

export const writeError = (message: string): void => write("\x1b[31m", "ERROR", message);

const write = (color: string, prefix: string, message: string): void => console.log(color, prefix, "\x1b[0m", message);
