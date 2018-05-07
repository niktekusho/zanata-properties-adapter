import { Question } from "inquirer";
import { isEmpty } from "../utils";

export const versionIDQuestion: Question = {
    type: "input",
    name: "version",
    message: "Insert the version ID",
    validate: (input: string): boolean|string => isEmpty("Version ID", input)
};