import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

export default function searchItem(props) {
    return (
        <View style={styles.searchWrapper}>
			<TextInput placeholder={props.placeholder}
				style={styles.searchTextInput}
				onChangeText={props.onChangeText}
				onSubmitEditing={props.onSubmitEditing}
				returnKeyType="search" />
			<Icon name="search" size={20}
				color="#bbb" style={styles.heartIcon}
				onPress={props.onSubmitEditing} />
		</View>
    );
}

const styles = StyleSheet.create({
    searchWrapper: {
		margin: 10,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#22a7f0',
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: 'rgba(255,255,255,0.3)',
	},
	searchTextInput: {
		marginRight: 10,
		flex: 5,
		minHeight: '6%',
	},
});
