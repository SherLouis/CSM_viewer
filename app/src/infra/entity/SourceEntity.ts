import { Source } from "../../core/models/Source";

export type SourceEntity = {
    id: number,
    author: string,
    date: string,
    publisher: string,
    doi: string,
    title: string,
    cohort: number,
    state: "À Faire" | "Fait" | "À Discutter",
    validity_roi_nomenclature: string;
    validity_null_effects: number;
    validity_sham_stimulation: number;
    validity_control_for_after_discharge: number;
    validity_response_charact_cat_methodology: number;
    validity_response_charact_replicability_of_response: number;
    validity_response_charact_dose_responsiveness: number;
    validity_response_charact_dissection_of_response: number;
}

export const SourceToEntity = (model: Source): SourceEntity => {
    return {
        id: model.id,
        author: model.author,
        date: model.date,
        publisher: model.publisher,
        doi: model.doi,
        title: model.title,
        cohort: model.cohort,
        state: model.state,
        validity_roi_nomenclature: model.validity.roi_nomenclature,
        validity_null_effects: model.validity.null_effects ? 1 : 0,
        validity_sham_stimulation: model.validity.sham_stimulation ? 1 : 0,
        validity_control_for_after_discharge: model.validity.control_for_after_discharge ? 1 : 0,
        validity_response_charact_cat_methodology: model.validity.response_characterization.cat_methodology ? 1 : 0,
        validity_response_charact_replicability_of_response: model.validity.response_characterization.replicability_of_response ? 1 : 0,
        validity_response_charact_dose_responsiveness: model.validity.response_characterization.dose_responsiveness ? 1 : 0,
        validity_response_charact_dissection_of_response: model.validity.response_characterization.dissection_of_response ? 1 : 0
    }
}

export const SourceEntityToModel = (entity: SourceEntity): Source => {
    return {
        id: entity.id,
        author: entity.author,
        date: entity.date,
        publisher: entity.publisher,
        doi: entity.doi,
        title: entity.title,
        cohort: entity.cohort,
        state: entity.state,
        validity: {
            roi_nomenclature: entity.validity_roi_nomenclature,
            null_effects: entity.validity_null_effects > 0,
            sham_stimulation: entity.validity_sham_stimulation > 0,
            control_for_after_discharge: entity.validity_control_for_after_discharge > 0,
            response_characterization: {
                cat_methodology: entity.validity_response_charact_cat_methodology > 0,
                replicability_of_response: entity.validity_response_charact_replicability_of_response > 0,
                dose_responsiveness: entity.validity_response_charact_dose_responsiveness > 0,
                dissection_of_response: entity.validity_response_charact_dissection_of_response > 0,
            }
        }
    }
}