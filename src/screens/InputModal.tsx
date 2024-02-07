import React from 'react';
import { View, Text} from 'react-native';
import {createUseStyles} from '../helpers/styleshook';
import { PortalHost } from '@gorhom/portal';


const InputModal = () => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>
          <PortalHost name="InputModalHost:Title" />
        </Text>
      </View>
      <View style={{width: '100%', flexGrow: 1, padding: 24}}>
        <PortalHost name="InputModalHost:Content" />
      </View>
    </View>
  );
};

const useStyles = createUseStyles(({background, themeColor}) => {
  return {
    container: {
      backgroundColor: background,
      height: '100%',
      width: '100%',
    },
    titleWrapper: {
      paddingTop: 24,
      textAlign: 'center',
      alignContent: 'center',
      width: '100%'
    },
    title: {
      color: themeColor('contrast-text'),
      textAlign: 'center',
      fontFamily: 'MavenPro_Regular400',
      fontSize: 30
    },
  };
});

export default React.memo(InputModal);
