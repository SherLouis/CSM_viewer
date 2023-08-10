import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import {ArticleSummaryDto, ArticleSummaryDtoMapper} from "../../dtos/ArticlesSummaryDto";
import { ArticleService } from "../../../core/services/ArticleService";
import { ArticleDto, ModelFromDto} from "../..//dtos/ArticleDto";
import { CreateResponseDto } from "../../dtos/CreateEditResponseDto";

export class CreateArticleChannel implements IpcChannelInterface {
  constructor(
    private service : ArticleService
  ) {}

  getName(): string {
    return 'article:create';
  }

  handle(_event: IpcMainEvent, request: CreateArticleRequest): CreateResponseDto {
    console.log('Handling request on channel %s', this.getName())
    const success = this.service.createArticle(ModelFromDto(request.params.dto))
    const response = {successful: success, message: success?"Successfully create article":"Failed to create article"} as CreateResponseDto
    return response;
  }
}

class CreateArticleRequest implements IpcRequest {
    params: {
      dto: ArticleDto
    }
  }