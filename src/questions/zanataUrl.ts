import { Question } from "inquirer";

export const urlQuestion: Question = {
    type: "input",
    name: "url",
    message: "Insert Zanata Url (http://example.com:8080/)",
    validate: (input: string): boolean|string => {
        if (!input.startsWith("http://") && !input.startsWith("https://")) {
            return "Url should start with 'http://' or 'https://'";
        }
        return true;
    },
};