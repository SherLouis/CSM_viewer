export type SourceSummary = {
    id: number,
    title: string,
    nb_results: number
}

export type Source = {
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

export type StimulationType = "grid" | "depth" | "HFTS";
export type StimulationPolarity = "unipolar" | "bipolar" | "unknown"