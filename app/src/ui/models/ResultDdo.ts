// ddo = data display object
export type ResultDdo = {
    id: string,
    location: {
        side: "left" | "right",
        lobe: string,
        gyrus: string,
        broadman: string[]
    },
    effect: {
        category: string,
        semiology: string,
        characteristic: string
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
