export type Result = {
    id: number,
    source_id: number,
    roi: {
        side: string,
        lobe: string,
        gyrus: string,
        sub: string,
        precision: string
    }
    stimulation_parameters: {
        amplitude_ma: number,
        amplitude_ma_max: number,
        frequency_hz: number,
        frequency_hz_max: number,
        duration_s: number,
        duration_s_max: number,
        electrode_make: string,
        implentation_type: string,
        contact_separation: number,
        contact_diameter: number,
        contact_length: number,
        phase_length: number,
        phase_type: string,
    }
    effect: {
        category: string,
        semiology: string,
        characteristic: string,
        post_discharge: boolean,
        lateralization: string,
        dominant: string,
        body_part: string,
        comments: string,
    },
    task: {
        category: string,
        subcategory: string,
        characteristic: string,
        comments: string,
    },
    function: {
        category: string,
        subcategory: string,
        characteristic: string,
        comments: string,
    },
    occurrences: number,
    comments?: string,
    comments_2: string,
    precision_score: number,
}