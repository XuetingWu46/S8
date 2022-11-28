import React, {Component } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Button, TextInput, TouchableOpacity, Alert, FlatList, Linking, Image, Dimensions,
} from 'react-native';
import conVar from '../constants/constants';
import {child, get, ref, set} from "firebase/database";
import {alphaVantage_ApiKey, db} from "../assets/config/config";
import axios from "axios";


export class Manage extends Component{
    constructor(props){
        super(props);
        this.fetchPrices();
        this.state={
            curPrice:1,
            oldPrice:1,
            change:0,
            showChange:'',
            isCal:false,
        };
    }

    fetchPrices = async () =>{
        const info = this.props.route.params;
        let targetSymbol = info.curSymbol;
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${targetSymbol}&apikey=${alphaVantage_ApiKey}`
        try{
            const data = await axios.get(url)
                .then((response) =>{
                    if(response.status === 200){
                        const daily = response.data['Time Series (Daily)'];
                        let idx = 0;
                        Object.keys(daily).forEach((key) =>{
                            if(idx < 2){
                                if(idx === 0){
                                    this.setState({
                                        curPrice: (parseFloat(daily[key]['4. close']))
                                    })
                                }else if(idx === 1){
                                    this.setState({
                                        oldPrice: (parseFloat(daily[key]['4. close']))
                                    })
                                }
                                idx++;
                            }
                        })
                        let result = ((this.state.curPrice - this.state.oldPrice)/this.state.oldPrice)*100
                        this.setState({
                            change: result.toFixed(2)
                        })
                        this.setState({
                            showChange: this.state.change+'%',
                            isCal:true
                        })
                    }
                })
        }catch (error) {
            console.log(error)
        }
    }

    deleteSymbol = async () => {
        const info = this.props.route.params;
        let targetSymbol = info.curSymbol;
        let oldArr = info.symbolList;

        const newArr = [];
        oldArr.forEach((value)=>{
            const check = value.localeCompare(targetSymbol)
            if(check === 1 || check === -1){
                newArr.push(value)
            }
        })

        await set(ref(db, 'portfolio/' + conVar.user), {
            phone: conVar.user,
            symbols: newArr,
        }).then((response) => (
            Alert.alert("Delete Successfully")
        )).catch((err) => {
            Alert.alert(err)
        })
    }


    render(){
        const info = this.props.route.params;
        let targetSymbol = info.curSymbol;
        return(
            <View style={{flex:1}}>

                <Text style={styles.title}>
                    losses or gains
                </Text>

                <Image
                    source={require("../assets/imgs/manage.png")}
                    style={styles.picture}
                />

                {this.state.isCal ? (
                    <View style={{flex:1, flexDirection:'row'}}>
                        <View style={{flex:1, backgroundColor:'rgba(255,228,225,0.8)', borderWidth:2,
                            borderColor:'rgba(139,71,93,0.6)', borderRadius:30, height:160, marginLeft:10,
                            marginRight:10, marginTop:10,
                        }}>
                            <Text style={{textAlign:'center', fontSize:25, color:'black', fontWeight:'bold', paddingTop:30,
                            fontStyle:'italic'}}>
                                {targetSymbol}
                            </Text>
                            <Text style={{textAlign:'center', fontSize:19, color:'#8B5F65', fontWeight:'bold', paddingTop:8,
                                }}>
                                current Price: ${this.state.curPrice}
                            </Text>

                        </View>

                        <View style={{flex:1, backgroundColor:'rgba(232,232,232,1)', borderWidth:4, borderStyle:'dashed',
                            borderColor:'rgba(230,230,250,1)', marginLeft:20, marginRight:10, marginTop:100, height:100,
                            borderRadius:5, shadowColor: '#171717',
                            shadowOffset: {width: 8, height: 12}, shadowOpacity: 0.8, shadowRadius: 4, elevation: 40,}}>
                            {this.state.change < 0 ? (
                                <Text style={{color:'#CD5C5C', textAlign:'center', fontSize:24,
                                    fontWeight:'bold', paddingTop:30}}>
                                    {this.state.showChange}
                                </Text>
                            ):(
                                <Text style={{color:'#2E8B57', textAlign:'center', fontSize:24,
                                    fontWeight:'bold', paddingTop:30}}>
                                    +{this.state.showChange}
                                </Text>
                            )}

                            {/*<Text style={{textAlign:'center', fontSize:19, color:'#363636', fontWeight:'bold', paddingTop:8}}>*/}
                            {/*    Price Change $: {(this.state.curPrice - this.state.oldPrice).toFixed(2)}*/}
                            {/*</Text>*/}
                        </View>

                    </View>

                ):(
                    <Text style={{textAlign:'center', fontSize:22, color:"#363636", paddingLeft:20}}>
                        Waiting...
                    </Text>
                )}


                <TouchableOpacity
                    style={[styles.viewNewsButton]}
                    onPress={()=>{this.deleteSymbol()}}
                >
                    <Text style={{flex:1, color:'snow',fontSize:19}}>
                        Delete This Instrument
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

}

const styles=StyleSheet.create({
    viewNewsButton: {
        // backgroundColor: '#CDB5CD',
        backgroundColor: '#363636',
        padding: 10,
        alignItems:'center',
        margin: 15,
        height: 50,
        borderRadius:10,
    },
    picture: {
        width: Dimensions.get("window").width,
        height:260,
    },
    title:{
        fontSize:28,
        fontWeight:'bold',
        color:'black',
        textAlign:'center',
        paddingTop:30,
        paddingBottom:10,
    },

})