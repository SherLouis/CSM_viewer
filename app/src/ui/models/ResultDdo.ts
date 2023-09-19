// ddo = data display object
export type ResultDdo = {
    id: number,
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
    }
    occurrences: number,
    comments?: string
}

type EffectCategorisationMap = Record<string, Record<string, string[]>>

export const effectCategorisationMap: EffectCategorisationMap = {
    "Consciousness": {
        "Awareness": [],
        "Responsiveness": []
    },
    "Sensory": {
        "Somatosensory": ["Non painful", "Painful & thermal"]
    }
}
