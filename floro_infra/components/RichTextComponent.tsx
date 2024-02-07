import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { DebugInfo, PhraseKeys } from "../floro_modules/text-generator";
import { RichTextProps, TextRenderers } from "../renderers/RichTextRenderer";
import {
  Platform,
  TextStyle,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native";
//@ts-ignore
import WindowOverlay from "./WindowOverlay";
import { View, Text } from "react-native";
import { Portal } from "@gorhom/portal";
import metaFloro from "../floro_modules/meta.floro";

export interface TextDebugOptions {
  debugHex: `#${string}`;
  debugTextColorHex: string;
}

export declare type ARGS_DEF<K extends keyof PhraseKeys> = {
  [KV in keyof PhraseKeys[K]["variables"]]: PhraseKeys[K]["variables"][KV];
} & {
  [KCV in keyof PhraseKeys[K]["contentVariables"]]: React.ReactElement;
} & {
  [KSC in keyof PhraseKeys[K]["styleClasses"]]: (
    content: React.ReactElement,
    styledContentName: keyof PhraseKeys[K]["styledContents"] & string,
    plainText?: string
  ) => React.ReactElement;
};

export declare type ARGS_COND<K extends keyof PhraseKeys> =
  keyof ARGS_DEF<K> extends {
    length: 0;
  }
    ? never
    : ARGS_DEF<K>;

interface RTProps<K extends keyof PhraseKeys> {
  callback: (
    width: number,
    args: ARGS_DEF<K>,
    richTextOptions: RichTextProps<K>,
    renderers: TextRenderers<keyof PhraseKeys[K]["styledContents"] & string>
  ) => React.ReactElement;
  onLayout: (width: number) => void;
  isReady: boolean;
  savedWidth: number;
  isDebugMode: boolean;
  debugInfo: DebugInfo;
  socket?: Socket | null;
  androidAutoAdjust?: boolean;
  phraseKey: string;
  textStyles?: TextStyle;
  richTextOptions?: RichTextProps<K>;
  renders: TextRenderers<keyof PhraseKeys[K]["styledContents"] & string>;
  args: ARGS_COND<K>;
}
const RichTextComponent = <K extends keyof PhraseKeys>(props: RTProps<K>) => {
  const [width, setWidth] = useState(0);
  const ref = useRef<Text>(null);
  const onLayout = useCallback(
    (event) => {
      setWidth(event.nativeEvent.layout.width);
      if (event.nativeEvent.layout.width) {
        props.onLayout(event.nativeEvent.layout.width);
      }
    },
    [props.phraseKey]
  );

  const layoutWidth = useMemo(() => {
    if (width) {
      return width;
    }
    if (props.savedWidth) {
      return props.savedWidth;
    }
    return undefined;
  }, [width, props.savedWidth]);

  const textContent = useMemo(() => {
    return props.callback(
      layoutWidth == 0 ? undefined : layoutWidth,
      props.args,
      props.richTextOptions,
      props.renders
    );
  }, [
    props.callback,
    layoutWidth,
    props.isDebugMode,
    width,
    props.args,
    props.richTextOptions,
    props.renders,
  ]);

  const [showDebugWindow, setShowDebugWindow] = useState(false);
  const [debugDims, setDebugDims] = useState([0, 0]);
  const [showOpacity, setShowOpacity] = useState(false);

  const onPressDebug = useCallback(() => {
    if (!props.isDebugMode) {
      return;
    }
    setShowDebugWindow(true);
  }, [props.isDebugMode]);

  useEffect(() => {
    if (!showDebugWindow) {
      setShowOpacity(false);
    }
  }, [showDebugWindow]);

  return (
    <>
      <Text
        onLayout={onLayout}
        ref={ref}
        style={{
          borderColor: "transparent",
          borderWidth: Platform.OS == "android" ? undefined : 1,
          ...(props.textStyles ?? {}),
          ...(props.isDebugMode
            ? {
                borderWidth: 1,
                borderColor: "#FF0000",
              }
            : {}),
        }}
        onPress={props.isDebugMode ? onPressDebug : null}
      >
        {textContent}
      </Text>
      {showDebugWindow && (
        <Portal>
          <WindowOverlay>
            <View
              onLayout={() => {
                ref.current.measureInWindow((x, y) => {
                  setDebugDims([x, y]);
                  setShowOpacity(true);
                });
              }}
              style={{
                position: "absolute",
                borderWidth: 1,
                backgroundColor: "#FF000080",
                minWidth: 140,
                maxWidth: 200,
                minHeight: 100,
                left: debugDims[0],
                top: debugDims[1],
                opacity: showOpacity ? 1 : 0,
              }}
            >
              <View
                style={{
                  backgroundColor: "#0000FFCC",
                  padding: 8,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableHighlight
                  onPress={() => {
                    if (props.socket) {
                      props.socket.emit("plugin:message", {
                        repositoryId: metaFloro.repositoryId,
                        plugin: "text",
                        eventName: "open:phrase",
                        message: {
                          ...props.debugInfo,
                        },
                      });
                    }
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      textDecorationLine: "underline",
                      color: "white",
                      fontSize: 18,
                    }}
                  >
                    {"OPEN"}
                  </Text>
                </TouchableHighlight>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setShowDebugWindow(false);
                  }}
                >
                  <Text
                    style={{
                      width: 48,
                      height: "100%",
                      color: "white",
                      fontSize: 24,
                      fontWeight: "bold",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      textAlign: "right",
                    }}
                  >
                    {"X"}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 8,
                }}
              >
                <Text style={{ fontSize: 18, color: "white" }}>
                  <Text style={{ fontWeight: "bold" }}>{"Phrase Group: "}</Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {props.debugInfo.groupName}
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 8,
                }}
              >
                <Text style={{ fontSize: 18, color: "white" }}>
                  <Text style={{ fontWeight: "bold" }}>{"Phrase Key: "}</Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {props.debugInfo.phraseKey}
                  </Text>
                </Text>
              </View>
            </View>
          </WindowOverlay>
        </Portal>
      )}
    </>
  );
};

export default RichTextComponent;