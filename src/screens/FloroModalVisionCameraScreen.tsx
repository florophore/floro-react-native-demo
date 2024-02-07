import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Linking,
  Switch,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUseStyles, useThemeColor } from "../helpers/styleshook";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  Camera,
  CameraPermissionStatus,
  Code,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { AppState, AppStateStatus } from "react-native";
import { useFloroConnection } from "../../floro_infra/contexts/FloroConnectionProvider";
import { useFloroDebug } from "../../floro_infra/contexts/FloroDebugProvider";
import { usePlainText, useRichText } from "../../floro_infra/hooks/text";

export const useIsForeground = (): boolean => {
  const [isForeground, setIsForeground] = useState(true);

  useEffect(() => {
    const onChange = (state: AppStateStatus): void => {
      setIsForeground(state === "active");
    };
    const listener = AppState.addEventListener("change", onChange);
    return () => listener.remove();
  }, [setIsForeground]);

  return isForeground;
};

const useStyles = createUseStyles(({ background }) => ({
  background: {
    backgroundColor: background,
    height: "100%",
    width: "100%",
  },
  main: {
    height: "100%",
    width: "100%",
  },
}));

const FloroModalVisionCameraScreen = () => {
  const {
    connectionInfo,
    setConnectionInfo,
    isConnected,
    checkingRepo,
    repoExists,
    disconnect,
  } = useFloroConnection();
  const { width } = useWindowDimensions();
  const { isDebugMode, isEditMode, setIsDebugMode, setIsEditMode } =
    useFloroDebug();
  const toggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode);
  }, [isEditMode]);
  const toggleDebugMode = useCallback(() => {
    setIsDebugMode(!isDebugMode);
  }, [isDebugMode]);
  const styles = useStyles();
  const device = useCameraDevice("back");
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;
  const navigation = useNavigation();
  const purple = useThemeColor("purple-theme");
  const disabledBackgroundColor = useThemeColor("contrast-gray");
  const onCodeScanned = useCallback(
    (codes: Code[]) => {
      const value = codes[0]?.value;
      if (typeof value != "string") {
        return;
      }
      try {
        const rawObject = JSON.parse(value);
        if (rawObject.apiKey && rawObject.ipAddr && rawObject.tlsPort) {
          setConnectionInfo(rawObject);
        }
      } catch (e) {}
    },
    [setConnectionInfo]
  );
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: onCodeScanned,
  });

  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");

  const requestCameraPermission = useCallback(async () => {
    if (cameraPermissionStatus == "granted") {
      return;
    }
    const permission = await Camera.requestCameraPermission();
    if (permission === "denied") await Linking.openSettings();
    setCameraPermissionStatus(permission);
  }, [cameraPermissionStatus]);

  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  const contrastText = useThemeColor("contrast-text");

  const FloroConnectedText = useRichText("debug_modal.floro_connected_title");
  const RepoNotFoundText = useRichText("debug_modal.repo_not_found");
  const ConnectingText = useRichText("debug_modal.connecting");
  const EditModeText = useRichText("debug_modal.edit_mode");
  const DebugModeText = useRichText("debug_modal.debug_mode");
  const DebugSetupInstructionsText = useRichText("debug_modal.debug_setup_instructions");

  const cancelPlainText = usePlainText("debug_modal.cancel");
  const disconnectPlainText = usePlainText("debug_modal.disconnect");
  const grantCameraPermissionPlainText = usePlainText(
    "debug_modal.grant_camera_permission"
  );

  const onCancel = useCallback(() => {
    setConnectionInfo(null);
    navigation.goBack();
  }, []);

  if (isConnected && !checkingRepo && repoExists) {
    return (
      <SafeAreaView style={styles.background}>
        <View style={styles.main}>
          <View
            style={{
              padding: 24,
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 24, paddingBottom: 24, textAlign: "center" }}
            >
              <FloroConnectedText
                richTextOptions={{
                  color: contrastText,
                  fontSize: 24,
                  textStyles: {
                    textAlign: "center",
                  },
                }}
              />
            </Text>
            <View
              style={{
                marginTop: 24,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 18 }}>
                <EditModeText
                  richTextOptions={{
                    color: contrastText,
                    fontSize: 18,
                  }}
                />
              </Text>
              <Switch
                ios_backgroundColor={disabledBackgroundColor}
                trackColor={{
                  true: purple,
                  false: disabledBackgroundColor,
                }}
                onValueChange={toggleEditMode}
                value={isEditMode}
              />
            </View>
            {isEditMode && (
              <View
                style={{
                  marginTop: 24,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text style={{ fontSize: 18 }}>
                  <DebugModeText
                    richTextOptions={{
                      color: contrastText,
                      fontSize: 18,
                    }}
                  />
                </Text>
                <Switch
                  ios_backgroundColor={disabledBackgroundColor}
                  trackColor={{
                    true: purple,
                    false: disabledBackgroundColor,
                  }}
                  onValueChange={toggleDebugMode}
                  value={isDebugMode}
                />
              </View>
            )}
            <View
              style={{
                marginTop: 48,
              }}
            >
              <Button title={disconnectPlainText} onPress={disconnect} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (isConnected && !checkingRepo && !repoExists) {
    return (
      <SafeAreaView style={styles.background}>
        <View style={styles.main}>
          <View
            style={{
              padding: 24,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 24, textAlign: "center" }}>
              <RepoNotFoundText
                richTextOptions={{
                  color: contrastText,
                  fontSize: 24,
                }}
              />
            </Text>
          </View>
          <Button title={cancelPlainText} onPress={onCancel} />
        </View>
      </SafeAreaView>
    );
  }

  if (connectionInfo && (!isConnected || checkingRepo)) {
    return (
      <SafeAreaView style={styles.background}>
        <View>
          <View
            style={{
              padding: 24,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 24, textAlign: "center" }}>
              <ConnectingText
                richTextOptions={{
                  color: contrastText,
                  fontSize: 24,
                }}
              />
            </Text>
          </View>
          <Button title={cancelPlainText} onPress={onCancel} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.main}>
        <>
          {cameraPermissionStatus !== "granted" && (
            <View>
              <Button
                onPress={requestCameraPermission}
                title={grantCameraPermissionPlainText}
              />
            </View>
          )}
          {cameraPermissionStatus === "granted" && (
            <>
              {device != null && (
                <Camera
                  style={{
                    width: StyleSheet.absoluteFill,
                    height: "50%",
                  }}
                  device={device}
                  isActive={isActive}
                  codeScanner={codeScanner}
                  torch={"off"}
                  enableZoomGesture={false}
                />
              )}
              <View
                style={{
                  flexGrow: 1,
                  alignItems: "center",
                  alignSelf: "center",
                  paddingTop: 24,
                  alignContent: "center",
                  width: '100%',
                }}
              >
                {!connectionInfo && (
                  <DebugSetupInstructionsText
                    textStyles={{ textAlign: "center" }}
                    viewProps={{ style: {width: '100%', paddingHorizontal: 24} }}
                    richTextOptions={{
                      color: contrastText,
                      fontSize: 18,
                    }}
                  />
                )}
              </View>
            </>
          )}
        </>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(FloroModalVisionCameraScreen);
