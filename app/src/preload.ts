import { Event, contextBridge, ipcRenderer } from 'electron'
import { SourceDto } from './IPC/dtos/SourceDto'
import { ResultDto } from './IPC/dtos/ResultDto'

contextBridge.exposeInMainWorld('electronAPI', {
  dbLocationChanged: (callback: (event:Event, value:string)=>void) => ipcRenderer.on('dbLocation', callback),

  getSourcesSummary: () => ipcRenderer.invoke('source:getAll'),
  getSource: (sourceId: number) => ipcRenderer.invoke('source:get', { params: { sourceId: sourceId } }),
  createSource: (source: SourceDto) => ipcRenderer.invoke('source:create', { params: { dto: source } }),
  editSource: (sourceId: number, dto: SourceDto) => ipcRenderer.invoke('source:edit', { params: { sourceId: sourceId, dto: dto } }),
  deleteSource: (sourceId: number) => ipcRenderer.invoke('source:delete', { params: { sourceId: sourceId } }),

  getAllResultsForSource: (sourceId: string) => ipcRenderer.invoke('results:getForSource', { params: { sourceId: sourceId } }),
  editResult: (resultId: number, result: ResultDto) => ipcRenderer.invoke('result:edit', { params: { resultId: resultId, dto: result } }),
  deleteResult: (resultId: number) => ipcRenderer.invoke('result:delete', { params: { resultId: resultId } }),
  createResult: (result: ResultDto) => ipcRenderer.invoke('results:create', { params: { dto: result } }),
})

// TODO: use typescript to make api respect a type and make validations