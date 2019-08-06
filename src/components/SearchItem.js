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
				onSubmitEditing={props.onSubmitEditing} />
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
		borderWidth: 1,
		borderColor: '#010101',
		borderRadius: 5,
		paddingLeft: 20,
		paddingRight: 20,
	},
	searchTextInput: {
		marginRight: 10,
		flex: 5,
		minHeight: '6%',
	},
});
