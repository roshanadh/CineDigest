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
        for (let i = 0; i < dataLength - 1; i++) {
            data[i] = {
                id: jsonResponse.titleIds[i],
                title: jsonResponse.titles[i],
                overview: jsonResponse.overviews[i],
                voteCount: jsonResponse.voteCounts[i],
                voteAverage: jsonResponse.voteAverages[i],
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
                            onItemPressed={() => this.props.onIdSelected(item.id)}
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
