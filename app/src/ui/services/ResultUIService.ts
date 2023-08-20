import { CreateResponseDto, EditResponseDto } from "../../IPC/dtos/CreateEditResponseDto";
import { ResultDdo } from "../models/ResultDdo";

export default class ResultUIService {
    public static getAllResultsForArticle = async (articleId: string): Promise<ResultDdo[]> => {
        console.debug(`Getting Results for article ${articleId}`);
        return [
            { id: "1", location: { side: "left", lobe: "frontal", gyrus: "test", broadmann: [] }, effect: { category: "Consciousness", semiology: "Awareness", characteristic: "", post_discharge: false } },
            { id: "2", location: { side: "right", lobe: "frontal", gyrus: "test2", broadmann: [] }, effect: { category: "Consciousness", semiology: "Awareness", characteristic: "", post_discharge: false } }
        ]
        // TODO
        //let response = await window.electronAPI.getArticlesSummary();
        //return response.map((dto) => this.toArticleSummaryDdo(dto));
    }

    public static editResult = async (newValue: ResultDdo): Promise<EditResponseDto> => {
        console.debug(`Editing article ${newValue.id}`);
        throw new Error("Not yet implemented");
    }

    public static deleteResult = async (resultId: string): Promise<EditResponseDto> => {
        console.debug(`Deleting result ${resultId}`);
        throw new Error("Not yet implemented");
    }

    public static createResult = async (result: ResultDdo): Promise<CreateResponseDto> => {
        console.debug('Creating article');
        throw new Error("Not yet implemented");
    }
}