import { Article } from "../../core/models/Article"

// TODO
export type ArticleDto = {
    doi: string,
    title: string,
    methodology: {
        stimulation_parameters: {
            type: StimulationTypeDdo,
            electrode_separation: number,
            polatiry: StimulationPolarityDdo,
            current_mA: number,
            pulse_width_ms: number,
            pulse_freq_Hz: number,
            train_duration_s: number
        }
    }
}

export const ArticleDtoFromDdo = (ddo: ArticleDdo): ArticleDto => { return ddo as ArticleDto }

export const ModelFromDto = (dto: ArticleDto) => { return dto as Article}