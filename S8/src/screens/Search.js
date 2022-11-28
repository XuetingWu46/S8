import React, {Component } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Button, TextInput, TouchableOpacity, Alert, Image, Dimensions,
} from 'react-native';
import algoliasearch from 'algoliasearch';
import {InstantSearch} from 'react-instantsearch-native';
import SearchBox from './SearchBox';
import InfiniteHits from "./InfiniteHits";

const searchClient = algoliasearch(
    '0Z3TLKD8FY',
    '8bb6326aa276dcd904216ecc29ab09c4',
);


export class Search extends Component{
    render(){
        return(
            <SafeAreaView style={{}}>
                <Image
                    style={styles.picture}
                    source={require('../assets/imgs/search_picture.png')}
                />
                <Text style={styles.noteText}>
                    You can search for financial instruments
                </Text>
                <View style={styles.rowView}>
                    <Image
                        style={styles.pictureStyle}
                        source={require('../assets/imgs/fdj.png')}>
                    </Image>
                    <Text style={styles.note1Text}>
                        And click to see details
                    </Text>
                </View>
                <InstantSearch searchClient={searchClient} indexName="listing_status">
                    <SearchBox />
                    <InfiniteHits />
                </InstantSearch>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    noteText:{
        textAlign: 'center',
        color:'#8B7355',
        fontSize: 24,
        paddingTop:20,
        fontWeight:'bold',
        fontFamily:'montserrat-regular',
    },
    note1Text:{
        textAlign: 'center',
        color:'gray',
        fontSize: 18,
        paddingTop:10,
        paddingBottom:20,
        // fontWeight:'bold',
        fontStyle:'italic'
    },
    rowView:{
        flexDirection:"row",
        alignItems:'center',
        paddingLeft:30,
    },
    pictureStyle:{
        width:40,
        height:40,
        marginLeft:50,
    },
    picture: {
        width: Dimensions.get("window").width,
        height:210,
    },

})