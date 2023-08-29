import { Source, StimulationPolarity, StimulationType } from "../../core/models/Source"

export type SourceDto = {
    id: number,
    type: "article" | "experimental" | "other",
    author: string,
    date: string,
    publisher: string,
    location: string,
    doi: string,
    title: string,
    methodology: {
        stimulation_parameters: {
            type: StimulationType,
            electrode_separation: number,
            polarity: StimulationPolarity,
            current_mA: number,
            pulse_width_ms: number,
            pulse_freq_Hz: number,
            train_duration_s: number
        }
    }
}

export const SourceDtoFromDdo = (ddo: SourceDdo): SourceDto => { return ddo as SourceDto }

export const ModelFromDto = (dto: SourceDto) => { return dto as Source }

export const DtoFromModel = (model: Source) => { return model as SourceDto }