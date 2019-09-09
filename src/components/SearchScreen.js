import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import CustomSnackbar from '../util/Snackbar';
import ListContainer from './ListContainer';
import netCon from '../util/NetCon';

export default class SearchScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Search Results: ' + navigation.getParam('searchQuery', null),
            headerTitleStyle: {
                color: '#fefefe',
            },
            headerTintColor: '#fefefe',
            headerStyle: {
                backgroundColor: '#913d88',
                elevation: 0,
            },
        };
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            isEmpty: true,
            searchQuery: this.props.navigation.getParam('searchQuery', null),
            releaseYear: this.props.navigation.getParam('releaseYear', null),
            searchResponse: {},
            username: this.props.navigation.getParam('username', null),
            uuid: this.props.navigation.getParam('uuid', null),
        };
        this.searchQuery = this.props.navigation.getParam('searchQuery', null);
        this.releaseYear = this.props.navigation.getParam('releaseYear', null);
        this.searchType = this.props.navigation.getParam('searchType', null);
    }

    onIdSelected = (itemId, itemTitle) => {
        netCon.checkNetCon()
            .then((result) => {
                this.searchType === 'm' ?
                    this.props.navigation.navigate('MovieDetailsScreen', {
                        titleId: itemId,
                        screenName: itemTitle,
                        username: this.state.username,
                        uuid: this.state.uuid,
                    }) :
                    this.props.navigation.navigate('ShowDetailsScreen', {
                        screenName: itemTitle,
                        titleId: itemId,
                        username: this.state.username,
                        uuid: this.state.uuid,
                    });
            }, (error) => {
                netCon.showSnackBar('An internet connection is required!');
            });
    };

    componentDidMount() {
        let searchQuery = (this.releaseYear === null || this.releaseYear.trim().length === 0) ?
            this.searchQuery : this.searchQuery + '/' + this.releaseYear;
        console.warn('Search query: ' + searchQuery);
        fetch(`https://api-cine-digest.herokuapp.com/api/v1/search${this.searchType}/${searchQuery}`)
            .then(response => response.json())
            .then(jsonResponse => { // TODO read full response, not just titles
                if (jsonResponse.status === 'NOT-FOUND') {
                    CustomSnackbar.showSnackBar('No results found!', 'long', '#e74c3c', 'OK');
                    this.props.navigation.goBack();
                } else {
                    this.setState({
                        isEmpty: false,
                        searchResponse: jsonResponse,
                    });
                }
            }) // TODO fix response status parsing
            .catch(error => {
                CustomSnackbar.showSnackBar('Request couldn\'t be handled!', 'long', '#e74c3c', 'OK');
                this.props.navigation.goBack();
            });
    }
    render() {
        if (!this.state.isEmpty) {
        return (
            <ImageBackground blurRadius={1.3}
                source={require('../assets/lilypads.png')}
                resizeMode="cover" style={styles.bgImage}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.container}>
                        <ListContainer
                            source={this.state.searchResponse}
                            onIdSelected={this.onIdSelected}
                        />
                    </View>
                </ScrollView>
            </ImageBackground>
        );
        } else {
            return (
                <ImageBackground blurRadius={1.3}
                    source={require('../assets/lilypads.png')}
                    resizeMode="cover" style={styles.bgImage}>
                    <View style={styles.indicatorContainer}>
                        <ActivityIndicator size="large" color="#674172" />
                    </View>
                </ImageBackground>
            );
        }
    }
}
const styles = StyleSheet.create({
    bgImage: {
        width: '100%',
        height: '100%',
        flex: 1,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    indicatorContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});
