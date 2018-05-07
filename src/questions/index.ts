import { isEmpty } from "../utils";

export const questions = [
    {
        type: "input",
        name: "url",
        message: "Insert Zanata Url (http://example.com:8080/)",
        validate: (input: string): boolean|string => {
            if (!input.startsWith("http://") && !input.startsWith("https://")) {
                return "Url should start with 'http://' or 'https://'";
            }
            return true;
        },
        filter: (input: string): string => {
            return input + "/rest/";
        },
    },
    {
        type: "input",
        name: "username",
        message: "Insert Zanata Username",
        validate: (input: string): boolean|string => isEmpty("Username", input)
    },
    {
        type: "input",
        name: "apiKey",
        message: "Insert the API Key associated with the username provided",
        validate: (input: string): boolean|string => {
            if (input.length != 32) {
                return "The API Key should be 32 characters long";
            }
            return true;
        }
    },
    {
        type: "input",
        name: "project",
        message: "Insert the project ID",
        validate: (input: string): boolean|string => isEmpty("Project ID", input)
    },
    {
        type: "input",
        name: "version",
        message: "Insert the version ID",
        validate: (input: string): boolean|string => isEmpty("Version ID", input)
    },
    {
        type: "input",
        name: "document",
        message: "Insert the document name",
        validate: (input: string): boolean|string => isEmpty("Document Name", input)
    },
    {
        type: "list",
        name: "language",
        message: "Select the language",
        choices: [
            {
                name: "French (fr)",
                value: "fr",
            },
            {
                name: "French (fr-FR)",
                value: "fr-FR",
            },
            {
                name: "English (en-US)",
                value: "en-US",
            },
            {
                name: "English (en-GB)",
                value: "en-GB",
            },
            {
                name: "English (en)",
                value: "en",
            },
            {
                name: "German (de)",
                value: "de",
            },
            {
                name: "German (de-DE)",
                value: "de-DE",
            },
            {
                name: "Italian (it-IT)",
                value: "it-IT",
            },
            {
                name: "Italian (it)",
                value: "it",
            },
            {
                name: "Spanish (es)",
                value: "es",
            },
            {
                name: "Spanish (es-ES)",
                value: "es-ES",
            },
        ]
    }
];

export const nonLoginQuestions = questions.filter(question => {
    return !question.name.match(/url|username|apiKey/);
});