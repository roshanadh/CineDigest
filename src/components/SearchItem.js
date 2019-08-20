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
				placeholderTextColor="#fefefe"
				returnKeyType="search" />
			<Icon name="search" size={20}
				color="#fefefe" style={styles.searchIcon}
				onPress={props.onSubmitEditing} />
		</View>
    );
}

const styles = StyleSheet.create({
    searchWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#22a7f0',
		paddingTop: 20,
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: '#6bb9f0',
	},
	searchTextInput: {
		marginRight: 10,
		flex: 5,
		minHeight: '6%',
	},
});
