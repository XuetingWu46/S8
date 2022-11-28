import React, { useState } from 'react';
import {Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {navigationRef} from '../navigation/RootNavigation';
import {onValue, ref, set} from "firebase/database";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {signInWithPhoneNumber } from "firebase/auth";
import {signInWithPhoneNumber, RecaptchaVerifier} from "firebase/auth";

import {auth, db} from '../assets/config/config';
import conVar from '../constants/constants';

// window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container',
//     {
//         'size': 'invisible',
//         'callback':(response)=>{
//
//         },
//     }, auth)
const appVerifier = window.recaptchaVerifier;

export class Register extends React.Component{

    constructor(props) {
        super(props);
        // this.verifyCode()
        this.state = {
            phone: '',
            otp: '',
            confirm:null,
        };
    }


    onPhoneChange = (text) => {
        this.setState({
            phone: text,
        });
    };

    onOTPChange = (text) => {
        this.setState({
            otp: text,
        });
    };

    onConfirmChange = (input) =>{
        this.setState({
            confirm:input
        });
    };

    navigateToLogin= ()=>{
        this.props.navigation.replace('Login');
    }

    navigateToMain = ()=>{
        conVar.user = this.state.phone
        navigationRef.reset({
            index: 1,
            routes: [{ name: 'Main' }],
        });
    }

    /**
     * Check if the phone was registered in Firebase realtime database
     * @returns {Promise<void>}
     */
    checkIsExisted = async()=>{
        const starCountRef = await ref(db, 'users/' + this.state.phone);
        let isExisted = null;
        onValue(starCountRef, (snapshot) => {
            isExisted = snapshot.val();
        });
        // console.log(isExisted == null)
        if(isExisted == null){
            await this.addNewAccount()
        }else{
            Alert.alert("Account is existed, please log in.")
            this.navigateToLogin()
        }
    }

    /**
     * Add a new phone to Firebase
     * @returns {Promise<void>}
     */
    addNewAccount = async ()=>{
        await set(ref(db, 'users/' + this.state.phone), {
            phone: this.state.phone,
        }).then((response) => (
            Alert.alert("Add account OK")
        ))
        .catch((err) => {
            Alert.alert(err.message)
        })
    };



    fakeVerify = ()=>{
        if(this.state.otp.length === 0){
            Alert.alert("Empty OTP", "Please enter otp");
        }else{
            Alert.alert("Sign Up ok");
            // this.props.navigation.replace('Main');
            this.navigateToMain();
        }
    }

    // authSignUp = ()=>{
    //     console.log(this.state.phone)
    //     signInWithPhoneNumber(auth, this.state.phone, appVerifier)
    //         .then((confirmationResult) => {
    //             // SMS sent. Prompt user to type the code from the message, then sign the
    //             // user in with confirmationResult.confirm(code).
    //             window.confirmationResult = confirmationResult;
    //             alert("Register new account successfully ");
    //             // ...
    //         }).catch((error) => {
    //         // Error; SMS not sent
    //         // ...
    //     });
    // }
    //
    // authVerify = ()=>{
    //     confirmationResult.confirm(this.state.otp).then((result) => {
    //         // User signed in successfully.
    //         const user = result.user;
    //         // ...
    //     }).catch((error) => {
    //         // User couldn't sign in (bad verification code?)
    //         // ...
    //     });
    // }



    signUp = async () =>{
        console.log(this.state.phone)
        if(this.state.phone.length === 0){
            Alert.alert("Empty Phone",'Please enter phone number');
        }else{
            try {
                // const confirmation = await auth().signInWithPhoneNumber(this.state.phone);
                const confirmation = await signInWithPhoneNumber(auth, this.state.phone, appVerifier);
                console.log(confirmation)
                this.onConfirmChange(confirmation);
                alert("Register new account successfully ");
            } catch (error) {
                Alert.alert("Error of SignUp",error.message);
            }
        }
    }

    confirmOTP = async () =>{
        try {
            await this.state.confirm.confirm(this.state.otp);
            this.onConfirmChange(null);
            alert("confirm ok!!!");
            await this.addNewAccount();
            this.navigateToLogin();
        } catch (error) {
            // console.log('Invalid OTP.');
            Alert.alert("Error of Confirm",error.message);
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <ImageBackground
                    style={styles.background}
                    source={require('../assets/imgs/bg.png')}
                >
                    <Text style={styles.registerFont}>
                        Register
                    </Text>
                    <View style={styles.registerContainer}>
                        <View
                            // id={'recaptcha-container'}
                            style={styles.rowBlockStyle}>
                            <MaterialCommunityIcons style={styles.iconStyle} name='cellphone' size={40} color="#8B4513"/>
                            <TextInput
                                style={styles.inputStyle}
                                placeholder="Your phone number"
                                placeholderTextColor = "#8B7E66"
                                keyboardType = 'phone-pad'
                                returnKeyType = 'done'
                                onChangeText = {this.onPhoneChange}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.touchableStyle}
                            // onPress={this.signUp}
                            onPress={this.checkIsExisted}
                        >
                            <Text style={styles.textOnTouch}> Get OTP</Text>
                        </TouchableOpacity>

                        <View style={styles.rowBlockStyle}>
                            <MaterialCommunityIcons style={styles.iconStyle} name='key' size={40} color="#8B4513"/>
                            <TextInput
                                style={styles.inputStyle}
                                placeholder="OTP"
                                placeholderTextColor = "#8B7E66"
                                keyboardType = 'number-pad'
                                returnKeyType = 'done'
                                onChangeText = {this.onOTPChange}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.touchableStyle}
                            // onPress={this.confirmOTP}
                            onPress={this.fakeVerify}
                        >
                            <Text style={styles.textOnTouch}> Sign Up</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            // onPress={}
                            style={{borderBottomColor:'black', borderBottomWidth:1, alignSelf:'center',}}
                        >
                            <Text
                                style={[styles.textOnTouch, {color: 'black', fontStyle: 'italic', paddingTop: 50, fontSize: 20}]}
                                onPress={this.navigateToLogin}
                            >
                                Already have an account?
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ImageBackground>

            </View>



        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width:400,
    },
    registerFont:{
        textAlign: 'center',
        color:'#FFA54F',
        fontSize: 28,
        paddingTop:34,
        fontWeight:'bold',
        fontFamily:'montserrat-regular',
    },
    container:{
        flex:1,
    },
    registerContainer: {
        // backgroundColor:'white',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        height:520,
        width:360,
        alignSelf:'center',
        marginTop: 20,
        borderRadius: 10,
    },
    iconStyle:{
        paddingTop:10,
        paddingLeft:20,
        paddingBottom:50,
    },
    inputStyle:{
        paddingTop:20,
        paddingBottom:50,
        paddingLeft:15,
        alignItems:'center',
        fontSize:20,
    },
    rowBlockStyle:{
        flexDirection:'row',
        paddingTop:30,
        paddingLeft:5,
    },
    touchableStyle:{
        backgroundColor:'#CD6839',
        width:120,
        height:40,
        alignSelf:'center',
        borderRadius:6,
    },
    textOnTouch:{
        textAlign:'center',
        paddingTop:7,
        color:'white',
        fontSize:16,
    },
});
