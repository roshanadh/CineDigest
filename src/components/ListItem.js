import React, {Component} from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ListItem extends Component {
    constructor(props) {
        // alert(props.titleId);
        super(props);

        this.state = {
            titleId: this.props.titleId,
            title: this.props.title,
            overview: this.props.overview,
            voteCount: this.props.voteCount,
            voteAverage: this.props.voteAverage,
        };
    }

    render() {
        return (
            <TouchableOpacity style={styles.listItem}
                onPress={this.props.onItemPressed}>
                <View style={styles.infoWrapper}>
                    <View style={styles.textWrapper}>
                        <Text style={styles.title}>{this.state.title}</Text>
                        <Text style={styles.overview}>{this.state.overview}</Text>
                    </View>
                    <View style={styles.voteWrapper}>
                        <Text>{this.state.voteAverage}</Text>
                        <Icon name="heart" size={18} color="#db0a5b" style={styles.heartIcon}/>
                    </View>
                </View>
                <Icon name="angle-right" size={20} color="#19b5fe" style={styles.rightIcon}/>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    listItem: {
        margin: 5,
        padding: 25,
        backgroundColor: '#fafafa',
        borderRadius: 15,
        minWidth: '95%',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    infoWrapper: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 2,
        marginRight: 20,
    },
    textWrapper: {
        flexDirection: 'column',
        flex: 4,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        textAlign: 'justify',
    },
    voteWrapper: {
        flexDirection: 'row',
        marginTop: 10,
        flex: 2,
    },
    title: {
        color: '#19b5fe',
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
    },
    overview: {
        fontSize: 15,
    },
    rightIcon: {
        margin: 20,
    },
    heartIcon: {
        marginLeft: 5,
    },
});
