import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Locales,
  PhraseKeys,
  StaticNode,
  getDebugInfo,
  getPhraseValue,
} from "../floro_modules/text-generator";
import {
  RichTextProps,
  TextRenderers,
  richTextRenderers,
} from "../renderers/RichTextRenderer";
import {
  PlainTextRenderers,
  plainTextRenderers,
} from "../renderers/PlainTextRenderer";
import { useFloroText } from "../contexts/text/FloroTextContext";
import { useFloroLocales } from "../contexts/text/FloroLocalesContext";
import { useFloroDebug } from "../contexts/FloroDebugProvider";
import { useFloroConnection } from "../contexts/FloroConnectionProvider";
import {
  Platform,
  Text,
  TextStyle,
  View,
  ViewProps,
} from "react-native";
import { useThemePreference } from "../contexts/themes/ThemePreferenceProvider";
import { defaultRichText } from "../renderers/FontDefs";
import RichTextComponent, { ARGS_COND, ARGS_DEF } from "../components/RichTextComponent";

export interface TextDebugOptions {
  debugHex: `#${string}`;
  debugTextColorHex: string;
}

type RTCallbackProps<K extends keyof PhraseKeys> = {
  textStyles?: TextStyle;
  richTextOptions?: RichTextProps<K>;
  renders?: TextRenderers<keyof PhraseKeys[K]["styledContents"] & string>;
  viewProps?: Partial<ViewProps>;
} & ARGS_DEF<K>;

export const useRichText = <K extends keyof PhraseKeys>(phraseKey: K) => {
  const floroText = useFloroText();
  const { showDebugMode } = useFloroDebug();
  const { selectedLocaleCode } = useFloroLocales();
  const { socket } = useFloroConnection();
  const debugInfo = useMemo(
    () => getDebugInfo(floroText.phraseKeyDebugInfo, phraseKey),
    [phraseKey, floroText.phraseKeyDebugInfo, floroText]
  );

  const ref = useRef<Text>(null);

  const { currentTheme } = useThemePreference();
  const callback = useCallback(
    (
      width: number,
      args: ARGS_DEF<K>,
      richTextOptionsArg?: RichTextProps<K> | undefined,
      renderers?: TextRenderers<keyof PhraseKeys[K]["styledContents"] & string>
    ) => {
      const nodes = getPhraseValue<React.ReactElement, keyof Locales, K>(
        floroText,
        selectedLocaleCode,
        phraseKey,
        args
      );
      const isShallowNode = getIsShallowNodes<React.ReactElement>(nodes);
      if (width == 0 && !isShallowNode && Platform.OS == "android") {
        return null;
      }
      return { ...(richTextRenderers ?? {}), ...(renderers ?? {}) }.render(
        nodes,
        renderers,
        showDebugMode,
        { ...defaultRichText, ...(richTextOptionsArg ?? {}) },
        ref,
        width
      );
    },
    [showDebugMode, floroText, phraseKey, selectedLocaleCode, currentTheme]
  );

  const [isReady, setIsReady] = useState(false);
  const [savedWidth, setSavedWidth] = useState(0);
  const onLayout = useCallback((width: number) => {
    setIsReady(true);
    setSavedWidth(width);
  }, []);

  return useMemo(
    () => (props: RTCallbackProps<K>) => {
      const { textStyles, richTextOptions, renders, viewProps, ...args } =
        props;
      return (
        <View {...viewProps}>
          <RichTextComponent
            isDebugMode={showDebugMode}
            debugInfo={debugInfo}
            socket={socket}
            phraseKey={phraseKey}
            onLayout={onLayout}
            isReady={isReady}
            callback={callback}
            textStyles={textStyles}
            args={(args as ARGS_COND<K>) ?? ({} as ARGS_COND<K>)}
            richTextOptions={richTextOptions}
            savedWidth={savedWidth}
            renders={{
              ...richTextRenderers,
              ...renders,
            }}
          />
        </View>
      );
    },
    [
      savedWidth,
      showDebugMode,
      debugInfo,
      socket,
      phraseKey,
      onLayout,
      isReady,
      callback,
    ]
  );
};

export const usePlainText = <
  K extends keyof PhraseKeys,
  ARGS extends {
    [KV in keyof PhraseKeys[K]["variables"]]: PhraseKeys[K]["variables"][KV];
  } & {
    [KCV in keyof PhraseKeys[K]["contentVariables"]]: string;
  } & {
    [KSC in keyof PhraseKeys[K]["styleClasses"]]: (
      content: string,
      styledContentName: keyof PhraseKeys[K]["styledContents"] & string
    ) => string;
  }
>(
  phraseKey: K,
  ...opts: keyof ARGS extends { length: 0 }
    ? [
        ARGS?,
        PlainTextRenderers<keyof PhraseKeys[K]["styledContents"] & string>?
      ]
    : [
        ARGS,
        PlainTextRenderers<keyof PhraseKeys[K]["styledContents"] & string>?
      ]
) => {
  const args = opts[0] ?? ({} as ARGS);
  const renderers = opts?.[1] ?? plainTextRenderers;
  const floroText = useFloroText();
  const { selectedLocaleCode } = useFloroLocales();
  return useMemo(() => {
    const nodes = getPhraseValue<string, keyof Locales, K>(
      floroText,
      selectedLocaleCode,
      phraseKey,
      args
    );
    return renderers.render(nodes, renderers);
  }, [richTextRenderers, renderers, selectedLocaleCode, args, phraseKey]);
};

const getIsShallowNodes = <K,>(nodes: StaticNode<K>[]) => {
  const queue = [...nodes];
  while (queue.length > 0) {
    const current = queue.pop();
    if (current.type != "text") {
      return false;
    }
    for (const child of current.children) {
      queue.push(child);
    }
  }
  return true;
};
