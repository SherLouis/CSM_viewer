type Article = {
    doi: string,
    title?: string,
    methodology: {
        stimulation_parameters: {
            type: "grid" | "depth" | "HFTS",
            electrode_separation: number,
            polatiry?: "unipolar" | "bipolar",
            current_mA: number,
            pulse_width_ms?: number,
            pulse_freq_Hz?: number,
            train_duration_s?: number
        }
    }
}

type ArticleSummary = {
    doi: string,
    title?: string,
    nb_results: number
}