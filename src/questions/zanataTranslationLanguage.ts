import { Question } from "inquirer";

export const languagesQuestion: Question = {
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
};