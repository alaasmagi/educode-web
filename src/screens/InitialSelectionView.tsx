import React, {useEffect, useCallback, useState} from 'react';
import NavigationProps from '../../types'
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView, StyleSheet, View, BackHandler, Alert, Keyboard } from 'react-native';
import globalStyles from '../styles/GlobalStyles';
import NormalButton from '../components/NormalButton';
import { useCameraPermissions } from 'expo-camera';
import SeparatorLine from '../components/SeparatorLine';
import TextBox from '../components/TextBox';
import * as SplashScreen from 'expo-splash-screen';
import { useTranslation } from 'react-i18next';
import FormHeader from '../layout/FormHeader';
import BackButtonHandler from '../../hooks/BackButtonHandler';
import LocalUserData from '../models/LocalUserDataModel';
import { GetOfflineUserData, SaveOfflineUserData } from '../businesslogic/UserDataOffline';
import { FetchAndSaveUserDataByUniId } from '../businesslogic/UserDataOnline';
import NormalMessage from '../components/NormalMessage';
import KeyboardVisibilityHandler from '../../hooks/KeyboardVisibilityHandler';
import { RegexFilters } from '../helpers/RegexFilters';


function InitialSelectionView({ navigation }: NavigationProps) {
    const { t } = useTranslation();
    const [studentCode, setStudentCode] = useState('');
    const [normalMessage, setNormalMessage] = useState<string|null>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const isKeyboardVisible = KeyboardVisibilityHandler();

    BackButtonHandler(navigation);
    useFocusEffect(
        useCallback(() => {
          const backAction = () => {
            Alert.alert(t("exit-app"), t("exit-app-prompt"), [
              { text: t("cancel"), onPress: () => null, style: "cancel" },
              { text: t("yes"), onPress: () => BackHandler.exitApp() }
            ]);
            return true;
          };
          const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        },
    []));


    useEffect(() => {
        const fetchUserData = async () => {
            await SplashScreen.preventAutoHideAsync();
            
            let localData: LocalUserData | null = await GetOfflineUserData();
            
            if (localData) {
                if (localData.offlineOnly) {
                    navigation.navigate("StudentMainView", { localData });
                    await SplashScreen.hideAsync();
                    return;
                } 
                
                const loginStatus = await FetchAndSaveUserDataByUniId(localData.uniId!);
                if (loginStatus) {
                    localData = await GetOfflineUserData();
                    if (localData) {
                        localData.userType === "Teacher"
                            ? navigation.navigate("TeacherMainView", { localData })
                            : navigation.navigate("StudentMainView", { localData });
                        await SplashScreen.hideAsync();
                        return;
                    }
                } else {
                    setNormalMessage(t("login-again"));
                    setTimeout(() => setNormalMessage(null), 3000);
                }
            }
            await SplashScreen.hideAsync();
        };
    
        fetchUserData();
    }, []);

    const handleOfflineLogin = async () => {
        Keyboard.dismiss();
        if (!permission?.granted) {
            const response = await requestPermission();
            if (!response.granted) {
                Alert.alert(t("camera-permission-denied"), t("camera-permission-denied-message"));
                return;
            };
        };
        const localData:LocalUserData = {
            userType: "Student",
            studentCode: studentCode,
            offlineOnly: true,
        }
        await SaveOfflineUserData(localData);
        navigation.navigate('StudentMainView', {localData});
      };

    return (
        <SafeAreaView style = {globalStyles.anrdoidSafeArea}>
            <View style={styles.headerContainer}>
                <FormHeader/>
            </View>
            <View style={styles.mainContainer}>
                {!isKeyboardVisible && (
                <View style={styles.mainLoginContainer}>
                    <NormalButton 
                        text={t("log-in")} 
                        onPress={() => navigation.navigate('LoginView')}/>
                    <NormalButton 
                        text={t("register-as-student")} 
                        onPress={() => navigation.navigate('CreateAccountView')}/>
                    {normalMessage && (
                        <NormalMessage text={normalMessage}/>)}
                    </View>)}
                <View style={styles.alternateLoginContainer}>
                    <SeparatorLine text={t("or-use-offline-only")}/>
                    <TextBox 
                        iconName='person-icon' 
                        placeHolder={t("student-code")} 
                        onChangeText={setStudentCode} 
                        value={studentCode} 
                        autoCapitalize='characters'/>
                    <NormalButton 
                        text={t("continue")} 
                        onPress={handleOfflineLogin}
                        disabled={!RegexFilters.studentCode.test(studentCode)}/>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer : {
        flex: 4
    },
    headerContainer:{
        flex: 1.5,
        justifyContent: "flex-end"
    },
    mainLoginContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 2,
        gap: 25
    },
    alternateLoginContainer: {
        flex: 2.1,
        justifyContent:"center",
        alignItems:"center",
        gap: 25
    }
});


export default InitialSelectionView;