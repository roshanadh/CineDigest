import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    FlatList,
} from 'react-native';

import ListItem from './ListItem';

export default class ListContainer extends Component {
    constructor(props) {
        super(props);
        let jsonResponse = props.source;
        let dataLength = jsonResponse.totalResults;
        let data = [];
        for (let i = 0; i < dataLength; ++i) {
            data[i] = {
                id: jsonResponse.titleIds[i],
                title: jsonResponse.titles[i],
                // Limit overview to 150 letters or less
                overview: jsonResponse.overviews[i].length <= 100 ?
                    jsonResponse.overviews[i] : jsonResponse.overviews[i].slice(0, 150) + "...",
                voteCount: jsonResponse.voteCounts[i],
                voteAverage: jsonResponse.voteAverages[i],
                posterPath: `https://image.tmdb.org/t/p/w185/${jsonResponse.posterPaths[i]}`,
            };
        }
        this.state = {
            data,
        };
        this.titleIds = this.state.titleIds;
    }

    render() {
        return (
            <ScrollView>
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
        );
    }
}

const styles = StyleSheet.create({
    listContainer: {
        margin: 5,
        padding: 40,
        backgroundColor: '#e4f1fe',
        borderRadius: 15,
        minWidth: '95%',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
});
