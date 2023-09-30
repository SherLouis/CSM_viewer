import { SourceDto } from "src/IPC/dtos/SourceDto";
import { SourceSummaryDto } from "src/IPC/dtos/SourcesSummaryDto";
import { EditResponseDto, CreateResponseDto } from "src/IPC/dtos/CreateEditResponseDto";
import { ResultDto } from "src/IPC/dtos/ResultDto";
import { systemInfoDto } from "src/IPC/dtos/systemInfoDto";
import { ROIDto } from "src/IPC/dtos/ROIDto";

export interface IElectronAPI {
  dbLocationChanged: (callback: (event: Event, value: string) => void) => void,
  // Sources
  getSourcesSummary: () => Promise<SourceSummaryDto[]>
  createSource: (source: SourceDto) => CreateResponseDto
  editSource: (sourceId: number, dto: SourceDto) => EditResponseDto
  getSource: (sourceId: number) => Promise<SourceDto>
  deleteSource: (sourceId: number) => Promise<EditResponseDto>
  // Results
  getAllResultsForSource: (sourceId: number) => Promise<ResultDto[]>
  editResult: (resultId: number, result: ResultDto) => Promise<EditResponseDto>
  deleteResult: (resultId: number) => Promise<EditResponseDto>
  createResult: (result: ResultDto) => Promise<CreateResponseDto>

  getROIs: () => Promise<ROIDto[]>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}