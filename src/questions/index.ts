import { isEmpty } from "../utils";
import { urlQuestion } from "./zanataUrl";
import { usernameQuestion } from "./zanataUsername";
import { apiKeyQuestion } from "./zanataAPIKey";
import { projectIDQuestion } from "./zanataProjectID";
import { versionIDQuestion } from "./zanataVersionID";
import { documentNameQuestion } from "./zanataDocumentName";
import { languagesQuestion } from "./zanataTranslationLanguage";

export const questions = [
    urlQuestion,
    usernameQuestion,
    apiKeyQuestion,
    projectIDQuestion,
    versionIDQuestion,
    documentNameQuestion,
    languagesQuestion,
];

export const nonLoginQuestions = questions.filter(question => {
    return !question.name.match(/url|username|apiKey/);
});