import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import axios from "axios";
import {alphaVantage_ApiKey, db} from '../assets/config/config';
import {navigationRef} from "../navigation/RootNavigation";
import {LineChart,} from "react-native-chart-kit";
import {onValue, ref, set, get, update, child} from "firebase/database";
import conVar from '../constants/constants';


export class Details extends Component{
    constructor(props) {
        super(props);
        const {item} = this.props.route.params;
        this.fetchRealPrice();
        this.fetchWeeklyPrice();
        this.state = {
            weeksPrice: [],
            lastRefresh:'',
            realtimePrice:0,
            isShowWeekly:false,
            symbol:item.symbol,
        };
    }


    toggleSwitchWk = (bool)=>{
        this.setState({isShowWeekly:bool})
    }

    fetchWeeklyPrice = async ()=>{
        const {item} = this.props.route.params;
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${item.symbol}&apikey=${alphaVantage_ApiKey}`
        try{
            const data = await axios.get(url)
                .then((response) =>{
                    if(response.status === 200){
                        const weeks = response.data['Weekly Time Series'];
                        let idx = 0;
                        // const tmpArr = [];
                        Object.keys(weeks).forEach((key) =>{
                            if(idx < 6){
                                this.state.weeksPrice.push(parseFloat(weeks[key]['4. close']))
                                idx++;
                            }
                        })
                        // console.log(this.state.weeksPrice)
                    }
                })
        }catch (error) {
            console.log(error)
        }

    }

    fetchRealPrice = async () =>{
        const {item} = this.props.route.params;
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${item.symbol}&interval=60min&apikey=${alphaVantage_ApiKey}`
        try{
            const data = await axios.get(url)
                .then((response) =>{
                    if(response.status === 200){
                        this.setState({
                            lastRefresh: response.data['Meta Data']['3. Last Refreshed'],
                        })
                        this.setState({
                            realtimePrice: response.data['Time Series (60min)'][this.state.lastRefresh]['4. close']
                        })
                    }
            })
        }catch (error) {
            console.log(error)
        }
    }

    preAdd = async()=>{
        const {item} = this.props.route.params;
        const dbRef = ref(db);
        get(child(dbRef, `portfolio/${conVar.user}`)).then(async (snapshot) => {
            if (snapshot.exists()) {
                let oldArr = snapshot.val().symbols
                const newArr = []
                oldArr.forEach((value)=>{
                    newArr.push(value)
                })
                newArr.push(item.symbol)
                await set(ref(db, 'portfolio/' + conVar.user), {
                    phone: conVar.user,
                    symbols: newArr,
                }).then((response) => (
                    Alert.alert("Add To WatchList Successfully")
                )).catch((err) => {
                    Alert.alert(err)
                })
            } else {
                // console.log("No data available");
                await this.addNewToPortfolio()
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    addNewToPortfolio = async ()=>{
        const {item} = this.props.route.params;
        await set(ref(db, 'portfolio/' + conVar.user), {
            phone: conVar.user,
            symbols:[
                item.symbol,
            ],
        }).then((response) => (
            Alert.alert("Add To WatchList Successfully")
        )).catch((err) => {
                Alert.alert(err)
            })
    };

    render(){
        const {item} = this.props.route.params;
        // console.log(item)
        // console.log("++++" + item.name); //name
        // item.symbol //symbol

        return(
        <SafeAreaView style={styles.container}>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <View style={styles.titleView}>
                    <TouchableOpacity
                        onPress={()=>navigationRef.goBack()}
                    >
                        <Image
                            style={styles.backImage}
                            source={require('../assets/imgs/shangyibu.png')}
                        />
                    </TouchableOpacity>

                    <Text style={styles.titleName}>
                        Detail of Financial Instrument
                    </Text>
                </View>

                <View style={styles.cutLine}/>

                <View
                    // style={{backgroundColor:'#EEDFCC', opacity: 0.8}}
                    style={{alignItems:'center',alignContent:'center', }}
                >
                    <ImageBackground
                        source={require('../assets/imgs/bg_symbol.png')}
                        style={{opacity: 1, height:240, flex:1, width:Dimensions.get("window").width,}}
                    >
                    {/*Company Title and Name*/}
                    <Text style={styles.symbolTextStyle}>
                        {item.symbol} :
                    </Text>
                    <Text style={styles.nameTextStyle}>
                        {item.name}
                    </Text>

                    {/*Real time price*/}
                    <View style={[styles.titleView, {marginBottom:10}]}>
                        <Image
                            style={[styles.backImage, {marginLeft:45, height: 35, width: 30}]}
                            source={require('../assets/imgs/realtime_price.png')}
                        />
                        <Text style={[styles.titleName, {fontSize:20, marginLeft:10, color:'#3c5f7b',}]}>
                            Realtime Price:   {this.state.realtimePrice}
                        </Text>
                    </View>
                    </ImageBackground>
                </View>

                {/*<View style={styles.cutLine}/>*/}

                {/*history price*/}
                <View style={{flex:1, paddingTop:5}}>
                    <Image
                        source={require('../assets/imgs/statistic_picture.png')}
                        style={{
                            width:Dimensions.get("window").width,
                            height:200,
                        }}
                    >
                    </Image>
                    <Text
                        style={{paddingHorizontal:14, fontSize:16, color:'#CD8500', paddingTop:5}}
                    >
                        Toggle the switch on the right to see the historical price of this stock for the past five weeks.
                    </Text>
                    <Switch
                        style={styles.switchStyle}
                        trackColor={{ false: "#767577", true: "#63B8FF" }}
                        thumbColor={"#CD8500"}
                        onValueChange = {this.toggleSwitchWk}
                        value= {this.state.isShowWeekly}
                    />
                    {this.state.isShowWeekly ? (
                        <LineChart
                            fromZero={false}
                            withInnerLines={true}
                            data={{
                                labels: ["This Week", "1W-ago", "2Ws-ago", "3Ws-ago", "4Ws-ago", "5Ws-ago"],
                                datasets: [
                                    {
                                        data: this.state.weeksPrice,
                                        color: (opacity = 1) => `rgba(139, 76, 57, ${opacity})`, // optional
                                        strokeWidth: 2 // optional
                                    }
                                ],
                                legend: ["Price"] // optional
                            }}
                            width={Dimensions.get("window").width}
                            height={300}
                            chartConfig={{
                                backgroundGradientFrom: "#E8F4FF",
                                backgroundGradientFromOpacity: 0,
                                backgroundGradientTo: "#69B5FF",
                                backgroundGradientToOpacity: 0.5,
                                color: (opacity = 1) => `rgba(35, 0, 0, ${opacity})`,
                                strokeWidth: 2, // optional, default 3
                                barPercentage: 0.8,
                                useShadowColorFromDataset: false // optional
                            }}
                            bezier
                            style={{flex:1, paddingTop:5}}
                        />
                    ):(
                        <View style={{flex:1, flexDirection:'row'}}>

                            <Text style={{paddingLeft:20, fontSize:14, fontStyle:'italic'}}>
                                Click on the switch {'\n'}and the Line Chart will appear here.
                            </Text>
                            <Image
                                style={styles.backImage}
                                source={require('../assets/imgs/money.png')}
                            />
                        </View>

                    )}
                </View>

                <View style={styles.cutLine}/>


                <TouchableOpacity
                    style={[styles.viewNewsButton, {backgroundColor: '#F4A460'}]}
                    // onPress={()=>{this.preAdd().then(r => (console.log("note: "+r)))}}
                    onPress={()=>{this.preAdd()}}
                >
                    <Text style={{flex:1, color:'#363636',fontSize:19}}>
                        Add To Portfolio
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.viewNewsButton}
                    onPress={()=>{
                        this.props.navigation.push('News', {
                            symbol: item.symbol,
                        });
                    }}
                >
                    <Text style={{flex:1, color:'#363636',fontSize:19}}>
                        View News
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
        );
    }
}

const styles=StyleSheet.create({
    container:{
        flex: 1,
        alignItems:'flex-start',
        // paddingTop:10,
        // paddingLeft:10,
        // marginTop:8,
        flexDirection:'column',
    },
    containerList:{
        paddingLeft:5,
        paddingTop:8,
        paddingBottom:8,
        flex:1,
    },
    textArea:{
        length:100,
        width: 380,
        backgroundColor: "#5A795A",
        paddingLeft: 8,
        flexGrow:1,
        borderRadius:7,
    },
    titleView:{
        flex:1,
        flexDirection:'row',
    },
    backImage:{
        height:25,
        width:25,
        marginLeft:10,
        marginTop:14,
    },
    titleName:{
        marginLeft:20,
        marginTop:18,
        fontSize:22,
        fontWeight:'bold',
        color:'black',
    },
    nameTextStyle:{
        textAlign:'center',
        fontSize:18,
        // color:'#000C58',
        color:'#4F4F4F',
        paddingTop:10,
        // fontStyle:'italic',
        fontWeight:'bold',
        paddingHorizontal:8,
    },
    symbolTextStyle:{
        textAlign:'center',
        fontSize:24,
        color:'black',
        paddingTop:20,
        fontStyle:'italic',
        fontWeight:'bold',
    },
    cutLine:{
        height:1,
        width: Dimensions.get("window").width,
        backgroundColor:'#828282',
        // marginTop:8,
    },
    switchStyle:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
    },
    separatorComponent:{
        height:2,
        // width:"100%",
        width:Dimensions.get("window").width,
        backgroundColor:'green',
    },
    viewNewsButton: {
        backgroundColor: '#DEB887',
        padding: 10,
        alignItems:'center',
        margin: 15,
        height: 50,
        borderRadius:10,
    },

})

