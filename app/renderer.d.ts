import { ArticleSummaryDto } from "src/IPC/dtos/ArticlesSummaryDto";
import { systemInfoDto } from "src/IPC/dtos/systemInfoDto";

export interface IElectronAPI {
  // getSystemInfo: (param:string) => Promise<systemInfoDto>,
  getArticlesSummary: () => Promise<ArticleSummaryDto[]>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}