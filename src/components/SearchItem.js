import React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    TextInput,
    StyleSheet,
} from 'react-native';

export default function searchItem(props) {
    return (
        <View style={styles.searchWrapper}>
			<TextInput placeholder="Search a movie"
				style={styles.searchTextInput}
				onChangeText={props.onChangeText} />

			<TouchableOpacity style={styles.searchBtn}
				onPress={props.onPress}>
				<Text>Search</Text>
			</TouchableOpacity>
		</View>
    );
}

const styles = StyleSheet.create({
    searchWrapper: {
		margin: 10,
        flexDirection: 'row',
		justifyContent: 'flex-start',
        alignItems: 'flex-start',
	},
	searchTextInput: {
		marginRight: 5,
		borderColor: '#010101',
		borderRadius: 5,
		borderWidth: 1,
		paddingLeft: 20,
		paddingRight: 20,
		width: '78%',
		minHeight: '6%',
	},
	searchBtn: {
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 5,
		padding: 15,
		minHeight: '6%',
		width: '18%',
	},
});
