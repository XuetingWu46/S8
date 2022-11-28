import React from 'react';
import {ImageBackground, Text, View, StyleSheet, TextInput,
    TouchableOpacity, Alert} from "react-native";
import {onValue, ref, set} from "firebase/database";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {signInWithPhoneNumber } from "firebase/auth";
import { getAuth, signInWithPhoneNumber} from "firebase/auth";

// ------------
// import auth from '@react-native-firebase/auth';
// import {db} from '../assets/config/config';

import {db, auth} from '../assets/config/config';
import {navigationRef} from "../navigation/RootNavigation";

const appVerifier = window.recaptchaVerifier;
// const auth = getAuth();

export class Login extends React.Component{

    constructor(props) {
        super(props);
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

    navigateToRegister = ()=>{
        this.props.navigation.replace('Register');
    }

    navigateToMain = ()=>{
        navigationRef.reset({
            index: 1,
            routes: [{ name: 'Main' }],
        });
    }

    checkIsExisted = async()=>{
        const starCountRef = await ref(db, 'users/' + this.state.phone);
        let isExisted = null;
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            isExisted = data;
        });
        // console.log(isExisted == null)
        if(isExisted == null){
            Alert.alert("Account is not existed, please register.")
            this.navigateToRegister();
        }
    }

    addNewAccount = async ()=>{
        await set(ref(db, 'users/' + this.state.phone), {
            phone: this.state.phone,
        }).then((response) => (
            Alert.alert("Add account OK")
        ))
            .catch((err) => {
                Alert.alert(err)
            })
    };

    fakeVerify = ()=>{
        if(this.state.otp.length === 0){
            Alert.alert("Empty OTP", "Please enter otp");
        }else{
            // Alert.alert("Login ok");
            this.navigateToMain();
            // this.props.navigation.replace('https://www.benzinga.com/general/entertainment/22/11/29794210/exclusive-darren-rovell-says-espn-should-be-worried-about-streaming-companies-entering-spor');
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
                Alert.alert("Error of SignUp",error);
            }
        }
    }

    confirmOTP = async () =>{
        try {
            await this.state.confirm.confirm(this.state.otp);
            this.onConfirmChange(null);
            alert("confirm ok!!!");
            await this.addNewAccount();
        } catch (error) {
            // console.log('Invalid OTP.');
            Alert.alert("Error of Confirm",error);
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <ImageBackground
                    style={styles.background}
                    source={require('../assets/imgs/bg_login.png')}
                >
                    <Text style={styles.registerFont}>
                        Login
                    </Text>
                    <View style={styles.registerContainer}>
                        <View style={styles.rowBlockStyle}>
                            <MaterialCommunityIcons style={styles.iconStyle} name='cellphone' size={40} color="#00868B"/>
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
                            // onPress={this.addNewAccount}
                            onPress={this.checkIsExisted}
                        >
                            <Text style={styles.textOnTouch}> Get OTP</Text>
                        </TouchableOpacity>

                        <View style={styles.rowBlockStyle}>
                            <MaterialCommunityIcons style={styles.iconStyle} name='key' size={40} color="#00868B"/>
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
                            <Text style={styles.textOnTouch}> Log In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            // onPress={}
                            style={{borderBottomColor:'black', borderBottomWidth:1, alignSelf:'center',}}
                        >
                            <Text
                                style={[styles.textOnTouch, {color: 'black', fontStyle: 'italic', paddingTop: 50, fontSize: 20}]}
                                onPress={this.navigateToRegister}
                            >
                                I am a new user
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
        color:'black',
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
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
        backgroundColor:'#528B8B',
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
