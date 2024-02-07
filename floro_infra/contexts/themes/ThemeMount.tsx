import React from 'react';
import {ThemePreferenceProvider} from './ThemePreferenceProvider';
import {FloroThemesProvider} from './FloroThemesProvider';
import {ColorThemeProvider} from './ColorThemeProvider';

interface Props {
  children: React.ReactElement;
}

const ThemeMount = (props: Props) => {
  return (
    <FloroThemesProvider>
      <ThemePreferenceProvider>
        <ColorThemeProvider>{props.children}</ColorThemeProvider>
      </ThemePreferenceProvider>
    </FloroThemesProvider>
  );
};

export default React.memo(ThemeMount);
