import React, { useState, useEffect, useCallback} from 'react';
import NavigationProps from '../../types'
import { SafeAreaView, StyleSheet, View, Alert, BackHandler, Keyboard} from 'react-native';
import globalStyles from '../styles/GlobalStyles';
import SeparatorLine from '../components/SeparatorLine';
import TextBox from '../components/TextBox';
import { useTranslation } from 'react-i18next';
import NormalButton from '../components/NormalButton';
import KeyboardVisibilityHandler from '../../hooks/KeyboardVisibilityHandler';
import BackButtonHandler from '../../hooks/BackButtonHandler';
import NormalHeader from '../layout/NormalHeader'
import { DeleteOfflineUserData, SaveOfflineUserData } from '../businesslogic/UserDataOffline';
import { DeleteUser } from '../businesslogic/UserDataOnline';
import { useFocusEffect } from "@react-navigation/native";
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { RegexFilters } from '../helpers/RegexFilters';


function SettingsView({navigation, route}: NavigationProps) {
    const { t } = useTranslation();
    const {localData} = route.params;
    const [isOfflineOnly, setIsOfflineOnly] = useState(false);
    const [confirmationText, setConfirmationText] = useState<string|null>(null);
    const [newStudentCode, setNewStudentCode] = useState('');
    const [errorMessage, setErrorMessage] = useState<string|null>(null);
    const [successMessage, setSuccessMessage] = useState<string|null>(null);
    const isKeyboardVisible = KeyboardVisibilityHandler();

    useEffect(() => {
            if (localData.uniId == null) {
                setIsOfflineOnly(true);
            }
        }, [localData.uniId]);


    const handleBackToHome = () => {
        localData.userType == "Student" ? navigation.navigate("StudentMainView", { localData }) :
        navigation.navigate("TeacherMainView", {localData})
    };

    const isStudentCodeValid = () => newStudentCode !== '' || RegexFilters.studentCode.test(newStudentCode);

    const handleDelete = async () => {
        Keyboard.dismiss();
        if(await DeleteUser(localData.uniId)) {
            await DeleteOfflineUserData();
            navigation.navigate("InitialSelectionView");
        } else {
            setErrorMessage(t("account-deletion-error"));
            setTimeout(() => setErrorMessage(null), 3000);
        }
    }
    
    const handleLogout = async () => {
        await DeleteOfflineUserData();
        navigation.navigate("InitialSelectionView");
    }


    const handleStudentCodeChange = async () => {
        Keyboard.dismiss();
        await DeleteOfflineUserData();
        localData.studentCode = newStudentCode;
        await SaveOfflineUserData(localData);
        setNewStudentCode('');
        setSuccessMessage(t("studentcode-change-success"));
        setTimeout(() => setSuccessMessage(null), 3000);
    }

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

    return (
        <SafeAreaView style = {globalStyles.anrdoidSafeArea}>
            <View style={styles.headerContainer}>
                <NormalHeader navigation={navigation} route={route}/>
            </View>
            {!isOfflineOnly && (
                <View style={styles.firstOptionContainer}>
                    {!isKeyboardVisible && (<NormalButton 
                                            text={t('change-password')} 
                                            onPress={() => navigation.navigate("ForgotPasswordView", { isNormalPassChange: true, localData })}/>)}
                </View>
            )}
            <View style={styles.messageContainer}>
            {errorMessage && <ErrorMessage text={errorMessage}/>}
            {successMessage && <SuccessMessage text={successMessage}/>}
            </View>
            {isOfflineOnly && (
                <View style={styles.firstOptionContainer}>
                    <SeparatorLine text={t("offline-mode-settings")}/>
                    <TextBox iconName='person-icon' value={newStudentCode} onChangeText={setNewStudentCode} placeHolder={t("student-code")} autoCapitalize='characters'/>
                    <NormalButton text={t("save-account-changes")} onPress={handleStudentCodeChange} disabled={!isStudentCodeValid()}/>
                </View>
            )}
            {!isOfflineOnly && (<View style={styles.deleteAccount}>
                <SeparatorLine text={t("delete-account")}/>
                <TextBox iconName='person-icon' onChangeText={setConfirmationText} placeHolder={t("type-delete") + " *"}/>
                <NormalButton text={t("delete-account")} disabled={confirmationText !== "DELETE"} onPress={handleDelete}/>
            </View>)}
            <View style={styles.lowButtonContainer}>
            {!isKeyboardVisible && (<NormalButton text={t("back-to-home")} onPress={handleBackToHome}/>)}
            {!isKeyboardVisible && (<NormalButton text={!isOfflineOnly ? t("log-out") : t("delete-account")} 
                                    onPress={handleLogout}/>)}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        justifyContent: 'center',
      },
    firstOptionContainer: {
        flex: 1.5,
        width: "100%",
        gap: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    messageContainer: {
        flex: 1
    },
    deleteAccount: {
        flex: 1.5,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
    },
    lowButtonContainer: {
        flex: 1.5,
        gap: 15,
        justifyContent: "center",
        alignItems: "center",
    }
})

export default SettingsView;