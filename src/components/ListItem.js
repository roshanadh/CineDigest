import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function listItem(props) {
    return (
        <TouchableOpacity style={styles.listItem}>
            <Text style={styles.title}>{props.title}</Text>
            <Text>{props.overview}</Text>
            <Icon name="angle-right" size={20} color="#424242" style={styles.Icon}/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    listItem: {
        margin: 5,
        padding: 25,
        backgroundColor: '#fafafa',
        borderRadius: 15,
        minWidth: '95%',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        flex: 1,
    },
    rightIcon: {
        flex: 1,
    },
});
