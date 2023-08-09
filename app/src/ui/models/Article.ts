type Article = {
    doi: string,
    title: string,
    methodology: {
        stimulation_parameters: {
            type: StimulationType,
            electrode_separation: number,
            polatiry: StimulationPolarity,
            current_mA: number,
            pulse_width_ms: number,
            pulse_freq_Hz: number,
            train_duration_s: number
        }
    }
}

type StimulationType = "grid" | "depth" | "HFTS";
type StimulationPolarity = "unipolar" | "bipolar" | "unknown"

type ArticleSummary = {
    doi: string,
    title: string,
    nb_results: number
}