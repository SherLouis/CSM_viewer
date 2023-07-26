import { systemInfoDto } from "src/IPC/dtos/systemInfoDto";

export interface IElectronAPI {
  getSystemInfo: (param:string) => Promise<systemInfoDto>,
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}