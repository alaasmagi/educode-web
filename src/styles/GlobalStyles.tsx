import { StyleSheet, Platform, StatusBar } from "react-native";

export default StyleSheet.create({
        anrdoidSafeArea: {
        flex: 1,
        backgroundColor: '#2B2B2B',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
})