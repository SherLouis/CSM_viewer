// ddo = data display object
export type SourceDdo = {
    id: number,
    author: string,
    date: string,
    publisher: string,
    doi: string,
    title: string,
    cohort: number,
    state: "À Faire" | "Fait" | "À Discutter",
    validity: {
        roi_nomenclature: string;
        null_effects: boolean;
        sham_stimulation: boolean;
        control_for_after_discharge: boolean;
        response_characterization: {
            cat_methodology: boolean;
            replicability_of_response: boolean;
            dose_responsiveness: boolean;
            dissection_of_response: boolean;
        }
    },
    details: {
        paper_role: {
            cartography_sec_only: boolean;
            cartography_sec_compare_to_other_techniques: boolean;
            research_technical_parameters_sec: boolean;
            research_cognitive_functions: boolean;
        },
        age_limits: {
            min: number;
            max: number;
            avg: number;
        }
    }
}

export interface SourceSummaryDdo {
    id: number,
    title: string,
    nb_results: number,
    state: "À Faire" | "Fait" | "À Discutter"
}
