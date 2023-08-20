import { contextBridge, ipcRenderer } from 'electron'
import { ArticleDto } from './IPC/dtos/ArticleDto'
import { ResultDto } from './IPC/dtos/ResultDto'

contextBridge.exposeInMainWorld('electronAPI', {
  // getSystemInfo: (arg1: string) => ipcRenderer.invoke('system:getInfo', {params: {param1: arg1}})
  getArticlesSummary: () => ipcRenderer.invoke('article:getAll'),
  getArticle: (articleId: string) => ipcRenderer.invoke('article:get', { params: { articleId: articleId } }),
  createArticle: (article: ArticleDto) => ipcRenderer.invoke('article:create', { params: { dto: article } }),
  editArticle: (articleId: string, dto: ArticleDto) => ipcRenderer.invoke('article:edit', { params: { articleId: articleId, dto: dto } }),
  deleteArticle: (articleId: string) => ipcRenderer.invoke('article:delete', { params: { articleId: articleId } }),

  getAllResultsForArticle: (articleId: string) => ipcRenderer.invoke('results:getForArticle', { params: { articleId: articleId } }),
  // TODO: editResult: (result: ResultDto) => Promise<EditResponseDto>
  // TODO: deleteResult: (resultId: string) => Promise<EditResponseDto>
  createResult: (result: ResultDto) => ipcRenderer.invoke('results:create', { params: { dto: result } }),
})

// TODO: use typescript to make api respect a type and make validations