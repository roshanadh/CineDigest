import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
} from 'react-native';

export default function searchItem(props) {
    return (
        <View style={styles.searchWrapper}>
			<TextInput placeholder={props.placeholder}
				style={styles.searchTextInput}
				onChangeText={props.onChangeText}
				onSubmitEditing={props.onSubmitEditing}/>
		</View>
    );
}

const styles = StyleSheet.create({
    searchWrapper: {
		margin: 10,
        flexDirection: 'row',
		justifyContent: 'center',
        alignItems: 'center',
	},
	searchTextInput: {
		marginRight: 5,
		borderColor: '#010101',
		borderRadius: 5,
		borderWidth: 1,
		paddingLeft: 20,
		paddingRight: 20,
		flex: 5,
		minHeight: '6%',
	},
});
