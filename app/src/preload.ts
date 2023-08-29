import { contextBridge, ipcRenderer } from 'electron'
import { SourceDto } from './IPC/dtos/SourceDto'
import { ResultDto } from './IPC/dtos/ResultDto'

contextBridge.exposeInMainWorld('electronAPI', {
  // getSystemInfo: (arg1: string) => ipcRenderer.invoke('system:getInfo', {params: {param1: arg1}})
  getSourcesSummary: () => ipcRenderer.invoke('source:getAll'),
  getSource: (sourceId: string) => ipcRenderer.invoke('source:get', { params: { sourceId: sourceId } }),
  createSource: (source: SourceDto) => ipcRenderer.invoke('source:create', { params: { dto: source } }),
  editSource: (sourceId: string, dto: SourceDto) => ipcRenderer.invoke('source:edit', { params: { sourceId: sourceId, dto: dto } }),
  deleteSource: (sourceId: string) => ipcRenderer.invoke('source:delete', { params: { sourceId: sourceId } }),

  getAllResultsForSource: (sourceId: string) => ipcRenderer.invoke('results:getForSource', { params: { sourceId: sourceId } }),
  editResult: (resultId: number, result: ResultDto) => ipcRenderer.invoke('result:edit', { params: { resultId: resultId, dto: result } }),
  deleteResult: (resultId: number) => ipcRenderer.invoke('result:delete', { params: { resultId: resultId } }),
  createResult: (result: ResultDto) => ipcRenderer.invoke('results:create', { params: { dto: result } }),
})

// TODO: use typescript to make api respect a type and make validations