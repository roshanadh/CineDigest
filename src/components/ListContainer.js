import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    FlatList,
    View,
    Text,
} from 'react-native';

import ListItem from './ListItem';

export default class ListContainer extends Component {
    constructor(props) {
        super(props);
        let jsonResponse = props.source;
        this.dataLength = jsonResponse.totalResults;
        this.data = [];
        for (let i = 0; i < this.dataLength; ++i) {
            this.data[i] = {
                id: jsonResponse.titleIds[i],
                title: jsonResponse.titles[i],
                // Limit overview to 150 letters or less
                overview: jsonResponse.overviews[i].length <= 100 ?
                    jsonResponse.overviews[i] : jsonResponse.overviews[i].slice(0, 150) + '...',
                voteCount: jsonResponse.voteCounts[i],
                voteAverage: jsonResponse.voteAverages[i],
                posterPath: jsonResponse.posterPaths[i],
            };
        }
        this.state = {
            data: this.data,
        };
        this.titleIds = this.state.titleIds;
    }

    render() {
        return (
            <View style={styles.metaContainer}>
                <ScrollView style={styles.listContainer}>
                    <View style={styles.searchInfo}>
                        <Text style={styles.searchInfoText}>
                            {this.dataLength}{this.dataLength > 1 ? ' search results' : ' search result'}
                        </Text>
                    </View>
                    <FlatList data={this.state.data}
                        renderItem={({item}) => (
                            <ListItem
                                titleId={item.id}
                                title={item.title}
                                overview={item.overview}
                                voteCount={item.voteCount}
                                voteAverage={item.voteAverage}
                                posterPath={item.posterPath}
                                onItemPressed={() => this.props.onIdSelected(item.id, item.title)}
                            />
                        )}
                        style={styles.listItem}
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    metaContainer: {},
    searchInfo: {
        marginTop: 15,
        marginRight: 20,
        marginBottom: 5,
        alignSelf: 'flex-end',
    },
    searchInfoText: {
        fontSize: 14,
        color: '#6c7a89',
    },
});
