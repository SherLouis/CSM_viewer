import { app, BrowserWindow, ipcMain, Menu, MenuItem } from 'electron';
import { IpcChannelInterface } from '../IPC/IpcChannelInterface';
import { GetSourcesChannel } from '../IPC/IpcChannels/Source/GetSourcesChannel';
import { SourceService } from '../core/services/SourceService';
import { CreateSourceChannel } from '../IPC/IpcChannels/Source/CreateSourceChannel';
import IDataRepository from '../infra/IDataRepository';
import DataRepository from '../infra/DataRepository';
import { GetSourceChannel } from '../IPC/IpcChannels/Source/GetSourceChannel';
import { EditSourceChannel } from '../IPC/IpcChannels/Source/EditSourceChannel';
import { DeleteSourceChannel } from '../IPC/IpcChannels/Source/DeleteSourceChannel';
import { GetResultsChannel } from '../IPC/IpcChannels/Result/GetResultsChannel';
import { ResultService } from '../core/services/ResultService';
import { CreateResultsChannel } from '../IPC/IpcChannels/Result/CreateResultsChannel';
import { DeleteResultChannel } from '../IPC/IpcChannels/Result/DeleteResultChannel';
import { EditResultChannel } from '../IPC/IpcChannels/Result/EditResultChannel';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

class Main {
  //private systemInfoService: SystemInfoService = new SystemInfoService(); 
  private dataRepository: IDataRepository = new DataRepository(":memory:");
  private sourceService: SourceService = new SourceService(this.dataRepository);
  private resultService: ResultService = new ResultService(this.dataRepository);
  private createWindow = (): void => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
      },
    });
    mainWindow.maximize();

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();
  };

  private setupApplicationMenu = () => {
    Menu.getApplicationMenu().append(new MenuItem({ label: 'Custom', submenu: [{ label: 'Test', click: () => console.log('Test clicked') }] }));
  }

  private setupHandlers = () => {
    // TODO: import handlers from other file or setup here. This is the interaction between the window and the main process.
    this.registerIpcChannels([
      //new SystemInfoChannel(this.systemInfoService)
      new GetSourcesChannel(this.sourceService),
      new CreateSourceChannel(this.sourceService),
      new GetSourceChannel(this.sourceService),
      new EditSourceChannel(this.sourceService),
      new DeleteSourceChannel(this.sourceService),
      // Results
      new GetResultsChannel(this.resultService),
      new CreateResultsChannel(this.resultService),
      new DeleteResultChannel(this.resultService),
      new EditResultChannel(this.resultService),
    ])
  }

  private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
    ipcChannels.forEach(channel => ipcMain.handle(channel.getName(), (event, request) => channel.handle(event, request)));
  }

  private start = () => {
    this.setupHandlers();
    this.setupApplicationMenu();
    this.createWindow();
  }


  public init() {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', this.start);

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        this.dataRepository.close();
        app.quit();
      }
    });

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  }
}

var main = new Main();
main.init();