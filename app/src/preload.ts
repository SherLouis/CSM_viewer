import { contextBridge, ipcRenderer } from 'electron'
import { ArticleDto } from './IPC/dtos/ArticleDto'

contextBridge.exposeInMainWorld('electronAPI', {
  // getSystemInfo: (arg1: string) => ipcRenderer.invoke('system:getInfo', {params: {param1: arg1}})
  getArticlesSummary: () => ipcRenderer.invoke('article:getAll'),
  createArticle: (article: ArticleDto) => ipcRenderer.invoke('article:create', {params: {dto: article}})
})

// TODO: use typescript to make api respect a type and make validations