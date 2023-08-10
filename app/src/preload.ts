import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // getSystemInfo: (arg1: string) => ipcRenderer.invoke('system:getInfo', {params: {param1: arg1}})
  getArticlesSummary: () => ipcRenderer.invoke('article:getAll')
})

// TODO: use typescript to make api respect a type and make validations