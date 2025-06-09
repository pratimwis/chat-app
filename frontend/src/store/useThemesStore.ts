import {create} from 'zustand';

export const useThemesStore = create((set)=>({
    theme:localStorage.getItem('theme') || 'light',


    setTheme: (theme: string) => {
        localStorage.setItem('theme', theme);
        set({ theme });
    }
}))