// ddo = data display object
export type ResultDdo = {
    id: number,
    location: {
        side: "left" | "right",
        lobe: string,
        gyrus: string,
        broadmann: string[]
    },
    effect: {
        category: string,
        semiology: string,
        characteristic: string,
        post_discharge: boolean
    }
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
