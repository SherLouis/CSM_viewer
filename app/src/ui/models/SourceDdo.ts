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
    cohort: number
}

type SourceSummaryDdo = {
    id: number,
    title: string,
    nb_results: number
}