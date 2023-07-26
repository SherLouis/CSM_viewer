import { SystemInfo } from "../models/systemInfo";
import {execSync} from "child_process";

export class SystemInfoService {
    public getSystemInfo(): SystemInfo {
        return { 
            kernel: execSync('systeminfo | findstr /B /C:"Version du système:"').toString(),
            otherNonUsefulInfo: "bob"
        };
    }
}