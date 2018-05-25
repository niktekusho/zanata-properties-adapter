import * as inquirer from "inquirer";
import { getTranslations, checkZanataIni } from "./utils";
import { questions, nonLoginQuestions } from "./questions";
import { types } from "zanata-api-js";

function prompt(questions: inquirer.Questions, zanataIni?: types.ZanataIni): Promise<void> {
    return inquirer.prompt(questions).then((answers: inquirer.Answers) => {
        // console.log(answers);
        const url = zanataIni != undefined ? zanataIni.url : answers.url;
        return getTranslations(url, {
            documentID: answers.document,
            projectID: answers.project,
            iterationID: answers.version,
        }, answers.language);
    }).catch(err => console.error(err));
}

checkZanataIni()
    .then(zanataIni => prompt(nonLoginQuestions, zanataIni))
    .catch(err => prompt(questions))
    .then(() => setTimeout(() => console.log("Bye!"), 5000));