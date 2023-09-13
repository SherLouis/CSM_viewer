export type ROIArborescence = [Lobe]
type Lobe = { name: string, gyrus: { name: string, subcategories: { name: string, precisions: string[] }[] }[] }

/*
let a = [
    {
        name: "frontal", gyrus: [
            {name: "Superior frontal gyrus", subcategories: [{name: "1", precisions: []}]},
            {name: "Middle frontal gyrus", subcategories: [{name: "1", precisions: []}]},
            {name: "Inferior frontal gyrus", subcategories: [{name: "1", precisions: []}]},
        ]
    },
    {
        name: "parietal", gyrus: [
            {name: "Superior frontal gyrus", subcategories: [{name: "1", precisions: []}]},
            {name: "Middle frontal gyrus", subcategories: [{name: "1", precisions: []}]},
            {name: "Inferior frontal gyrus", subcategories: [{name: "1", precisions: []}]},
        ]
    }
] as Lobe[]
*/