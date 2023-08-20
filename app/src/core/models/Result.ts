export type Result = {
    id: number,
    article_id: string,
    location: {
        side: string,
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