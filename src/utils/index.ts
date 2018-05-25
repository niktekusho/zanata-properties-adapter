import * as nodefetch from "node-fetch";
import { readFile, writeFile } from "fs";
import { homedir, EOL } from "os";
import { resolve } from "path";

import { api, types } from "zanata-api-js";

// TODO FIX NODE-nodefetch.default IMPORT BUG/GLITCH

export function isEmpty(variable: string, input: string): string|boolean {
    if (input.trim().length == 0) {
        return `${variable} should not be empty`;
    }
    return true;
}

export async function validateUrl(url: string): Promise<boolean> {
    const { projects } = api;
    return projects.get(url).then(projects => true).catch(error => {
        console.error(error);
        return false;
    });
}

export async function validateProjectID(url: string, projectID: string): Promise<boolean> {
    const { project } = api;
    return project.get(url, projectID).then(project => true).catch(error => {
        console.error(error);
        return false;
    });
}

export async function validateVersionID(url: string, projectID: string, versionID: string): Promise<boolean> {
    const { iteration } = api;
    return iteration.get(url, projectID, versionID).then(response => true)
        .catch(error => {
            console.error(error);
            return false;
    });
}

export async function getTranslations(serverUrl: string, object: api.document.DocRequest, language: string): Promise<void> {
    const ext = ".properties";
    const outputFileName = object.documentID.endsWith(ext) ? object.documentID : object.documentID + ext;

    return api.document.getDocumentTranslation(serverUrl, object, language)
        .then(translations => generatePropertiesString(translations))
        .then(properties => writeProperties(outputFileName, properties))
        .catch(error => console.error("Error downloading translations, for more info check the log below.", error));
}

export const ZANATA_INI_PATH = resolve(homedir(), ".zanata-properties-adapter", "zanata.ini");

export async function parseZanataIni(file: string): Promise<types.ZanataIni> {
    return new Promise<types.ZanataIni>((resolve) => {
        const lines = file.split(/\r\n|\r|\n/);
        const zanataIni: types.ZanataIni = {
            url: "",
            apiKey: "",
            username: "",
        };
        for (const line of lines) {
            if (line.includes(".url")) {
                zanataIni.url = line.substring(line.indexOf("=") + 1, line.length - 1);
            } else if (line.includes(".username")) {
                zanataIni.username = line.substring(line.indexOf("=") + 1);
            } else if (line.includes(".key")) {
                zanataIni.apiKey = line.substring(line.indexOf("=") + 1);
            }
        }
        resolve(zanataIni);
    });
}

export async function generatePropertiesString(translations: types.ZanataTranslationResponse): Promise<string> {
    return new Promise<string>((resolve) => {
        let propertiesString = "";
        for (const translation of translations.textFlowTargets) {
            propertiesString += `${translation.resId} = ${translation.content}${EOL}`;
        }
        resolve(propertiesString);
    });
}

export async function writeProperties(docName: string, properties: string) {
    const filePath = resolve(homedir(), docName);
    return new Promise<void>((resolve, reject) => {
        writeFile(filePath, properties, { encoding: "utf8" }, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log(`File ${filePath} successfully written`);
                resolve();
            }
        });
    });
}

export async function checkZanataIni(): Promise<types.ZanataIni> {
    // TODO use promisified version of readFile
    return new Promise<types.ZanataIni>((resolve, reject) => {
        readFile(ZANATA_INI_PATH, { encoding: "utf8" }, (err, file) => {
            if (err) {
                console.warn(`zanata.ini not found at ${ZANATA_INI_PATH}`);
                reject(err);
            } else {
                console.log(`zanata.ini found at ${ZANATA_INI_PATH}`);
                // console.log(file);
                resolve(parseZanataIni(file));
            }
        });
    });
}