export type Result = {
    id: number,
    source_id: number,
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