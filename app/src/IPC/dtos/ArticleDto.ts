import { Article, StimulationPolarity, StimulationType } from "../../core/models/Article"

export type ArticleDto = {
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

export const ArticleDtoFromDdo = (ddo: ArticleDdo): ArticleDto => { return ddo as ArticleDto }

export const ModelFromDto = (dto: ArticleDto) => { return dto as Article}

export const DtoFromModel = (model: Article) => {return model as ArticleDto}