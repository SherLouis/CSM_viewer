import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { ArticleService } from "../../../core/services/ArticleService";
import { ArticleDto, DtoFromModel } from "../../../IPC/dtos/ArticleDto";

export class GetArticleChannel implements IpcChannelInterface {
  constructor(
    private service : ArticleService
  ) {}

  getName(): string {
    return 'article:get';
  }

  handle(_event: IpcMainEvent, request: GetArticleChannelRequest): ArticleDto {
    console.log('Handling request on channel %s', this.getName())
    var article = this.service.getArticle(request.params.articleId);
    console.debug(article);
    return DtoFromModel(article);
  }
}

class GetArticleChannelRequest implements IpcRequest {
  params: {
    articleId: string
  }
}