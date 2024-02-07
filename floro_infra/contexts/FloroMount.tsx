import React from "react";

import { FloroDebugProvider } from "./FloroDebugProvider";
import { FloroTextProvider } from "./text/FloroTextContext";
import { FloroLocalesProvider } from "./text/FloroLocalesContext";
import { FloroConnectionProvider } from "./FloroConnectionProvider";
import { FloroPaletteProvider } from "./palette/FloroPaletteProvider";
import ThemeMount from "./themes/ThemeMount";
import { FloroIconsProvider } from "./icons/FloroIconsProvider";

interface Props {
  children: React.ReactElement;
}

const FloroMount = (props: Props) => {
  return (
    <FloroConnectionProvider>
      <FloroDebugProvider>
        <FloroPaletteProvider>
          <ThemeMount>
            <FloroIconsProvider>
              <FloroTextProvider>
                <FloroLocalesProvider>
                  {props.children}
                </FloroLocalesProvider>
              </FloroTextProvider>
            </FloroIconsProvider>
          </ThemeMount>
        </FloroPaletteProvider>
      </FloroDebugProvider>
    </FloroConnectionProvider>
  );
};

export default FloroMount;
