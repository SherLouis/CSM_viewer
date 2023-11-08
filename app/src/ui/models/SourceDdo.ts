// ddo = data display object
export type SourceDdo = {
    id: number,
    type: "article" | "experimental" | "other",
    author: string,
    date: string,
    publisher: string,
    location: string,
    doi: string,
    title: string,
    cohort: number,
    state: "À Faire" | "Fait" | "À Discutter"
}

export type SourceSummaryDdo = {
    id: number,
    title: string,
    nb_results: number,
    state: "À Faire" | "Fait" | "À Discutter"
}