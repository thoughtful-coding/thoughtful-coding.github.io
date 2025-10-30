import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    immer(
      persist(
        (set) => ({
          theme: "light",
          setTheme: (newTheme) => set({ theme: newTheme }),
        }),
        {
          name: "thoughtful-python-theme-storage",
          storage: createJSONStorage(() => localStorage),
        }
      )
    ),
    { name: "Theme Store" }
  )
);
