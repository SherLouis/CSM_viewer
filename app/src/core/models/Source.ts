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
    cohort: number
}
