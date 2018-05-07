import { Question } from "inquirer";
import { isEmpty } from "../utils";

export const documentNameQuestion: Question = {
    type: "input",
    name: "document",
    message: "Insert the document name",
    validate: (input: string): boolean|string => isEmpty("Document Name", input)
};