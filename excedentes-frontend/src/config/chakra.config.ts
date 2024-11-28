import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "#root": {
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100%",
      },
      "#app": {
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        width: "100%",
        height: "100%",
        margin: 0,
      },
      ".center": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        height: "100%",
      },
    },
  },
  colors: {
    primary: "#21381B",
    secondary: "#F2F2F2",
    terciary: "#4A5568",



    green100: "#73E02D",
    green200: "#2DE05A",
    green300: "#4F6144",
    green500: "#193917",

    red500: "#E02D37",
    red800: "#C62828",

    orange300: "#E95E2D",
    orange400: "#B76817",
  },
  fonts: {
    heading: "Georiga, -apple-system, BlinkMacSystemFont, Roboto, arial, sans-serif",
    body: "Georgia, -apple-system, BlinkMacSystemFont, Roboto, arial, sans-serif",
  },
  fontSizes: {
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
});

export default theme;
