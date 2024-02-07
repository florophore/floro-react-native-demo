import React, { useCallback, useMemo, useState } from "react";
import {
  Image,
  Alert,
  Linking,
  ScrollView,
  View,
  ImageStyle,
} from "react-native";
import {
  createUseStyles,
  useThemeColor,
} from "../helpers/styleshook";
import { useNavigation } from "@react-navigation/native";
import { usePlainText, useRichText } from "../../floro_infra/hooks/text";
import { PhraseKeys } from "../../floro_infra/floro_modules/text-generator";
import { useInputModal } from "../helpers/input-modal";
import { ordinalSuffix } from "../helpers/stringrules";
import { useFloroLocales } from "../../floro_infra/contexts/text/FloroLocalesContext";

import CodeHighlighter from "react-native-code-highlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useIcon } from "../helpers/icons";

const ExampleStringsScreen = () => {
  const styles = useStyles();
  const { selectedLocaleCode } = useFloroLocales();
  const BackArrow = useIcon("string-examples.back-arrow");
  const navigation = useNavigation();
  const onBack = useCallback(() => {
    navigation.goBack();
  }, []);
  const contrastText = useThemeColor("contrast-text-light");
  const contrastTextGray = useThemeColor("contrast-gray");
  const ExampleStringsTitle = useRichText(
    "string_examples.string_examples_title"
  );
  const StringsOverview = useRichText("string_examples.string_overview");
  const LinkHandling = useRichText("string_examples.handling_links");
  const InsertingContent = useRichText("string_examples.inserting_content");
  const PluralizationAndGrammar = useRichText(
    "string_examples.pluralization_and_grammar"
  );
  const NumbersAndDatesExample = useRichText(
    "string_examples.numbers,_dates,_currency,_&_lists"
  );

  const onLinkPress = useCallback(
    (
      linkName: keyof PhraseKeys["string_examples.handling_links"]["links"],
      linkHref: string
    ) => {
      if (linkName == "navigate back") {
        navigation.goBack();
      }
      if (linkName == "alert link") {
        Alert.alert("here is an alert");
      }
      if (linkName == "floro webpage") {
        Linking.canOpenURL(linkHref).then((canOpen) => {
          if (canOpen) {
            Linking.openURL(linkHref);
          } else {
            Alert.alert("cannot open " + linkHref);
          }
        });
      }
    },
    []
  );

  const [insertUrl, setInsertUrl] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/2/24/Male_mallard_duck_2.jpg"
  );

  const enterUrlPlaceholder = usePlainText(
    "string_examples.enter_url_input_placeholder"
  );
  const contentVariableInput = useInputModal(
    {
      style: styles.input,
      placeholder: enterUrlPlaceholder,
      placeholderTextColor: contrastTextGray,
      value: insertUrl,
      onChangeText: setInsertUrl,
      returnKeyType: "done",
    },
    enterUrlPlaceholder
  );
  const enterNumberOfFilesPlaceholder = usePlainText(
    "string_examples.enter_number_of_files_placeholder"
  );
  const [numberOfFilesString, setNumberOfFiles] = useState("1");
  const numberOfFiles = useMemo(() => {
    try {
      const value = parseFloat(numberOfFilesString);
      if (Number.isNaN(value)) {
        return 0;
      }
      return value;
    } catch (e) {
      return 0;
    }
  }, [numberOfFilesString]);

  const [placeString, setPlaceString] = useState("1");
  const place = useMemo(() => {
    try {
      const value = parseFloat(placeString);
      if (Number.isNaN(value)) {
        return 0;
      }
      return value;
    } catch (e) {
      return 0;
    }
  }, [placeString]);

  const placeSuffix = useMemo(() => {
    return ordinalSuffix(place, selectedLocaleCode);
  }, [place, selectedLocaleCode]);
  const onPressShopifyLinkExample = useCallback(
    (
      linkName: keyof PhraseKeys["string_examples.pluralization_and_grammar"]["links"],
      linkHref: string
    ) => {
      if (linkName == "shopify article") {
        Linking.openURL(linkHref);
      }
    },
    []
  );

  const pluralInput = useInputModal(
    {
      style: styles.input,
      placeholder: enterNumberOfFilesPlaceholder,
      placeholderTextColor: contrastTextGray,
      value: numberOfFilesString,
      onChangeText: setNumberOfFiles,
      keyboardType: "numeric",
      returnKeyType: "done",
    },
    enterNumberOfFilesPlaceholder
  );

  const enterPlacePlaceholder = usePlainText("string_examples.enter_place");
  const placeInput = useInputModal(
    {
      style: styles.input,
      placeholder: enterPlacePlaceholder,
      placeholderTextColor: contrastTextGray,
      value: placeString,
      onChangeText: setPlaceString,
      keyboardType: "numeric",
      returnKeyType: "done",
    },
    enterPlacePlaceholder
  );


  const [gender, setGender] = useState("female");
  const enterGenderInput = usePlainText(
    "string_examples.enter_gender_input_placeholder"
  );
  const genderInput = useInputModal(
    {
      style: styles.input,
      placeholder: enterGenderInput,
      placeholderTextColor: contrastTextGray,
      value: gender,
      onChangeText: setGender,
      returnKeyType: "done",
    },
    enterPlacePlaceholder
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <ExampleStringsTitle
          richTextOptions={{
            color: contrastText,
          }}
        />
        <BackArrow onPress={onBack} width={40} />
      </View>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode={"on-drag"}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        <StringsOverview
          viewProps={{style: styles.stringExample}}
          title={(content) => {
            return content;
          }}
          code={(content) => {
            return <View style={styles.codeBox}>{content}</View>;
          }}
          richTextOptions={{
            color: contrastText,
            styledContent: {
              title: styles.sectionTitle,
              code: styles.codeText,
            },
          }}
        />
        <LinkHandling
          viewProps={{style: styles.stringExample}}
          title={(content) => {
            return content;
          }}
          code={(_rtContent,_name, plainText) => {
            return (
              <View style={styles.codeBox}>
                <CodeHighlighter
                  hljsStyle={atomOneDarkReasonable}
                  textStyle={styles.codeText}
                  language="typescript"
                >
                  {plainText}
                </CodeHighlighter>
              </View>
            );
          }}
          richTextOptions={{
            color: contrastText,
            styledContent: {
              title: styles.sectionTitle,
              code: styles.codeTextSmall,
            },
            onPressLink: onLinkPress,
          }}
        />
        <InsertingContent
          viewProps={{style: styles.stringExample}}
          title={(content) => {
            return content;
          }}
          code={(_rtContent,_name, plainText) => {
            return (
              <View style={styles.codeBox}>
                <CodeHighlighter
                  hljsStyle={atomOneDarkReasonable}
                  textStyle={styles.codeText}
                  language="typescript"
                >
                  {plainText}
                </CodeHighlighter>
              </View>
            );
          }}
          inputContent={
            <View style={styles.contentWrapper}>
              {contentVariableInput}
              <Image
                source={{
                  uri: insertUrl,
                }}
                style={styles.image as ImageStyle}
              />
            </View>
          }
          richTextOptions={{
            color: contrastText,
            styledContent: {
              title: styles.sectionTitle,
              code: styles.codeTextSmall,
            },
          }}
        />
        <PluralizationAndGrammar
          viewProps={{style: styles.stringExample}}
          numberOfFiles={numberOfFiles}
          place={place}
          placeSuffix={placeSuffix}
          gender={gender.toLowerCase()}
          title={(content) => {
            return content;
          }}
          smallTitle={(content) => {
            return content;
          }}
          inputContent={
            <View style={styles.contentWrapper}>{pluralInput}</View>
          }
          placeInput={
            <View style={styles.contentWrapper}>{placeInput}</View>
          }
          genderInputContent={
            <View style={styles.contentWrapper}>{genderInput}</View>
          }
          richTextOptions={{
            color: contrastText,
            styledContent: {
              title: styles.sectionTitle,
              smallTitle: styles.smallTitle,
            },
            onPressLink: onPressShopifyLinkExample,
          }}
        />
        <NumbersAndDatesExample
          viewProps={{style: styles.stringExample}}
          title={(content) => {
            return content;
          }}
          richTextOptions={{
            color: contrastText,
            styledContent: {
              title: styles.sectionTitle,
            },
          }}
        />
        <View style={{ height: 300 }} />
      </ScrollView>
    </View>
  );
};

const useStyles = createUseStyles(
  ({ paletteColor, themeColor, background }) => ({
    container: {
      backgroundColor: background,
      height: "100%",
      width: "100%",
    },
    titleWrapper: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderColor: themeColor("contrast-text"),
      borderBottomWidth: 1,
    },
    scrollView: {
      padding: 24,
      position: "relative",
    },
    sectionTitle: {
      fontSize: 28,
      color: themeColor("purple-theme"),
    },
    smallTitle: {
      fontSize: 24,
      color: themeColor("purple-theme"),
    },
    stringExample: {
      display: "flex",
      marginBottom: 24,
      width: "100%",
    },
    codeBox: {
      borderColor: themeColor("contrast-text-light"),
      backgroundColor: paletteColor("gray", "regular"),
      padding: 8,
      borderRadius: 8,
      width: "100%",
    },
    codeText: {
      color: paletteColor("white", "regular"),
      fontSize: 16,
      width: "100%",
    },
    codeTextSmall: {
      color: paletteColor("white", "regular"),
      fontSize: 12,
      width: "100%",
    },
    input: {
      color: themeColor("contrast-text"),
      borderColor: themeColor("contrast-gray"),
      borderWidth: 2,
      borderRadius: 8,
      height: 48,
      padding: 8,
    },
    image: {
      marginTop: 24,
      borderRadius: 8,
      aspectRatio: 3 / 2,
      width: "80%",
      alignSelf: "center"
    },
    contentWrapper: {
      width: "100%",
    },
  })
);

export default React.memo(ExampleStringsScreen);
