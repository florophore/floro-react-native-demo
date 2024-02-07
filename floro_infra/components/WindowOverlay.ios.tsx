import React from 'react';
import { FullWindowOverlay } from "react-native-screens";

interface Props {
  children: React.ReactElement;
}

const WindowOverlay = (props: Props) => {
  return <FullWindowOverlay>{props.children}</FullWindowOverlay>;
};
export default React.memo(WindowOverlay);
