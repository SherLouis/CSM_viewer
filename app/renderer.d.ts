import { ArticleDto } from "src/IPC/dtos/ArticleDto";
import { ArticleSummaryDto } from "src/IPC/dtos/ArticlesSummaryDto";
import { EditResponseDto, CreateResponseDto } from "src/IPC/dtos/CreateEditResponseDto";
import { systemInfoDto } from "src/IPC/dtos/systemInfoDto";

export interface IElectronAPI {
  // getSystemInfo: (param:string) => Promise<systemInfoDto>,
  getArticlesSummary: () => Promise<ArticleSummaryDto[]>
  createArticle: (ArticleDto) => CreateResponseDto
  editArticle: (articleId: string, dto:ArticleDto) => EditResponseDto
  getArticle: (articleId:string) => Promise<ArticleDto>
  deleteArticle: (articleId: string) => Promise<EditResponseDto>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}