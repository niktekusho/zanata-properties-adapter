export type RequestObject = {
    url: string,
    apiKey: string,
    username: string,
    projectID: string,
    versionID: string,
    documentName: string,
    languageCode: string,
};

export type ZanataIni = {
    url: string,
    username: string,
    apiKey: string,
};

export type ZanataTranslations = {
    textFlowTargets: ZanataTranslation[]
};

export type ZanataTranslation = {
    resId: string,
    content: string,
};