import React, { createContext, useContext, useState } from "react";

interface SchemeContextType {
    selectedSchemeId: number | null;
    setSelectedSchemeId: (id: number | null) => void;
}

const SchemeContext = createContext<SchemeContextType | undefined>(undefined);

export const SchemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedSchemeId, setSelectedSchemeIdState] = useState<number | null>(() => {
        const saved = localStorage.getItem("scheme_id");
        return saved ? parseInt(saved, 10) : null;
    });

    const setSelectedSchemeId = (id: number | null) => {
        setSelectedSchemeIdState(id);
        if (id !== null) {
            localStorage.setItem("scheme_id", id.toString());
        } else {
            localStorage.removeItem("scheme_id");
        }
        // Cleanup old full object if it exists
        localStorage.removeItem("selected_scheme");
    };

    return (
        <SchemeContext.Provider value={{ selectedSchemeId, setSelectedSchemeId }}>
            {children}
        </SchemeContext.Provider>
    );
};

export const useScheme = () => {
    const context = useContext(SchemeContext);
    if (context === undefined) {
        throw new Error("useScheme must be used within a SchemeProvider");
    }
    return context;
};
