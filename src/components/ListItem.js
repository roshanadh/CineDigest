import React, {Component} from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    Image,
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
            posterPath: this.props.posterPath,
        };
    }

    render() {
        return (
            <TouchableOpacity style={styles.listItem}
                onPress={this.props.onItemPressed}>
                <Text style={styles.title}>{this.state.title}</Text>
                    <View style={styles.infoWrapper}>
                        <View style={styles.aboutItemWrapper}>
                            <Image
                                style={styles.posterImage}
                                source={
                                    this.state.posterPath.slice(-4) === 'null' ?
                                    // Fallback poster incase API responds with null
                                    require('../assets/oops.png') :
                                    {uri: this.state.posterPath}
                                }
                            />
                            <View style={styles.textWrapper}>
                                <Text style={styles.overview}>{this.state.overview}</Text>
                            </View>
                        </View>
                        <View style={styles.footerWrapper}>
                            <View style={styles.voteWrapper}>
                                <Text>{this.state.voteAverage}</Text>
                                <Icon name="heart" size={18} color="#db0a5b" style={styles.heartIcon}/>
                            </View>
                            <Icon name="angle-right" size={20} color="#19b5fe" style={styles.rightIcon}/>
                        </View>
                    </View>
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
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    title: {
        color: '#19b5fe',
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoWrapper: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 2,
        marginRight: 20,
    },
    aboutItemWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    posterImage:{
        width: 90,
        height: 90,
        borderRadius: 5,
        marginRight: 10,
        marginTop: 5,
    },
    textWrapper: {
        flexDirection: 'column',
        flex: 4,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    overview: {
        fontSize: 15,
        textAlign: 'justify',
    },
    footerWrapper: {
        flexDirection: 'row',
    },
    voteWrapper: {
        flexDirection: 'row',
        marginTop: 20,
        flex: 2,
    },
    rightIcon: {
        marginTop: 20,
    },
    heartIcon: {
        marginLeft: 5,
    },
});
