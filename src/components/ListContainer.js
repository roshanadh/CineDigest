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
                posterPath: `https://image.tmdb.org/t/p/w185/${jsonResponse.posterPaths[i]}`,
            };
        }
        this.state = {
            data: this.data,
        };
        this.titleIds = this.state.titleIds;
    }

    render() {
        return (
            <View>
                <ScrollView style={styles.listContainer}>
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
                {
                    this.data.length !== 0 ?
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{this.dataLength} search results</Text>
                    </View> : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    listContainer: {
        margin: 5,
    },
    footer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 90,
    },
    footerText: {
        fontSize: 15,
        color: '#2b2b2b',
    },
});
