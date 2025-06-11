import {create} from 'zustand';

type Theme = {
    theme:string,
    setTheme:(theme:string)=>void
}
export const useThemesStore = create<Theme>((set)=>({
    theme:localStorage.getItem('theme') || 'light',

    setTheme: (theme: string) => {
        localStorage.setItem('theme', theme);
        set({ theme });
    }
}))