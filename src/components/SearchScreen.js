import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Alert,
    ImageBackground,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import ListContainer from './ListContainer';

export default class SearchScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Search Results: ' + navigation.getParam('searchQuery', null),
        };
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            isEmpty: true,
            searchQuery: this.props.navigation.getParam('searchQuery', null),
            searchResponse: {},
        };
        this.searchQuery = this.props.navigation.getParam('searchQuery', null);
        this.searchType = this.props.navigation.getParam('searchType', null);
    }

    onIdSelected = (itemId, itemTitle) => {
        this.searchType === 'm' ?
            this.props.navigation.navigate('MovieDetailsScreen', {
                titleId: itemId,
                screenName: itemTitle,
            }) :
            this.props.navigation.navigate('ShowDetailsScreen', {
                screenName: itemTitle,
                titleId: itemId,
            });
    };

    componentDidMount() {
        fetch(`https://api-cine-digest.herokuapp.com/api/v1/search${this.searchType}/${this.searchQuery}`)
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
                    onPress:(
                        () => this.searchType === 'm' ?
                            this.props.navigation.navigate('MoviesListsScreen') :
                            this.props.navigation.navigate('ShowsListsScreen') ),
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
        alignItems: 'center',
    },
    indicatorContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});
