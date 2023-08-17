import { contextBridge, ipcRenderer } from 'electron'
import { ArticleDto } from './IPC/dtos/ArticleDto'

contextBridge.exposeInMainWorld('electronAPI', {
  // getSystemInfo: (arg1: string) => ipcRenderer.invoke('system:getInfo', {params: {param1: arg1}})
  getArticlesSummary: () => ipcRenderer.invoke('article:getAll'),
  getArticle: (articleId: string) => ipcRenderer.invoke('article:get', {params: {articleId: articleId}}),
  createArticle: (article: ArticleDto) => ipcRenderer.invoke('article:create', {params: {dto: article}}),
  editArticle: (articleId: string, dto:ArticleDto) => ipcRenderer.invoke('article:edit', {params: {articleId: articleId, dto:dto}}),
  deleteArticle: (articleId: string) => ipcRenderer.invoke('article:delete', {params: {articleId: articleId}})
})

// TODO: use typescript to make api respect a type and make validations