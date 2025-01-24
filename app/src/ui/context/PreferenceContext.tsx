import { createContext, useContext, useEffect, useState } from "react";


export interface Preferences {
    amplitude_presets: number[],
    frequency_presets: number[],
    duration_presets: number[],
    phase_length_presets: number[]

};

const defaultPreferences: Preferences = {
    amplitude_presets: [0.5, 0.8, 1, 1.2, 1.4, 2],
    frequency_presets: [1, 55],
    duration_presets: [5, 10],
    phase_length_presets: [0.3, 0.5]
}

interface PreferencesContextType {
    preferences: Preferences;
    updatePreference: (key: keyof Preferences, value: any) => void;
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const loadPreferences = (): Preferences => {
    const storedPreferences = localStorage.getItem('preferences');
    if (storedPreferences === null) {
        return defaultPreferences;
    }

    const parsedPreferences = JSON.parse(storedPreferences) as Preferences;

    // Combinaison des préférences par défaut et des préférences stockées
    return {
        amplitude_presets: parsedPreferences.amplitude_presets.length !== 0 ? parsedPreferences.amplitude_presets : defaultPreferences.amplitude_presets,
        frequency_presets: parsedPreferences.frequency_presets.length !== 0 ? parsedPreferences.frequency_presets : defaultPreferences.frequency_presets,
        duration_presets: parsedPreferences.duration_presets.length !== 0 ? parsedPreferences.duration_presets : defaultPreferences.duration_presets,
        phase_length_presets: parsedPreferences.phase_length_presets.length !== 0 ? parsedPreferences.phase_length_presets : defaultPreferences.phase_length_presets
    };
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