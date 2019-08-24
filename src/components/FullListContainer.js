import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    FlatList,
    View,
    Text,
} from 'react-native';

import ListItem from './ListItem';

export default class FullListContainer extends Component {
    constructor(props) {
        super(props);
        this.source = props.source;
        this.dataLength = props.sourceLength;
        this.listType = props.listType;
        this.data = [];
        console.warn('poster:' + this.props.source.posterPaths[0]);

        for (let i = 0; i < this.dataLength; ++i) {
            this.data[i] = {
                id: this.source.titleIds[i],
                title: this.source.titles[i],
                overview: this.source.overviews[i],
                voteCount: this.source.voteCounts[i],
                voteAverage: this.source.voteAverages[i],
                posterPath: this.source.posterPaths[i],
            };
        }
        this.state = {
            data: this.data,
        };
    }

    render() {
        let listInfo = '';
        let listName = '';
        switch (this.listType) {
            case 'wishList':
                listName = 'Wish List';
                break;
            case 'watchingList':
                listName = 'Watching List';
                break;
            case 'watchedList':
                listName = 'Watched List';
                break;
        }

        listInfo = this.dataLength + (this.dataLength > 1 ? ' titles in your ' : ' title in your ') + listName;
        return (
            <View style={styles.metaContainer}>
                <ScrollView style={styles.listContainer}>
                    <View style={styles.listInfo}>
                        <Text style={styles.listInfoText}>
                            {listInfo}
                        </Text>
                    </View>
                    <FlatList data={this.state.data}
                        renderItem={({ item }) => (
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
    listInfo: {
        marginTop: 15,
        marginRight: 10,
        marginBottom: 5,
        alignSelf: 'flex-end',
    },
    listInfoText: {
        fontSize: 14,
    },
});
