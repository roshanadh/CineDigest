import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

export default function listItem(props) {
    return (
        <TouchableOpacity style={styles.listItem}>
            <Text>{props.title}</Text>
            <Text>{props.overview}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    listItem: {
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
