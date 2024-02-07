import React, {useCallback, useRef, useState} from 'react';
import {
  Keyboard,
  Text,
  TextInput,
  TextInputProps,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Portal} from '@gorhom/portal';
import {useNavigation} from '@react-navigation/native';

export const useInputModal = (
  props: Partial<TextInputProps>,
  title: string,
) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<TextInput>(null);
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    setIsOpen(true);
    navigation.navigate('InputModal' as never);
  }, []);

  const onBlur = useCallback(() => {
    navigation.getParent()?.goBack();
    setIsOpen(false);
  }, []);

  return (
    <>
      {isOpen && (
        <>
          <Portal hostName="InputModalHost:Title">
            {isOpen && <Text>{title}</Text>}
          </Portal>
          <Portal hostName="InputModalHost:Content">
            {isOpen && (
              <View>
                <TextInput
                  ref={ref}
                  {...props}
                  autoFocus
                  onSubmitEditing={Keyboard.dismiss}
                  onBlur={onBlur}
                />
              </View>
            )}
          </Portal>
        </>
      )}
      <TouchableWithoutFeedback onPress={onPress}>
        <View>
          <View pointerEvents="none" style={{width: '100%'}}>
            <TextInput {...props} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};
