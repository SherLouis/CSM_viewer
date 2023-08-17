import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { ArticleService } from "../../../core/services/ArticleService";
import { ArticleDto, ModelFromDto} from "../..//dtos/ArticleDto";
import { EditResponseDto } from "../../dtos/CreateEditResponseDto";

export class EditArticleChannel implements IpcChannelInterface {
  constructor(
    private service : ArticleService
  ) {}

  getName(): string {
    return 'article:edit';
  }

  handle(_event: IpcMainEvent, request: EditArticleRequest): EditResponseDto {
    console.log('Handling request on channel %s', this.getName());
    console.debug(request.params.dto);
    const success = this.service.editArticle(request.params.articleId, ModelFromDto(request.params.dto));
    const response = {successful: success, message: success?"Successfully edited article":"Failed to edit article"} as EditResponseDto;
    return response;
  }
}

class EditArticleRequest implements IpcRequest {
    params: {
      articleId: string
      dto: ArticleDto
    }
  }