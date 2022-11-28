import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {connectInfiniteHits} from 'react-instantsearch-native';
import Highlight from './Highlight';
import {navigationRef} from "../navigation/RootNavigation";

const InfiniteHits = ({hits, hasMore, refineNext}) => (
    <FlatList
        data={hits}
        keyExtractor={item => item.objectID}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={() => hasMore && refineNext()}
        renderItem={({item}) => (
            <View style={styles.item}>
                <TouchableOpacity
                    onPress={()=>{
                        // console.log(item)
                        navigationRef.navigate('Details', {item});
                    }}
                >
                    <Text style={styles.titleText}>
                        <Highlight attribute="name" hit={item} />
                    </Text>
                </TouchableOpacity>
            </View>
        )}
    />
);


// function InfiniteHits ({hits, hasMore, refineNext}) {
//     return(
//         <FlatList
//             data={hits}
//             keyExtractor={item => item.objectID}
//             ItemSeparatorComponent={() => <View style={styles.separator} />}
//             onEndReached={() => hasMore && refineNext()}
//             renderItem={({item}) => (
//                 <View style={styles.item}>
//                     <TouchableOpacity
//                         onPress={()=>{
//                             navigationRef.navigate('Details', {item});
//                         }}
//                     >
//                         <Text style={styles.titleText}>
//                             <Highlight attribute="name" hit={item} />
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//         />
//     );
// }

InfiniteHits.propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    hasMore: PropTypes.bool.isRequired,
    refineNext: PropTypes.func.isRequired,
};

export default connectInfiniteHits(InfiniteHits);

const styles = StyleSheet.create({
    separator: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    item: {
        padding: 10,
        flexDirection: 'column',
        backgroundColor: '#F4A460',
    },
    titleText: {
        fontWeight: 'bold',
        color:'black'
    },
});




