import { Question } from "inquirer";
import { isEmpty } from "../utils";

export const usernameQuestion: Question = {
    type: "input",
    name: "username",
    message: "Insert Zanata Username",
    validate: (input: string): boolean|string => isEmpty("Username", input)
};