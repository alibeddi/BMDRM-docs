'use client';

import { createContext, useContext, useState } from 'react';
import { ThemeProvider } from 'next-themes';

const SidebarContext = createContext();

export function useSidebar() {
    return useContext(SidebarContext);
}

export default function Providers({ children }) {
    // State to track open folders by their path (or title if path missing)
    const [openFolders, setOpenFolders] = useState({});

    const toggleFolder = (path, forceState = null) => {
        setOpenFolders(prev => {
            const newState = { ...prev };
            if (forceState !== null) {
                newState[path] = forceState;
            } else {
                newState[path] = !prev[path];
            }
            return newState;
        });
    };

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SidebarContext.Provider value={{ openFolders, toggleFolder }}>
                {children}
            </SidebarContext.Provider>
        </ThemeProvider>
    );
}
