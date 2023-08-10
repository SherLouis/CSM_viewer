import { app, BrowserWindow, ipcMain } from 'electron';
import { IpcChannelInterface } from '../IPC/IpcChannelInterface';
import { SystemInfoChannel } from '../IPC/IpcChannels/SystemInfoIpcChannel';
import { SystemInfoService } from '../core/services/systemInfoService';
import { GetArticlesChannel } from '../IPC/IpcChannels/Article/GetArticlesChannel';
import { ArticleService } from '../core/services/ArticleService';
import { CreateArticleChannel } from '../IPC/IpcChannels/Article/CreateArticleChannel';

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
  private articleService: ArticleService = new ArticleService();
  private createWindow = (): void => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
      },
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  };

  private setupHandlers = () => {
    // TODO: import handlers from other file or setup here. This is the interaction between the window and the main process.
    this.registerIpcChannels([
      //new SystemInfoChannel(this.systemInfoService)
      new GetArticlesChannel(this.articleService),
      new CreateArticleChannel(this.articleService)
    ])
  }

  private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
    ipcChannels.forEach(channel => ipcMain.handle(channel.getName(), (event, request) => channel.handle(event, request)));
  }

  private start = () => {
    this.setupHandlers();
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