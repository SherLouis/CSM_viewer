import { createContext, useContext, useEffect, useState } from "react";

type AppContextState = {
    dbLocation: string;
    isInMemoryDb: boolean;
    mode: AppMode;
};

type AppMode = "normal" | "merge";

type AppContextProviderProps = { children: React.ReactNode };

const AppContext = createContext<AppContextState | undefined>(undefined);

const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const [dbLocation, setDbLocation] = useState("In memory");
    const [mode, setMode] = useState<AppMode>("normal");

    const contextValue = {
        dbLocation: dbLocation,
        isInMemoryDb: dbLocation === "In memory",
        mode: mode
    } as AppContextState;

    useEffect(() => {
        // Listen for the event
        window.electronAPI.dbLocationChanged((event, value) => {
            setDbLocation(value)
        })
    }, [window.electronAPI.dbLocationChanged]);

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