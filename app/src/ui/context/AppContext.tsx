import { createContext, useContext, useEffect, useState } from "react";
import AppMode from "../../core/models/AppMode";

type AppContextState = {
    dbLocation: string;
    isInMemoryDb: boolean;
    mode: string;
};

type AppContextProviderProps = { children: React.ReactNode };

const AppContext = createContext<AppContextState | undefined>(undefined);

const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const [dbLocation, setDbLocation] = useState("In memory");
    const [mode, setMode] = useState<string>(AppMode.NORMAL);

    const contextValue = {
        dbLocation: dbLocation,
        isInMemoryDb: dbLocation === "In memory",
        mode: mode
    } as AppContextState;

    useEffect(() => {
        // Listen for the db location changed event
        window.electronAPI.dbLocationChanged((event, value) => {
            setDbLocation(value);
        })
    }, [window.electronAPI.dbLocationChanged]);

    useEffect(() => {
        // Listen for the use mode event
        window.electronAPI.useMode((event, value) => {
            console.debug('Use mode: ' + value);
            setMode(value);
        })
    }, [window.electronAPI.useMode]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

const useAppState = () => {
    const context = useContext(AppContext);
    if (context == undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
}

export { AppContextProvider, useAppState };