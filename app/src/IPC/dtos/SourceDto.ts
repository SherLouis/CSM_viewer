import { Source } from "../../core/models/Source"
import { SourceDdo } from "../../ui/models/SourceDdo";

export type SourceDto = {
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

export const SourceDtoFromDdo = (ddo: SourceDdo): SourceDto => { return ddo as SourceDto }

export const ModelFromDto = (dto: SourceDto) => { return dto as Source }

export const DtoFromModel = (model: Source) => { return model as SourceDto }