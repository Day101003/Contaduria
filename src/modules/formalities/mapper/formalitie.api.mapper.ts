import { CreateFormalitieTemplateDto, FormalitieTemplate } from "../models/field.model";
import { Formalitie } from "../models/formalitie";

function mapFormalitieFromApi(formalitie: any) : FormalitieTemplate {

    return {
        client: formalitie.client,
        service: formalitie.service,
        user: formalitie.user,
        fields: formalitie.fields,
        active: formalitie.active,
        id: formalitie.id,
        createdAt: formalitie.createdAt,
        updatedAt: formalitie.updatedAt
    }

}

function mapFormalitieToApi(formalitie: FormalitieTemplate) : any {

    return {
        client: formalitie.client,
        service: formalitie.service,
        user: formalitie.user,
        fields: formalitie.fields,
        active: formalitie.active,
        id: formalitie.id,
        createdAt: formalitie.createdAt,
        updatedAt: formalitie.updatedAt
    }
}

function mapFormalitieListFromApi(formalities: any[]) : FormalitieTemplate[] {
    return formalities.map(formalitie => mapFormalitieFromApi(formalitie));
}

function mapFormalitieListToApi(formalities: FormalitieTemplate[]) : any[] {
    return formalities.map(formalitie => mapFormalitieToApi(formalitie));
}

function mapCreateFormalitieToApi(formalitie: CreateFormalitieTemplateDto) : any {

    return {
        clientId: formalitie.clientId,
        serviceId: formalitie.serviceId,
        userId: formalitie.userId
    }
}

export {
    mapFormalitieFromApi,
    mapFormalitieToApi,
    mapFormalitieListFromApi,
    mapFormalitieListToApi,
    mapCreateFormalitieToApi
}