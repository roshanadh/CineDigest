import React from 'react';
import {
    StyleSheet,
    ScrollView,
    FlatList,
} from 'react-native';

import ListItem from './ListItem';

const createListItem = (props) => {
    let jsonResponse = props.source; // JSON
    let totalResults = jsonResponse.totalResults; // Not array
    let voteCounts = jsonResponse.voteCounts;
    let titleIds = jsonResponse.titleIds;
    let voteAverages = jsonResponse.voteAverages;
    let posterPaths = jsonResponse.posterPaths;
    let overviews = jsonResponse.overviews;
    let titles = jsonResponse.titles;

    props.forEach((element, index) => {
        // return <ListItem
        //     title={element}
        //     titleId={titleIds[index]}
        //     voteCounts={voteCounts[index]}
        //     voteAverages={voteAverages[index]}
        //     posterPaths={posterPaths[index]}
        //     overviews={overviews[index]}
        // />;
        // alert(element);
    });
};

export default function listContainer(props) {
    return (
        <ScrollView>
            <FlatList data={props.source.titles}
                renderItem={({item}) => (
                    <ListItem title={item} />
                )}
                style={styles.listItem}
            />
		</ScrollView>
    );
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
