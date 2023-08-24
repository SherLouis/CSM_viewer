import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { ArticleService } from "../../../core/services/ArticleService";
import { EditResponseDto } from "../../../IPC/dtos/CreateEditResponseDto";

export class DeleteArticleChannel implements IpcChannelInterface {
  constructor(
    private service : ArticleService
  ) {}

  getName(): string {
    return 'article:delete';
  }

  handle(_event: IpcMainEvent, request: DeleteArticleChannelRequest): EditResponseDto {
    console.log('Handling request on channel %s', this.getName())
    const success = this.service.deleteArticle(request.params.articleId);
    const response = {successful: success, message: success?"Successfully deleted article":"Failed to delete article"} as EditResponseDto;
    return response;
  }
}

class DeleteArticleChannelRequest implements IpcRequest {
  params: {
    articleId: string
  }
}