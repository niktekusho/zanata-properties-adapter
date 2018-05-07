import * as nodefetch from "node-fetch";
import { RequestObject, ZanataIni, ZanataTranslations, ZanataTranslation } from "../types";
import { readFile, writeFile } from "fs";
import { homedir, EOL } from "os";
import { resolve } from "path";

// TODO FIX NODE-nodefetch.default IMPORT BUG/GLITCH

export function isEmpty(variable: string, input: string): string|boolean {
    if (input.trim().length == 0) {
        return `${variable} should not be empty`;
    }
    return true;
}

export async function validateUrl(url: string): Promise<boolean> {
    return nodefetch.default(url + "projects").then(response => {
        return true;
    }).catch(error => {
        console.error(error);
        return false;
    });
}

export async function validateProjectID(url: string, projectID: string): Promise<boolean> {
    return nodefetch.default(`${url}/projects/p/${projectID}`).then(response => {
        return true;
    }).catch(error => {
        console.error(error);
        return false;
    });
}

export async function validateVersionID(url: string, projectID: string, versionID: string): Promise<boolean> {
    return nodefetch.default(`${url}/projects/p/${projectID}/iterations/i/${versionID}`).then(response => {
        return true;
    }).catch(error => {
        console.error(error);
        return false;
    });
}

export async function getTranslations(object: RequestObject): Promise<void> {
    const url = `${object.url}/rest/projects/p/${object.projectID}/iterations/i/${object.versionID}/r/${object.documentName}/translations/${object.languageCode}`;

    console.log(`Contacting ${url}`);

    const header = new nodefetch.Headers();
    header.append("X-Auth-User", object.username);
    header.append("X-Auth-Token", object.apiKey);
    header.append("Accept", "application/json");

    const ext = ".properties";
    const outputFileName = object.documentName.endsWith(ext) ? object.documentName : object.documentName + ext;

    return nodefetch.default(url, { headers: header })
        .then((res: nodefetch.Response) => {
            if (res.ok) {
                return res.json();
            }
            throw new Error(`${res.statusText}${EOL}${res.body.read()}`);
        })
        .then(json => adaptTranslations(json))
        .then(translations => generatePropertiesString(translations))
        .then(properties => writeProperties(outputFileName, properties))
        .catch(error => console.error("Error downloading translations, for more info check the log below.", error));
}

export const ZANATA_INI_PATH = resolve(homedir(), ".zanata-properties-adapter", "zanata.ini");

export async function parseZanataIni(file: string): Promise<ZanataIni> {
    return new Promise<ZanataIni>((resolve) => {
        const lines = file.split(/\r\n|\r|\n/);
        const zanataIni: ZanataIni = {
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

export async function adaptTranslations(json: ZanataTranslations): Promise<ZanataTranslations> {
    return new Promise<ZanataTranslations>((resolve) => {
        resolve(json);
    });
}

export async function generatePropertiesString(translations: ZanataTranslations): Promise<string> {
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
                resolve();
            }
        });
    });
}

export async function checkZanataIni(): Promise<ZanataIni> {
    // TODO use promisified version of readFile
    return new Promise<ZanataIni>((resolve, reject) => {
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