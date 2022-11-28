import React, {Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert, FlatList, Linking, Image, Dimensions,
    SectionList,
} from 'react-native';
import conVar from '../constants/constants';
import {child, get, ref, set} from "firebase/database";
import {db} from "../assets/config/config";
import {RefreshControl} from "react-native-gesture-handler";
import {navigationRef} from "../navigation/RootNavigation";
import { Picker } from '@react-native-picker/picker';

function showNothing(params) {
    return(
        <View>
            <Text>
                Empty WatchList
            </Text>
        </View>
    );
}



export class Portfolio extends Component{
    constructor(props){
        super(props);
        // let DL = this.fetchSymbols()
        this.fetchSymbols();
        this.state={
            symbolsList:[],
            symbolClearList:[],
            isLoading:false,
            isLoadOk:false,
            targetDelete:'',
        };
        this.getSymbolsInfo.bind(this);
    }

    getSymbolsInfo = () => {
        this.setState({
            symbolsList:[]
        })
        this.fetchSymbols();
        this.setState({
            isLoading:true,
        });
    }

    // showNothing = () =>{
    //     return(
    //         <view>
    //
    //
    //         <Text>
    //             Empty WatchList
    //         </Text>
    //         </view>
    //     );
    // }

    fetchSymbols = async () =>{
        const dbRef = ref(db);
        get(child(dbRef, `portfolio/${conVar.user}`)).then(async (snapshot) => {
            if (snapshot.exists()) {
                const arr = snapshot.val().symbols;
                if(typeof arr === 'undefined'){
                    showNothing();
                }else{
                    arr.forEach((value)=>{
                        this.state.symbolsList.push(
                            {symbol:value},
                        )
                        this.state.symbolClearList.push(
                            value
                        )
                    })
                }
            } else {
                showNothing();
            }
        }).then(resp => {
            this.setState({
                isLoadOk:true,
                isLoading:false,
            })
        }).catch((error) => {
            console.error(error);
        });
    }


    // deleteSymbol = async (targetSymbol) => {
    //     let oldArr = this.state.symbolsList;
    //     const newArr = [];
    //     Object.keys(oldArr).forEach((key) => {
    //         const isSame = oldArr[key].localeCompare(targetSymbol)
    //         if (!isSame) {
    //             newArr.push(oldArr[key])
    //         }
    //     })
    //     this.setState({
    //         symbolsList: []
    //     })
    //     await set(ref(db, 'portfolio/' + conVar.user), {
    //         phone: conVar.user,
    //         symbols: newArr,
    //     }).then((response) => (
    //         Alert.alert("Delete Successfully")
    //     )).catch((err) => {
    //         Alert.alert(err)
    //     })
    //     await this.fetchSymbols()
    // }


    renderListView(data){
        const symbol = data.item.symbol
        return(
            <TouchableOpacity
                onPress={()=>{
                    this.props.navigation.push('Manage', {
                        curSymbol: data.item.symbol,
                        symbolList: this.state.symbolClearList
                    });
                }}
            >
                <View style={{
                    flex:1,
                    paddingHorizontal:10,
                    paddingVertical:8,
                    backgroundColor:'rgba(255 , 250, 250, 0.5)',
                }}>
                    <View style={{flex:1, flexDirection:'row', justifyContent:'center', }}>
                        <View style={{
                            // flex:1,
                            flexDirection:'row',
                            borderRadius:10,
                            backgroundColor:'#EEDFCC',
                            height:60,
                            width:280,
                            borderColor:'rgba(67,110,238,0.4)', borderWidth:2, borderStyle:'dashed',
                        }}>
                            <Image
                                source={require("../assets/imgs/shoucang.png")}
                                style={{width:32, height:32,marginLeft:10, marginRight:20, alignSelf:'center',}}
                            />

                            <Text style={{
                                fontSize:20,
                                color: '#363636',
                                paddingTop:2,
                                fontWeight:'bold',
                                textAlign:'center',
                                alignContent:'center',
                                alignItems:'center',
                                alignSelf:'center',
                                paddingLeft:50,
                                justifyContent:'center'
                            }}>
                                {symbol}
                            </Text>
                        </View>

                            {/*<TouchableOpacity*/}
                            {/*    style={{backgroundColor:'#696969', height:60, width:80, borderRadius:18, borderStyle:'dashed',*/}
                            {/*        borderColor:'snow'*/}
                            {/*    }}*/}
                            {/*    // onPress={async () => {*/}
                            {/*    //     let oldArr = this.state.symbolsList;*/}
                            {/*    //     const newArr = [];*/}
                            {/*    //     this.state.symbolClearList.forEach((value)=>{*/}
                            {/*    //         if(value.localeCompare(symbol) === -1){*/}
                            {/*    //             newArr.push(value)*/}
                            {/*    //         }*/}
                            {/*    //     })*/}
                            {/*    //     this.setState({*/}
                            {/*    //         symbolsList: [],*/}
                            {/*    //         symbolClearList:[],*/}
                            {/*    //     })*/}
                            {/*    //     await set(ref(db, 'portfolio/' + conVar.user), {*/}
                            {/*    //         phone: conVar.user,*/}
                            {/*    //         symbols: newArr,*/}
                            {/*    //     }).then((response) => (*/}
                            {/*    //         Alert.alert("Delete Successfully")*/}
                            {/*    //     )).catch((err) => {*/}
                            {/*    //         Alert.alert(err)*/}
                            {/*    //     })*/}
                            {/*    //     await this.fetchSymbols()*/}
                            {/*    // }}*/}
                            {/*>*/}
                            {/*    <Text style={{color:'#FF6347', paddingTop:18,paddingLeft:10, fontSize:17}}>*/}
                            {/*        Remove*/}
                            {/*    </Text>*/}
                            {/*    */}
                            {/*</TouchableOpacity>*/}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }


    render(){
        return(
            <SafeAreaView style={styles.container}>
            <View style={{flex:1}}>
                <Image
                    style={styles.picture}
                    source={require('../assets/imgs/portfolio_picture.png')}
                />

                <Text style={styles.title}>
                    My WatchList
                </Text>

                <TouchableOpacity
                    onPress={()=>{
                        this.setState({
                            symbolsList:[],
                            symbolClearList:[],
                        })
                        this.fetchSymbols()
                    }}
                    style={{width:50, height:50, backgroundColor:'rgba(67,110,238,0.4)',
                        alignItems:'center', alignSelf:'center', marginBottom:30,
                        borderRadius:8
                    }}
                >
                    <Image
                        source={require('../assets/imgs/shuaxin.png')}
                        style={{width:40, height:40, alignItems:'center', alignSelf:'center',
                            alignContent:'center', marginTop:6}}
                    />
                </TouchableOpacity>

                {this.state.isLoadOk ? (
                    <FlatList
                        data={this.state.symbolsList}
                        renderItem={data => this.renderListView(data)}
                        ItemSeparatorComponent = {()=>{
                            return(<View style={styles.separatorComponent}/>);
                        }}
                        refreshControl={
                            <RefreshControl
                                title='Loading...'
                                colors={['chocolate']}
                                refreshing={this.state.isLoading}
                                onRefresh={this.getSymbolsInfo.bind(this)}
                                tintColor={'orange'}
                            />
                        }
                    />
                ):(
                    <Text
                        style={{fontSize:20, paddingLeft:30, paddingTop:10}}
                    >
                        Refreshing....
                    </Text>
                )}

            </View>
            </SafeAreaView>

        );
    }
}

const styles=StyleSheet.create({
    separatorComponent:{
        height:5,
        width:"100%",
        // backgroundColor:'#F4A460',
        backgroundColor:'snow',
    },
    picture: {
        width: Dimensions.get("window").width,
        height:280,
    },
    title:{
        fontSize:24,
        fontWeight:'bold',
        color:'black',
        textAlign:'center',
        paddingTop:30,
        paddingBottom:10,
    },
    container:{
        flex:1
    },
})