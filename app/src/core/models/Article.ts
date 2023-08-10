export type ArticleSummary = {
    doi: string,
    title: string,
    nb_results: number
}

export type Article = {
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

type StimulationTypeDdo = "grid" | "depth" | "HFTS";
type StimulationPolarityDdo = "unipolar" | "bipolar" | "unknown"