import React, {Component, useCallback} from 'react';

import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity, Button, Image, Dimensions, Linking, Alert
} from 'react-native';
import {RefreshControl} from "react-native-gesture-handler";
import axios from "axios";
import {alphaVantage_ApiKey} from '../assets/config/config';

export class News extends Component{
    constructor(props){
        super(props);
        this.fetchNews();
        this.state={
            symbol:'',
            newsList:[],
            isLoading:false,
            isRefreshing:false,
        };
        this.getNewsInfo.bind(this)

    }

    getNewsInfo = () => {
        this.fetchNews();
        this.setState({
            isRefreshing:true,
        });
    }

    fetchNews = async ()=>{
        const curSymbol = this.props.route.params.symbol;
        const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${curSymbol}&limit=2&apikey=${alphaVantage_ApiKey}`
        try{
            const data = await axios.get(url)
                .then((response) =>{
                    if(response.status === 200){
                        const feeds = response.data['feed'];

                        let idx = 0;
                        feeds.forEach(() =>{
                            let jsonObject = {
                                title : feeds[idx]['title'],
                                url : feeds[idx]['url'],
                            };
                            this.state.newsList.push(jsonObject);
                            idx++;
                        })
                        this.setState({
                            isLoading:true,
                        })
                    }
                })
        }catch (error) {
            console.log(error)
        }
    }


    renderListView(data){
        const url = data.item.url
        return(
            <TouchableOpacity
                onPress={async () => {
                    await Linking.openURL(url);
                }}
            >
                <View style={{
                    flex:1,
                    paddingHorizontal:10,
                    paddingVertical:8,
                    backgroundColor:'#FFFAFA',
                }}>
                    <View style={{
                        flex:1,
                        flexDirection:'row',
                    }}>
                        <Text style={{
                            fontSize:17,
                            color: '#363636',
                        }}>
                            {data.item.title}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

        );
    }


    render(){
        const curSymbol = this.props.route.params.symbol;
        return(
            <View style={styles.container}>
                <Image
                    style={styles.picture}
                    source={require('../assets/imgs/news_picture.png')}
                />
                <Text
                    style={styles.title}>
                    News about {curSymbol}
                </Text>


                {this.state.isLoading ? (
                    <FlatList
                        data={this.state.newsList}
                        renderItem={data => this.renderListView(data)}
                        ItemSeparatorComponent = {()=>{
                            return(<View style={styles.separatorComponent}/>);
                        }}
                        refreshControl={
                            <RefreshControl
                                title='Loading...'
                                colors={['chocolate']}
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.getNewsInfo.bind(this)}
                                tintColor={'orange'}
                            />
                        }
                    />
                ):(
                    <TouchableOpacity
                        style={styles.touch}
                        onPress={this.fetchNews}>
                        <Text style={styles.touchText}>
                            Click here to view news
                        </Text>
                    </TouchableOpacity>
                )}


            </View>
        );
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    picture: {
        width: Dimensions.get("window").width,
        height:280,
    },
    title:{
        fontSize:22,
        fontWeight:'bold',
        color:'black',
        textAlign:'center',
        paddingTop:30,
        paddingBottom:30,
    },
    touch:{
        alignItems:'center',
        alignContent:'center',
        // paddingTop:30,
        backgroundColor:'#F4A460',
        width:300,
        height:50,
        borderRadius:10,
        marginLeft:45,
        marginTop:20,
    },
    touchText:{
        fontSize:18,
        fontWeight:'bold',
        color:'white',
        textAlign:'center',
        paddingTop:8,
    },
    separatorComponent:{
        height:3,
        width:"100%",
        backgroundColor:'#F4A460',
    },
})