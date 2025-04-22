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
    }
}

export interface SourceSummaryDdo {
    id: number,
    title: string,
    nb_results: number,
    state: "À Faire" | "Fait" | "À Discutter"
}
