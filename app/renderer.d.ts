import { ArticleDto } from "src/IPC/dtos/ArticleDto";
import { ArticleSummaryDto } from "src/IPC/dtos/ArticlesSummaryDto";
import { EditResponseDto, CreateResponseDto } from "src/IPC/dtos/CreateEditResponseDto";
import { ResultDto } from "src/IPC/dtos/ResultDto";
import { systemInfoDto } from "src/IPC/dtos/systemInfoDto";

export interface IElectronAPI {
  // Articles
  getArticlesSummary: () => Promise<ArticleSummaryDto[]>
  createArticle: (article: ArticleDto) => CreateResponseDto
  editArticle: (articleId: string, dto: ArticleDto) => EditResponseDto
  getArticle: (articleId: string) => Promise<ArticleDto>
  deleteArticle: (articleId: string) => Promise<EditResponseDto>
  // Results
  getAllResultsForArticle: (articleId: string) => Promise<ResultDto[]>
  editResult: (resultId: number, result: ResultDto) => Promise<EditResponseDto>
  deleteResult: (resultId: number) => Promise<EditResponseDto>
  createResult: (result: ResultDto) => Promise<CreateResponseDto>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}