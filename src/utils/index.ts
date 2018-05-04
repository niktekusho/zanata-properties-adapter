import fetch, { Headers, Response } from "node-fetch";
import { RequestObject, ZanataIni } from "../types";
import { readFile } from "fs";
import { homedir } from "os";
import { resolve } from "path";

export function isEmpty(variable: string, input: string): string|boolean {
    if (input.trim().length == 0) {
        return `${variable} should not be empty`;
    }
    return true;
}

export async function validateUrl(url: string): Promise<boolean> {
    return fetch(url + "projects").then(response => {
        return true;
    }).catch(error => {
        console.error(error);
        return false;
    });
}

export async function validateProjectID(url: string, projectID: string): Promise<boolean> {
    return fetch(`${url}/projects/p/${projectID}`).then(response => {
        return true;
    }).catch(error => {
        console.error(error);
        return false;
    });
}

export async function validateVersionID(url: string, projectID: string, versionID: string): Promise<boolean> {
    return fetch(`${url}/projects/p/${projectID}/iterations/i/${versionID}`).then(response => {
        return true;
    }).catch(error => {
        console.error(error);
        return false;
    });
}

export async function getTranslations(object: RequestObject): Promise<void> {
    const url = `${object.url}/projects/p/${object.projectID}/iterations/i/${object.versionID}/r/${object.documentName}/translations/${object.languageCode}`;

    const header = new Headers();
    header.append("X-Auth-User", object.username);
    header.append("X-Auth-Token", object.apiKey);
    header.append("Accept", "application/json");

    return fetch(url, { headers: header }).then((res: Response) => {
        console.log(res);
        return;
    });
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

export async function checkZanataIni(): Promise<ZanataIni> {
    // TODO use promisified version of readFile
    return new Promise<ZanataIni>((resolve, reject) => {
        readFile(ZANATA_INI_PATH, { encoding: "utf8" }, (err, file) => {
            if (err) {
                console.warn(`zanata.ini not found at ${ZANATA_INI_PATH}`);
                reject(err);
            }
            console.log(`zanata.ini found at ${ZANATA_INI_PATH}`);
            // console.log(file);
            parseZanataIni(file);
        });
    });
}