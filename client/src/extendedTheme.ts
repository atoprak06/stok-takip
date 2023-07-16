/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Palette,
  TypeBackground,
  SimplePaletteColorOptions,
} from "@mui/material/styles/createPalette";

declare module "@mui/material/styles/createPalette" {
  interface PaletteColorOptionsIndexed {
    [key: number]: string;
  }

  interface PaletteColor extends PaletteColorOptionsIndexed {}

  interface TypeBackground {
    dark: string;
    light: string;
  }

  interface Palette {
    primary: PaletteColor;
    tertiary: PaletteColor;
    background: TypeBackground;
  }

  interface SimplePaletteColorOptions {
    [key: number]: string;
  }
}
