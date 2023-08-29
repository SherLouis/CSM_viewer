// ddo = data display object
type SourceDdo = {
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
            type: StimulationTypeDdo,
            electrode_separation: number,
            polarity: StimulationPolarityDdo,
            current_mA: number,
            pulse_width_ms: number,
            pulse_freq_Hz: number,
            train_duration_s: number
        }
    }
}

type StimulationTypeDdo = "grid" | "depth" | "HFTS";
type StimulationPolarityDdo = "unipolar" | "bipolar" | "unknown"

type SourceSummaryDdo = {
    id: number,
    title: string,
    nb_results: number
}