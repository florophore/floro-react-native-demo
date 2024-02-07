import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { createUseStyles, useThemeColor } from "../helpers/styleshook";
import { useRichText } from "../../floro_infra/hooks/text";
import { useFloroLocales } from "../../floro_infra/contexts/text/FloroLocalesContext";
import { Locales } from "../../floro_infra/floro_modules/text-generator";
import LocaleSelect from "../components/LocaleSelect";

const LanguageSelectorModal = () => {
  const styles = useStyles();
  const contrastText = useThemeColor("contrast-text");
  const SelectALanguageTitle = useRichText(
    "language_selector.select_a_language"
  );
  const { locales } = useFloroLocales();

  const localesList = useMemo(() => {
    return Object.keys(locales).map((localeCode) => {
      return locales[localeCode as keyof typeof locales];
    });
  }, [locales]);
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <SelectALanguageTitle
          richTextOptions={{
            fontDef: "MavenPro",
            fontSize: 30,
            color: contrastText,
          }}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        {localesList.map((locale, index) => {
          return (
            <LocaleSelect
              key={index}
              locale={locale as Locales[keyof Locales]}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const useStyles = createUseStyles(({ background, themeColor }) => {
  return {
    container: {
      backgroundColor: background,
      height: "100%",
      width: "100%",
    },
    titleWrapper: {
      padding: 24,
    },
    scrollView: {
      borderColor: themeColor("contrast-text"),
      borderTopWidth: 1,
      padding: 24,
    },
  };
});

export default React.memo(LanguageSelectorModal);
