// ddo = data display object
export type SourceDdo = {
    id: number,
    author: string,
    date: string,
    publisher: string,
    doi: string,
    title: string,
    cohort: number,
    state: "À Faire" | "Fait" | "À Discutter"
}

export interface SourceSummaryDdo {
    id: number,
    title: string,
    nb_results: number,
    state: "À Faire" | "Fait" | "À Discutter"
}
