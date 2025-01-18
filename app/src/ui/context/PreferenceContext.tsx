import { createContext, useContext, useEffect, useState } from "react";


interface Preferences {
    stimulationFormPref: {
        amplitude_presets: number[],
        frequency_presets: number[],
        duration_presets: number[],
        phase_length_presets: number[]
    }
};

interface PreferencesContextType {
    preferences: Preferences;
    updatePreference: (key: keyof Preferences, value: any) => void;
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const loadPreferences = (): Preferences => {
    const storedPreferences = localStorage.getItem('preferences');
    const defaultPreferences: Preferences = {
        stimulationFormPref: {
            amplitude_presets: [],
            frequency_presets: [],
            duration_presets: [],
            phase_length_presets: []
        }
    }
    return storedPreferences ? JSON.parse(storedPreferences) : defaultPreferences;
};


const savePreferences = (preferences: Preferences) => {
    localStorage.setItem('preferences', JSON.stringify(preferences));
};

interface PreferencesContextProviderProps {
    children: React.ReactNode;
};

export const PreferencesContextProvider = ({ children }: PreferencesContextProviderProps) => {
    // Initialiser l'état avec les préférences en localStorage ou une valeur par défaut
    const [preferences, setPreferences] = useState<Preferences>(loadPreferences());

    useEffect(() => {
        // Sauvegarder les préférences chaque fois qu'elles changent
        savePreferences(preferences);
    }, [preferences]);

    // Fonction pour mettre à jour une préférence spécifique
    const updatePreference = (key: keyof Preferences, value: any) => {
        setPreferences((prevPreferences) => ({
            ...prevPreferences,
            [key]: value,
        }));
    };

    return (
        <PreferencesContext.Provider value={{ preferences, updatePreference }}>
            {children}
        </PreferencesContext.Provider>
    );
};

export const usePreferences = (): PreferencesContextType => {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('usePreferences must be used within a PreferencesContextProvider');
    }
    return context;
};