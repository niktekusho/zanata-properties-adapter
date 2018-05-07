import { Question } from "inquirer";
import { isEmpty } from "../utils";

export const projectIDQuestion: Question = {
    type: "input",
    name: "project",
    message: "Insert the project ID",
    validate: (input: string): boolean|string => isEmpty("Project ID", input)
};