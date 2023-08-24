import { Article } from "../../core/models/Article";

export type ArticleEntity = {
    doi: string,
    title: string,
    stimulation_type: "grid" | "depth" | "HFTS";
    stimulation_electrode_separation: number,
    stimulation_polarity: "unipolar" | "bipolar" | "unknown"
    stimulation_current_mA: number | null,
    stimulation_pulse_width_ms: number | null,
    stimulation_pulse_freq_Hz: number | null,
    stimulation_train_duration_s: number | null
}

export const ArticleToEntity = (model: Article): ArticleEntity => {
    return {
        doi: model.doi,
        title: model.title,
        stimulation_type: model.methodology.stimulation_parameters.type,
        stimulation_electrode_separation: model.methodology.stimulation_parameters.electrode_separation,
        stimulation_polarity: model.methodology.stimulation_parameters.polarity,
        stimulation_current_mA: model.methodology.stimulation_parameters.current_mA,
        stimulation_pulse_width_ms: model.methodology.stimulation_parameters.pulse_width_ms,
        stimulation_pulse_freq_Hz: model.methodology.stimulation_parameters.pulse_freq_Hz,
        stimulation_train_duration_s: model.methodology.stimulation_parameters.train_duration_s
    }
}

export const ArticleEntityToModel = (entity: ArticleEntity) : Article => {
    return {
        doi: entity.doi,
        title: entity.title,
        methodology: {
            stimulation_parameters: {
                type: entity.stimulation_type,
                electrode_separation: entity.stimulation_electrode_separation,
                polarity: entity.stimulation_polarity,
                current_mA: entity.stimulation_current_mA,
                pulse_width_ms: entity.stimulation_pulse_width_ms,
                pulse_freq_Hz: entity.stimulation_pulse_freq_Hz,
                train_duration_s: entity.stimulation_train_duration_s
            }
        }
    }
}