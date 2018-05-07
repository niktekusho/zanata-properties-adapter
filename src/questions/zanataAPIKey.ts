import { Question } from "inquirer";

export const apiKeyQuestion: Question = {
    type: "input",
    name: "apiKey",
    message: "Insert the API Key associated with the username provided",
    validate: (input: string): boolean|string => {
        if (input.length != 32) {
            return "The API Key should be 32 characters long";
        }
        return true;
    }
};