import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    ImageBackground,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import RecommendationsList from './RecommendationsList';
import netCon from '../util/NetCon';

export default class RecommendationsScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: `Similar to '${navigation.getParam('title', null)}'`,
            headerTitleStyle: {
                color: '#fefefe',
            },
            headerTintColor: '#fefefe',
            headerStyle: {
                backgroundColor: '#6bb9f0',
                elevation: 0,
            },
        };
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            isEmpty: true,
            titleId: this.props.navigation.getParam('titleId', null),
            title: this.props.navigation.getParam('title', null),
            searchResponse: {},
            username: this.props.navigation.getParam('username', null),
        };
        this.titleId = this.props.navigation.getParam('titleId', null);
        this.title = this.props.navigation.getParam('title', null);
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
                    }) :
                    this.props.navigation.navigate('ShowDetailsScreen', {
                        screenName: itemTitle,
                        titleId: itemId,
                        username: this.state.username,
                    });
            }, (error) => {
                netCon.showSnackBar('An internet connection is required!');
            });
    };

    componentDidMount() {
        let recomType = this.props.navigation.getParam('recomType', null);
        let path = '';
        switch (recomType) {
            case 'movie':
                path = 'getmr';
                break;
            case 'show':
                path = 'getsr';
                break;
            default:
                null;
        }
        fetch(`https://api-cine-digest.herokuapp.com/api/v1/${path}/${this.titleId}`)
            .then(response => response.json())
            .then(jsonResponse => { // TODO read full response, not just titles
                this.setState({
                    isEmpty: false,
                    searchResponse: jsonResponse,
                });
            }) // TODO fix response status parsing
            .catch(error => {
                Alert.alert('Invalid Request', `Your request couldn't be handled!`, [{
                    text: 'OK',
                    onPress: (
                        () => this.searchType === 'm' ?
                            this.props.navigation.navigate('MoviesListsScreen') :
                            this.props.navigation.navigate('ShowsListsScreen')),
                }]);
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
                            <RecommendationsList
                                source={this.state.searchResponse}
                                title={this.title}
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
                        <ActivityIndicator size="large" color="#22a7f0" />
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
