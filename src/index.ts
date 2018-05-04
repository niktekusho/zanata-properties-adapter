import * as inquirer from "inquirer";
import { getTranslations, checkZanataIni } from "./utils";
import { questions, nonLoginQuestions } from "./questions";
import { ZanataIni } from "./types";

function prompt(questions: inquirer.Questions, zanataIni?: ZanataIni) {
    inquirer.prompt(questions).then((answers: inquirer.Answers) => {
        console.log(answers);
        return getTranslations({
            apiKey: zanataIni != undefined ? zanataIni.apiKey : answers.apiKey,
            documentName: answers.document,
            languageCode: answers.language,
            projectID: answers.project,
            url: zanataIni != undefined ? zanataIni.url : answers.url,
            username: zanataIni != undefined ? zanataIni.username : answers.username,
            versionID: answers.version,
        });
    }).catch(err => console.error(err));
}

checkZanataIni().then(zanataIni => {
    console.log("ooo");
    prompt(nonLoginQuestions, zanataIni);
}).catch(err => {
    prompt(questions);
});
