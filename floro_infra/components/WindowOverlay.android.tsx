import React from 'react';
import { View, useWindowDimensions } from 'react-native';

interface Props {
  children: React.ReactElement;
}

const WindowOverlay = (props: Props) => {
  const window = useWindowDimensions();
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: window.width,
        height: window.height,
      }}
    >
      {props.children}
    </View>
  );
};
export default React.memo(WindowOverlay);