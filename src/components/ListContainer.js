import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
} from 'react-native';
import ListItem from './ListItem';

export default function listContainer(props) {
    return (
        <ScrollView>
            <FlatList data={props.source}
                renderItem={({item}) => (
                    <ListItem title={item} />
                )}
                style={styles.listItem}
            />
		</ScrollView>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        margin: 5,
        padding: 40,
        backgroundColor: '#e4f1fe',
        borderRadius: 15,
        minWidth: '95%',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
});
