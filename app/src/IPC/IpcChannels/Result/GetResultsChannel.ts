import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { ResultDto, ResultsDtoMapper } from "../../dtos/ResultDto";
import { ResultService } from "../../../core/services/ResultService";

export class GetResultsChannel implements IpcChannelInterface {
  constructor(
    private service : ResultService
  ) {}

  getName(): string {
    return 'results:getForArticle';
  }

  handle(_event: IpcMainEvent, request: GetResultsForArticleRequest): ResultDto[] {
    console.log('Handling request on channel %s', this.getName())
    var results = this.service.getForArticleId(request.params.articleId);
    var resultsDtos = results.map((result) => ResultsDtoMapper.ModelToDto(result));
    return resultsDtos;
  }
}

class GetResultsForArticleRequest implements IpcRequest {
  params: {
    articleId: string
  }
}