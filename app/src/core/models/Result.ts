export type Result = {
    id: number,
    source_id: number,
    roi: {
        lobe: string,
        gyrus: string,
        sub: string,
        precision: string
    }
    stimulation_parameters: {
        amplitude_ma: number,
        frequency_hz: number,
        electrode_separation_mm: number,
        duration_s: number
    }
    effect: {
        category: string,
        semiology: string,
        characteristic: string,
        precision: string,
        post_discharge: boolean
    },
    task: {
        category: string,
        subcategory: string,
        characteristic: string,
        precision: string,
    },
    function: {
        category: string,
        subcategory: string,
        characteristic: string,
        precision: string,
    },
    occurrences: number,
    comments?: string
}