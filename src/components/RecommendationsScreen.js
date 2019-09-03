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
                backgroundColor: '#913d88',
                elevation: 0,
            },
        };
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            isEmpty: true,
            searchResponse: {},
            username: this.props.navigation.getParam('username', null),
            uuid: this.props.navigation.getParam('uuid', null),
        };
        this.titleId = this.props.navigation.getParam('titleId', null);
        this.title = this.props.navigation.getParam('title', null);
        this.recomType = this.props.navigation.getParam('recomType', null);
    }

    onIdSelected = (itemId, itemTitle) => {
        netCon.checkNetCon()
            .then((result) => {
                console.warn('itemTitle is ' + itemTitle);
                console.warn('itemId is ' + itemId);
                this.recomType === 'movie' ?
                    this.props.navigation.navigate('MovieDetailsScreen', {
                        screenName: itemTitle,
                        titleId: itemId,
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
                Alert.alert('Something went wrong', `Please try again!`, [{
                    text: 'OK',
                    onPress: (
                        () => this.props.navigation.goBack()),
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
