import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import SearchItem from './SearchItem';
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
                alert('Oops!\nPlease make sure your search query is correct!');
                this.state.searchResponse = error.response.status;
            });
    }
    render() {
        if (!this.state.isEmpty) {
        return (
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <ListContainer
                        source={this.state.searchResponse}
                        onIdSelected={this.onIdSelected}
                    />
                </View>
            </ScrollView>
        );
        } else {
            return (
                <View style={styles.indicatorContainer}>
                    <ActivityIndicator size="large" color="#22a7f0" />
                </View>
            );
        }
    }
}
const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#f2f1ef',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    indicatorContainer: {
        backgroundColor: '#f2f1ef',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});
