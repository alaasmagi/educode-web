import React, { useEffect, useState } from 'react';
import NavigationProps from '../../types'
import { SafeAreaView, StyleSheet, View, TouchableWithoutFeedback, Keyboard} from 'react-native';
import globalStyles from '../styles/GlobalStyles';
import * as Haptics from 'expo-haptics';
import SeparatorLine from '../components/SeparatorLine';
import TextBox from '../components/TextBox';
import QrScanner from '../components/QrScanner';
import { useTranslation } from 'react-i18next';
import NormalHeader from '../layout/NormalHeader';
import NormalButton from '../components/NormalButton';
import StepDivider from '../components/StepDivider';
import Checkbox from '../components/Checkbox';
import NormalLink from '../components/NormalLink';
import { RegexFilters } from '../helpers/RegexFilters';
import ErrorMessage from '../components/ErrorMessage';
import KeyboardVisibilityHandler from '../../hooks/KeyboardVisibilityHandler';
import BackButtonHandler from '../../hooks/BackButtonHandler';


function StudentMainView({ navigation , route }: NavigationProps) {
    const { localData } = route.params;
    const { t } = useTranslation();

    const [scanned, setScanned] = useState(false);

    const { attendanceId: routeAttendanceId } = route.params || {};  
    const [attendanceId, setAttendanceId] = useState(routeAttendanceId || '');

    const { workplaceId: routeWorkplaceId } = route.params || {};  
    const [workplaceId, setWorkplaceId] = useState(routeWorkplaceId || '');

    const [scanForWorkplace, setScanForWorkplace] = useState(false);

    const { stepNr: initialStepNr = 1 } = route.params || {};  
    const [stepNr, setStepNr] = useState(initialStepNr);

    const [showError, setShowError] = useState(false);

    const isKeyboardVisible = KeyboardVisibilityHandler();
    BackButtonHandler(navigation);

    const handleBarcodeScanned = async ({ data }: { data: string }) => {
        if (!scanned) {
            setScanned(true);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            if (RegexFilters.defaultId.test(data)) {
                stepNr == 1 ? setAttendanceId(data) : setWorkplaceId(data);
            }
            else {
                setShowError(true);
            }
            setTimeout(() => setScanned(false), 3000);
            setTimeout(() => setShowError(false), 3000);
        }
    };

    const handleNextStep = () => {
        if (scanForWorkplace == true) {
            setStepNr(2);
            Keyboard.dismiss;
            setScanForWorkplace(false);
        }
        else {
            navigation.navigate("CompleteAttendanceView", { localData, attendanceId, stepNr });
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style = {globalStyles.anrdoidSafeArea}>
                <View style={styles.headerContainer}>
                    <NormalHeader navigation={navigation} route={route}/>
                </View>
                <View style={styles.mainContainer}>
                <View style={styles.stepDividerContainer}>
                    <StepDivider 
                        stepNumber={stepNr} 
                        label={stepNr == 1 ? t("step-scan-board") : t("step-scan-workplace")} />
                </View>
                {!isKeyboardVisible && <View style={styles.qrContainer}>
                    <QrScanner onQrScanned={handleBarcodeScanned}/>
                </View>}
                {stepNr === 1 ? (<View style={styles.attendanceHandlerContainer}>
                    <View style={styles.alternativeMethodContainer}>
                        <SeparatorLine text={t("or-enter-id-manually")}/>
                        <TextBox 
                            iconName='key-icon' 
                            placeHolder={t("attendance-id")} 
                            value={attendanceId} 
                            onChangeText={setAttendanceId}
                        />
                    </View>
                    {showError && (
                        <ErrorMessage text={"ERROR"}/>
                    )}
                    <View style={styles.checkboxContainer}>
                        <Checkbox 
                            label={t("add-workplace")} 
                            onChange={() => setScanForWorkplace(prev => !prev)}
                        />
                    </View>
                    <View style={styles.lowNavButtonContainer}>
                        <NormalButton 
                            text={t("continue")} 
                            onPress={handleNextStep}
                            disabled={!RegexFilters.defaultId.test(attendanceId)}
                        />
                    </View>
                    </View>
                ) : (
                    <View style={styles.workplaceHandlerContainer}>
                        <View style={styles.alternativeMethodContainer}>
                            <SeparatorLine text={t("or-enter-id-manually")}/>
                            <TextBox 
                                iconName='work-icon' 
                                placeHolder={t("workplace-id")} 
                                value={workplaceId} 
                                onChangeText={setWorkplaceId}
                            />
                        </View>
                        <View style={styles.linkContainer}>
                            <NormalLink 
                                text={t("something-wrong-back")} 
                                onPress={() => {setStepNr(1)}}
                            />
                        </View>
                        {showError && (
                            <ErrorMessage text={"ERROR"}/>
                        )}
                        <View style={styles.lowNavButtonContainer}>
                            <NormalButton 
                                text={t("continue")} 
                                onPress={() => navigation.navigate("CompleteAttendanceView", {localData, attendanceId, workplaceId, stepNr })}
                                disabled={!RegexFilters.defaultId.test(workplaceId)}
                            />                                    
                        </View>
                    </View>)}
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    headerContainer:{
        flex: 3,
        justifyContent: "center",
    },
    mainContainer: {
        flex: 14
    },
    stepDividerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    qrContainer: {
        flex: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    alternativeMethodContainer: {
        flex: 2,
        gap: 25,
        alignItems: "center"
    },
    attendanceHandlerContainer: {
        flex: 4
    },
    workplaceHandlerContainer: {
        flex: 4,
    },
    checkboxContainer:{
        flex: 1,
        alignItems: "center"
    },
    lowNavButtonContainer: {
        flex: 2,
        alignItems: "center"
    },
    linkContainer: {
        paddingBottom: 4,
        alignItems: "center",
        justifyContent: "flex-end",
    }
})

export default StudentMainView;