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
    details_paper_role_cartography_sec_only: number;
    details_paper_role_cartography_sec_compare_to_other_techniques: number;
    details_paper_role_research_technical_parameters_sec: number;
    details_paper_role_research_cognitive_functions: number;
    details_age_limits_min: number;
    details_age_limits_max: number;
    details_age_limits_avg: number;
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
        validity_response_charact_dissection_of_response: model.validity.response_characterization.dissection_of_response ? 1 : 0,
        details_paper_role_cartography_sec_only: model.details.paper_role.cartography_sec_only ? 1 : 0,
        details_paper_role_cartography_sec_compare_to_other_techniques: model.details.paper_role.cartography_sec_compare_to_other_techniques ? 1 : 0,
        details_paper_role_research_technical_parameters_sec: model.details.paper_role.research_technical_parameters_sec ? 1 : 0,
        details_paper_role_research_cognitive_functions: model.details.paper_role.research_cognitive_functions ? 1 : 0,
        details_age_limits_min: model.details.age_limits.min,
        details_age_limits_max: model.details.age_limits.max,
        details_age_limits_avg: model.details.age_limits.avg,
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
        },
        details: {
            paper_role: {
                cartography_sec_only: entity.details_paper_role_cartography_sec_only > 0,
                cartography_sec_compare_to_other_techniques: entity.details_paper_role_cartography_sec_compare_to_other_techniques > 0,
                research_technical_parameters_sec: entity.details_paper_role_research_technical_parameters_sec > 0,
                research_cognitive_functions: entity.details_paper_role_research_cognitive_functions > 0,
            },
            age_limits: {
                min: entity.details_age_limits_min,
                max: entity.details_age_limits_max,
                avg: entity.details_age_limits_avg,
            }
        }
    }
}