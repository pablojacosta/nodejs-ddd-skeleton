import { Container } from "inversify";
import { Cli, ICli } from "./Cli";

export const createCli = (container: Container): ICli => new Cli(container);
