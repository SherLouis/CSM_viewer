import { systemInfo } from "../models/systemInfo";
import {execSync} from "child_process";

export function getSystemInfo(): systemInfo {
    return { 
        kernel: execSync('uname -a').toString(),
        otherNonUsefulInfo: "bob"
    };
}