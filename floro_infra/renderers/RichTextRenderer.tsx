import React from "react";
import {
  StaticNode,
  StaticOrderedListNode,
  StaticUnOrderedListNode,
  StaticListNode,
  StaticLinkNode,
  StaticTextNode,
  StaticContentVariable,
  StaticStyledTextNode,
  PhraseKeys,
} from "../floro_modules/text-generator";
import {
  View,
  Text,
  ColorValue,
  TextStyle,
  StyleProp,
  Platform,
} from "react-native";
import { FontDefs, defaultRichText, fontDefs } from "./FontDefs";
import { plainTextRenderers } from "./PlainTextRenderer";

export interface RichTextProps<T extends keyof PhraseKeys | unknown> {
  color?: ColorValue;
  fontSize?: number;
  fontFamily?: string;
  fontDef?: keyof FontDefs;
  fontScriptScale?: number;
  fontSubSize?: number;
  fontSuperSize?: number;
  onPressLink?: (
    linkName: T extends keyof PhraseKeys
      ? keyof PhraseKeys[T]["links"]
      : string,
    linkHref: string
  ) => void;
  linkColor?: ColorValue;
  textStyles?: (StyleProp<TextStyle> & object) | undefined;
  styledContent?: {
    [Property in keyof (T extends keyof PhraseKeys
      ? PhraseKeys[T]["styleClasses"]
      : object)]: (StyleProp<TextStyle> & object) | undefined;
  };
  styledFontDef?: {
    [Property in keyof (T extends keyof PhraseKeys
      ? PhraseKeys[T]["styleClasses"]
      : object)]: keyof FontDefs;
  };
}

export interface TextRenderers<N extends string> {
  render: (
    nodes: (
      | StaticNode<React.ReactElement>
      | StaticListNode<React.ReactElement>
    )[],
    renderers: TextRenderers<N>,
    isDebugMode: boolean,
    richTextProps?: RichTextProps<unknown>,
    ref?: React.MutableRefObject<Text>,
    width?: number
  ) => React.ReactElement;
  renderStaticNodes: (
    nodes: (
      | StaticNode<React.ReactElement>
      | StaticListNode<React.ReactElement>
    )[],
    renderers: TextRenderers<N>,
    richTextProps?: RichTextProps<unknown>,
    width?: number,
    isDebugMode?: boolean
  ) => React.ReactElement;
  renderText: (
    node: StaticTextNode<React.ReactElement>,
    renderers: TextRenderers<N>,
    richTextProps?: RichTextProps<unknown>,
    width?: number,
    isDebugMode?: boolean
  ) => React.ReactElement;
  renderLinkNode: (
    node: StaticLinkNode<React.ReactElement>,
    renderers: TextRenderers<N>,
    richTextProps?: RichTextProps<unknown>,
    width?: number,
    isDebugMode?: boolean
  ) => React.ReactElement;
  renderListNode: (
    node: StaticListNode<React.ReactElement>,
    renderers: TextRenderers<N>,
    richTextProps?: RichTextProps<unknown>,
    width?: number,
    isDebugMode?: boolean
  ) => React.ReactElement;
  renderUnOrderedListNode: (
    node: StaticUnOrderedListNode<React.ReactElement>,
    renderers: TextRenderers<N>,
    richTextProps?: RichTextProps<unknown>,
    width?: number,
    isDebugMode?: boolean
  ) => React.ReactElement;
  renderOrderedListNode: (
    node: StaticOrderedListNode<React.ReactElement>,
    renderers: TextRenderers<N>,
    richTextProps?: RichTextProps<unknown>,
    width?: number,
    isDebugMode?: boolean
  ) => React.ReactElement;
  renderStyledContentNode: (
    node: StaticStyledTextNode<React.ReactElement, N>,
    renderers: TextRenderers<N>,
    richTextProps?: RichTextProps<unknown>,
    width?: number,
    isDebugMode?: boolean
  ) => React.ReactElement;
  renderContentVariable: (
    node: StaticContentVariable<React.ReactElement>,
    width?: number
  ) => React.ReactElement;
}

const renderStaticNodes = <N extends string>(
  nodes: (
    | StaticNode<React.ReactElement>
    | StaticListNode<React.ReactElement>
    | StaticContentVariable<React.ReactElement>
    | StaticStyledTextNode<React.ReactElement, N>
  )[],
  renderers: TextRenderers<N>,
  richTextProps?: RichTextProps<unknown>,
  width?: number,
  isDebugMode?: boolean
): React.ReactElement => {
  return (
    <>
      {nodes?.map((staticNode, index) => {
        return (
          <React.Fragment key={index}>
            {staticNode.type == "text" &&
              renderers.renderText(
                staticNode,
                renderers,
                richTextProps,
                width,
                isDebugMode
              )}
            {staticNode.type == "link" &&
              renderers.renderLinkNode(
                staticNode,
                renderers,
                richTextProps,
                width,
                isDebugMode
              )}
            {staticNode.type == "li" &&
              renderers.renderListNode(
                staticNode,
                renderers,
                richTextProps,
                width,
                isDebugMode
              )}
            {staticNode.type == "ul" &&
              renderers.renderUnOrderedListNode(
                staticNode,
                renderers,
                richTextProps,
                width,
                isDebugMode
              )}
            {staticNode.type == "ol" &&
              renderers.renderOrderedListNode(
                staticNode,
                renderers,
                richTextProps,
                width,
                isDebugMode
              )}
            {staticNode.type == "styled-content" &&
              renderers.renderStyledContentNode(
                staticNode,
                renderers,
                richTextProps,
                width,
                isDebugMode
              )}
            {staticNode.type == "content" &&
              renderers.renderContentVariable(staticNode, width)}
          </React.Fragment>
        );
      })}
    </>
  );
};

const renderText = <N extends string>(
  node: StaticTextNode<React.ReactElement>,
  renderers: TextRenderers<N>,
  richTextProps?: RichTextProps<unknown>,
  width?: number,
  isDebugMode?: boolean
) => {
  let children = renderers.renderStaticNodes(
    node.children,
    renderers,
    richTextProps,
    width,
    isDebugMode
  );
  const lineBreaks = node?.content?.split?.("\n") ?? [];
  const breakContent = lineBreaks.map((c, i) => (
    <React.Fragment key={i}>
      {c}
      {lineBreaks.length - 1 != i && <Text>{"\n"}</Text>}
    </React.Fragment>
  ));
  let content = (
    <>
      {breakContent}
      {children}
    </>
  );
  const fontSize = richTextProps?.fontSize ?? defaultRichText.fontSize ?? 20;
  const fontFamily =
    richTextProps?.fontFamily ?? "Arial";
  if (node.styles.isSuperscript) {
    const fontSize = richTextProps?.fontSize ?? defaultRichText.fontSize ?? 20;
    const superSize =
      richTextProps?.fontSuperSize ??
      fontSize * (richTextProps?.fontScriptScale ?? 0.6);
    content = (
      <Text
        style={{
          fontSize: superSize,
          verticalAlign: "top",
          ...(richTextProps?.color ? { color: richTextProps?.color } : {}),
          ...(richTextProps?.textStyles ?? {}),
        }}
      >
        {content}
      </Text>
    );
  }
  if (node.styles.isSubscript) {
    const fontSize = richTextProps?.fontSize ?? defaultRichText.fontSize ?? 20;
    const subSize =
      richTextProps?.fontSubSize ??
      fontSize * (richTextProps?.fontScriptScale ?? 0.6);
    content = (
      <Text
        style={{
          fontSize: subSize,
          verticalAlign: "bottom",
          ...(richTextProps?.color ? { color: richTextProps?.color } : {}),
          ...(richTextProps?.textStyles ?? {}),
        }}
      >
        {content}
      </Text>
    );
  }
  if (!node.styles.isBold && !node.styles.isItalic) {
    content = (
      <Text
        style={{
          fontFamily:
            !richTextProps?.fontFamily && richTextProps?.fontDef && fontDefs[richTextProps?.fontDef]?.regular
              ? fontDefs[richTextProps?.fontDef]?.regular
              : fontFamily,
          fontSize,
          ...(richTextProps?.color ? { color: richTextProps?.color } : {}),
          ...(richTextProps?.textStyles ?? {}),
        }}
      >
        {content}
      </Text>
    );
  }
  if (node.styles.isBold && node.styles.isItalic) {
    content = (
      <Text
        style={{
          fontStyle: "italic",
          fontWeight: "bold",
          fontFamily:
            !richTextProps?.fontFamily &&
            richTextProps?.fontDef &&
            fontDefs[richTextProps?.fontDef]?.boldItalic
              ? fontDefs[richTextProps?.fontDef]?.boldItalic
              : fontFamily,
          fontSize,
          ...(richTextProps?.color ? { color: richTextProps?.color } : {}),
          ...(richTextProps?.textStyles ?? {}),
        }}
      >
        {content}
      </Text>
    );
  }
  if (node.styles.isBold && !node.styles.isItalic) {
    content = (
      <Text
        style={{
          fontWeight: "bold",
          fontFamily:
            !richTextProps?.fontFamily &&
            richTextProps?.fontDef && fontDefs[richTextProps?.fontDef]?.bold
              ? fontDefs[richTextProps?.fontDef]?.bold
              : fontFamily,
          fontSize,
          ...(richTextProps?.color ? { color: richTextProps?.color } : {}),
          ...(richTextProps?.textStyles ?? {}),
        }}
      >
        {content}
      </Text>
    );
  }
  if (node.styles.isItalic && !node.styles.isBold) {
    content = (
      <Text
        style={{
          fontStyle: "italic",
          fontFamily:
            !richTextProps?.fontFamily &&
            richTextProps?.fontDef &&
            fontDefs[richTextProps?.fontDef]?.italic
              ? fontDefs[richTextProps?.fontDef]?.italic
              : fontFamily,
          fontSize,
          ...(richTextProps?.color ? { color: richTextProps?.color } : {}),
          ...(richTextProps?.textStyles ?? {}),
        }}
      >
        {content}
      </Text>
    );
  }
  if (node.styles.isUnderlined && node.styles.isStrikethrough) {
    content = (
      <Text
        style={{
          textDecorationLine: "underline line-through",
          fontSize,
          ...(richTextProps?.color ? { color: richTextProps?.color } : {}),
          ...(richTextProps?.textStyles ?? {}),
        }}
      >
        {content}
      </Text>
    );
  }
  if (node.styles.isUnderlined) {
    content = (
      <Text
        style={{
          textDecorationLine: "underline",
          fontFamily,
          fontSize,
          ...(richTextProps?.color ? { color: richTextProps?.color } : {}),
          ...(richTextProps?.textStyles ?? {}),
        }}
      >
        {content}
      </Text>
    );
  }
  if (node.styles.isStrikethrough) {
    content = (
      <Text
        style={{
          textDecorationLine: "line-through",
          fontFamily,
          fontSize,
          ...(richTextProps?.color ? { color: richTextProps?.color } : {}),
          ...(richTextProps?.textStyles ?? {}),
        }}
      >
        {content}
      </Text>
    );
  }
  if (node.styles.isSuperscript) {
    const fontSize = richTextProps?.fontSize ?? defaultRichText.fontSize ?? 20;
    const superSize =
      richTextProps?.fontSuperSize ??
      fontSize * (richTextProps?.fontScriptScale ?? 0.6);
    return <View style={{ paddingBottom: superSize * 0.5 }}>{content}</View>;
  }
  if (node.styles.isSubscript) {
    const fontSize = richTextProps?.fontSize ?? defaultRichText.fontSize ?? 20;
    const subSize =
      richTextProps?.fontSubSize ??
      fontSize * (richTextProps?.fontScriptScale ?? 0.6);
    if (Platform.OS == "android") {
      return (
        <View style={{ position: "relative" }}>
          <Text style={{ position: "relative", top: subSize }}>{content}</Text>
        </View>
      );
    }
    return <View style={{ marginTop: -subSize * 0.4 }}>{content}</View>;
  }
  return (
    <Text
      style={{
        fontSize,
        fontFamily,
        ...(richTextProps?.color ? { color: richTextProps?.color } : {}),
        ...(richTextProps?.textStyles ?? {}),
      }}
    >
      {content}
    </Text>
  );
};

const renderLinkNode = <N extends string>(
  node: StaticLinkNode<React.ReactElement>,
  renderers: TextRenderers<N>,
  richTextProps?: RichTextProps<unknown>,
  width?: number,
  isDebugMode?: boolean
): React.ReactElement => {
  const color = richTextProps?.linkColor ?? defaultRichText.linkColor ?? "blue";
  let children = renderers.renderStaticNodes(
    node.children,
    renderers,
    {
      ...richTextProps,
      color,
    },
    width,
    isDebugMode
  );
  const fontFamily =
    richTextProps?.fontFamily ?? "Arial";
  const onPress = () => {
    richTextProps?.onPressLink?.(node.linkName, node.href);
  };
  return (
    <Text
      onPress={onPress}
      style={{
        color,
        fontFamily:
          !richTextProps?.fontFamily &&
          richTextProps?.fontDef &&
          fontDefs[richTextProps?.fontDef]?.boldItalic
            ? fontDefs[richTextProps?.fontDef]?.boldItalic
            : fontFamily,
        textDecorationLine: "underline",
        ...(richTextProps?.textStyles ?? {}),
      }}
    >
      {children}
    </Text>
  );
};

const renderListNode = <N extends string>(
  node: StaticListNode<React.ReactElement>,
  renderers: TextRenderers<N>,
  richTextProps?: RichTextProps<unknown>,
  width?: number,
  isDebugMode?: boolean
): React.ReactElement => {
  return renderers.renderStaticNodes(
    node.children,
    renderers,
    richTextProps,
    width,
    isDebugMode
  );
};

const renderUnOrderedListNode = <N extends string>(
  node: StaticUnOrderedListNode<React.ReactElement>,
  renderers: TextRenderers<N>,
  richTextProps?: RichTextProps<unknown>,
  width?: number,
  isDebugMode?: boolean
): React.ReactElement => {
  const fontSize = richTextProps?.fontSize ?? defaultRichText.fontSize ?? 20;
  const fontFamily =
    richTextProps?.fontFamily ?? "Arial";

  if (!width && Platform.OS == "android") {
    return null;
  }
  return (
    <View
      style={{
        paddingTop: fontSize * 0.4,
        paddingBottom: fontSize * 0.4,
        width,
      }}
    >
      {node.children?.map((content, index) => {
        return (
          <View key={index} style={{ paddingLeft: fontSize * 0.4 }}>
            <Text
              style={{
                fontSize,
                marginBottom: fontSize * 0.6,
                fontFamily:
                  !richTextProps?.fontFamily &&
                  richTextProps?.fontDef &&
                  fontDefs[richTextProps?.fontDef]?.boldItalic
              ? fontDefs[richTextProps?.fontDef]?.boldItalic
              : fontFamily,
                ...(richTextProps?.color
                  ? { color: richTextProps?.color }
                  : {}),
                ...(richTextProps?.textStyles ?? {}),
              }}
            >
              {`• `}
              {renderers.renderListNode(
                content,
                renderers,
                richTextProps,
                width,
                isDebugMode
              )}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const renderOrderedListNode = <N extends string>(
  node: StaticOrderedListNode<React.ReactElement>,
  renderers: TextRenderers<N>,
  richTextProps?: RichTextProps<unknown>,
  width?: number,
  isDebugMode?: boolean
): React.ReactElement => {
  const fontSize = richTextProps?.fontSize ?? defaultRichText.fontSize ?? 20;
  const fontFamily =
    richTextProps?.fontFamily ?? "Arial";

  if (!width && Platform.OS == "android") {
    return null;
  }
  return (
    <View
      style={{
        paddingTop: fontSize * 0.4,
        paddingBottom: fontSize * 0.4,
        width,
      }}
    >
      {node.children?.map((content, index) => {
        return (
          <View key={index} style={{ paddingLeft: 8 }}>
            <Text
              style={{
                fontSize,
                marginBottom: fontSize * 0.6,
                fontFamily:
                  !richTextProps?.fontFamily &&
                  richTextProps?.fontDef &&
                  fontDefs[richTextProps?.fontDef]?.boldItalic
                    ? fontDefs[richTextProps?.fontDef]?.boldItalic
                    : fontFamily,
                ...(richTextProps?.color
                  ? { color: richTextProps?.color }
                  : {}),
                ...(richTextProps?.textStyles ?? {}),
              }}
            >
              {`${index + 1}. `}
              {renderers.renderListNode(
                content,
                renderers,
                richTextProps,
                width,
                isDebugMode
              )}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const renderStyledContentNode = <N extends string>(
  node: StaticStyledTextNode<React.ReactElement, N>,
  renderers: TextRenderers<N>,
  richTextProps?: RichTextProps<unknown>,
  width?: number,
  isDebugMode?: boolean
): React.ReactElement => {
  const ptNode: StaticStyledTextNode<string, string> = {
    ...node,
    styleClassFunction: (str) => {
      return str;
    }
  } as StaticStyledTextNode<string, string>;
  let plainTextChildren = plainTextRenderers.renderStyledContentNode(
    ptNode,
    plainTextRenderers
  );
  let children = renderers.renderStaticNodes(
    node.children,
    renderers,
    {
      ...richTextProps,
      ...(richTextProps?.styledContent?.[node.styleClass as keyof object]
        ? {
            textStyles:
              richTextProps?.styledContent?.[node.styleClass as keyof object],
          }
        : {}),
      ...(richTextProps?.styledFontDef?.[node.styleClass as keyof object]
        ? {
            fontDef:
              richTextProps?.styledFontDef?.[node.styleClass as keyof object],
          }
        : {}),
    },
    width,
    isDebugMode
  );

  if (!width && Platform.OS == "android") {
    return null;
  }
  const content =
    node?.styleClassFunction?.(children, node.styledContentName, plainTextChildren) ?? null;
  if (content) {
    return <View style={{ width: width ?? "100%" }}>{content}</View>;
  }
  return <View style={{ width: width ?? "100%" }}>{children}</View>;
};

const renderContentVariable = (
  node: StaticContentVariable<React.ReactElement>,
  width?: number
): React.ReactElement => {
  if (!width && Platform.OS == "android") {
    return null;
  }
  return <View style={{ width: width ?? "100%" }}>{node.data ?? <></>}</View>;
};

const render = <N extends string>(
  nodes: (
    | StaticNode<React.ReactElement>
    | StaticListNode<React.ReactElement>
  )[],
  renderers: TextRenderers<N>,
  isDebugMode: boolean,
  richTextProps?: RichTextProps<unknown>,
  textRef?: React.MutableRefObject<Text>,
  width?: number
): React.ReactElement => {
  const content = renderers.renderStaticNodes(
    nodes,
    renderers,
    richTextProps,
    width,
    isDebugMode
  );
  return <Text ref={textRef}>{content}</Text>;
};

export const richTextRenderers = {
  render,
  renderStaticNodes,
  renderText,
  renderLinkNode,
  renderListNode,
  renderUnOrderedListNode,
  renderOrderedListNode,
  renderStyledContentNode,
  renderContentVariable,
};
