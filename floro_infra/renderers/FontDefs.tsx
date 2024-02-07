import { RichTextProps } from "./RichTextRenderer";
import palette from "../floro_modules/palette-generator/palette.json";

export interface FontDef {
    regular?: string;
    bold?: string;
    italic?: string;
    boldItalic?: string;
}

export declare type FontFamilies = "Raleway"|"MavenPro";
export interface FontDefs extends Record<FontFamilies, FontDef>{}

export const fontDefs: FontDefs = {
    "Raleway": {
        regular: "Raleway_400Regular",
        bold: "Raleway_700Bold",
        italic: "Raleway_400Regular_Italic",
        boldItalic: "Raleway_700Bold_Italic"
    },
    "MavenPro": {
        regular: "MavenPro_400Regular",
        bold: "MavenPro_700Bold",
        italic: "Raleway_400Regular_Italic",
        boldItalic: "Raleway_700Bold_Italic"
    }
}

// this is the global default, you can override it in your components
export const defaultRichText: RichTextProps<unknown> = {
  fontDef: "MavenPro",
  fontSize: 20,
  linkColor: palette.blue?.regular,
};