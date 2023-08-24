import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import {ArticleSummaryDto, ArticleSummaryDtoMapper} from "../../dtos/ArticlesSummaryDto";
import { ArticleService } from "../../../core/services/ArticleService";

export class GetArticlesChannel implements IpcChannelInterface {
  constructor(
    private service : ArticleService
  ) {}

  getName(): string {
    return 'article:getAll';
  }

  handle(_event: IpcMainEvent, _request: IpcRequest): ArticleSummaryDto[] {
    console.log('Handling request on channel %s', this.getName())
    var articles = this.service.getAllSummary();
    var articlesDto = articles.map((article) => ArticleSummaryDtoMapper.toDto(article));
    return articlesDto;
  }
}