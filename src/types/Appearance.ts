export interface Appearance {
    mode: "system" | "light" | "dark";  
}

export type Mode = Appearance["mode"];

export type AppearanceKey = "appearance";