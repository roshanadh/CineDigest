import React, {Component} from 'react';
import {
    View,
    TextInput,
    StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

export default class SearchItem extends Component{
	constructor(props) {
		super(props);
		this.state = {
			showFilter: false,
		};
	}
	render() {
		let searchWrapperJsx = '';
		let filterYearWrapperJsx = '';
		if (this.props.searchType === 'movie') {
			switch (this.state.showFilter) {
				case true:
					searchWrapperJsx =
						<View style={styles.searchWrapper}>
							<TextInput placeholder={this.props.placeholder}
								style={styles.searchTextInput}
								onChangeText={this.props.onChangeText}
								onSubmitEditing={this.props.onSubmitEditing}
								placeholderTextColor="#fefefe"
								returnKeyType="next" />
								{/*
									Icons are used to push TextInput to the left side.
									These icons are not clickable.
								*/}
						<Icon name="filter" size={20}
							color="#6bb9f0" style={styles.filterIcon} />
						<Icon name="search" size={20}
							color="#6bb9f0" style={styles.searchIcon} />
						</View>;
					break;
				case false:
					searchWrapperJsx =
						<View style={styles.searchWrapper}>
							<TextInput placeholder={this.props.placeholder}
								style={styles.searchTextInput}
								onChangeText={this.props.onChangeText}
								onSubmitEditing={this.props.onSubmitEditing}
								placeholderTextColor="#fefefe"
								returnKeyType="search" />
							<Icon name="filter" size={20}
								color="#fefefe" style={styles.filterIcon}
								onPress={
									() => {
										this.setState(prevState => ({
											showFilter: !prevState.showFilter,
										}), this.props.filterShown(!this.state.showFilter));
									}
								} />
							<Icon name="search" size={20}
								color="#fefefe" style={styles.searchIcon}
								onPress={this.props.onSubmitEditing} />
						</View>;
					break;
				default: null;
			}

			filterYearWrapperJsx = this.state.showFilter ?
				<View style={styles.filterYearWrapper}>
					<TextInput placeholder="Release year"
						style={styles.searchTextInput}
						onChangeText={this.props.onChangeYear}
						onSubmitEditing={this.props.onSubmitEditing}
						placeholderTextColor="#fefefe"
						returnKeyType="search" />
					<Icon name="filter" size={20}
						color="#fefefe" style={styles.filterIcon}
						onPress={
							() => {
								this.setState(prevState => ({
									showFilter: !prevState.showFilter,
								}), this.props.filterShown(!this.state.showFilter));
							}
						} />
					<Icon name="search" size={20}
						color="#fefefe" style={styles.searchIcon}
						onPress={this.props.onSubmitEditing} />
				</View>
				: null;
		} else {
			searchWrapperJsx =
				<View style={styles.searchWrapper}>
					<TextInput placeholder={this.props.placeholder}
						style={styles.searchTextInput}
						onChangeText={this.props.onChangeText}
						onSubmitEditing={this.props.onSubmitEditing}
						placeholderTextColor="#fefefe"
						returnKeyType="search" />
					<Icon name="search" size={20}
						color="#fefefe" style={styles.searchIcon}
						onPress={this.props.onSubmitEditing} />
				</View>;

			filterYearWrapperJsx = null;
		}

		return (
			<View style={styles.container}>
				{searchWrapperJsx}
				{filterYearWrapperJsx}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
	},
    searchWrapper: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 10,
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 10,
		backgroundColor: '#6bb9f0',
	},
	filterIcon: {
		marginRight: 20,
	},
	searchTextInput: {
		marginRight: 10,
		flex: 5,
		minHeight: '6%',
		color: '#fefefe',
		borderBottomWidth: 1,
		borderColor: 'rgba(232, 236, 241, 0.4)',
		paddingBottom: 5,
	},
	filterYearWrapper: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 10,
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 10,
		backgroundColor: '#6bb9f0',
	},
});
