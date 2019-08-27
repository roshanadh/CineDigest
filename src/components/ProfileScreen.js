import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EditIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import db from '../db/db';

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isNameEditable: false,
            isUsernameEditable: false,
            isPasswordEditable: false,
            name: '',
            username: '',
            stats: {},
            newName: '',
            newUsername: '',
        };

        this.getUsername = () => {
            return new Promise((resolve, reject) => {
                let username = AsyncStorage.getItem('USER_KEY');
                resolve(username)
                    .catch(error => console.warn('ERROR in getUsername ' + error.message));
            });
        };

        this.changeEditable = (field) => {
            switch (field) {
                case 'name':
                    this.setState({isNameEditable: true});
                    break;
                case 'username':
                    this.setState({ isUsernameEditable: true });
                    break;
                case 'password':
                    this.setState({ isPasswordEditable: true });
                    break;
                default: null;
            }
        };
    }

    componentDidMount() {
        this.getUsername()
            .then(result => {
                db.getUser(result)
                    .then(details => {
                        this.setState({
                            username: details.username, name: details.name,
                        }, () => {console.warn('User ' + this.state.name + ' retrieved successfully!');});
                    }, error => {
                        console.warn('User by the username ' + result + ' was not found!');
                    })
                    .catch(error => console.warn(error.message));
                // Return retrieved username to chained then()
                return result;
            })
            .then(username => {
                console.warn(username + ' is the user!!');
                db.getStats(username)
                    .then(result => {
                        this.setState({stats: result}, () => console.warn(this.state.stats.listedMovies));
                    });
            });
    }

    _onRefresh = () => {
        this.setState({ refreshing: true }, () => {
            db.getStats(this.state.username)
                .then(result => {
                    this.setState({ stats: result, refreshing: false }, () => console.warn(this.state.stats.listedMovies));
                });
        });
    }

    render() {
        let indicatorJsx = this.state.isLoading ?
            <ActivityIndicator size="small" color="#fefefe"
                style={styles.indicator} /> : null;

        let usernameLengthErrorTextJsx =
            this.state.newUsername.length > 0 && this.state.newUsername.length < 6 ?
                <Text style={styles.errorText}>Username must contain atleast 6 characters</Text> : null;

        let usernameCharErrorTextJsx =
            this.state.newUsername.includes('.') || this.state.newUsername.includes('/') ||
            this.state.newUsername.includes('\\') || this.state.newUsername.includes('|') ||
            this.state.newUsername.includes('~') || this.state.newUsername.includes('`') ||
            this.state.newUsername.includes('!') || this.state.newUsername.includes('@') ||
            this.state.newUsername.includes('+') || this.state.newUsername.includes('-') ||
            this.state.newUsername.includes('*') || this.state.newUsername.includes('=') ||
            this.state.newUsername.includes('#') || this.state.newUsername.includes('$') ||
            this.state.newUsername.includes('%') || this.state.newUsername.includes('^') ||
            this.state.newUsername.includes('&') || this.state.newUsername.includes('(') ||
            this.state.newUsername.includes(')') || this.state.newUsername.includes(';') ||
            this.state.newUsername.includes(':') || this.state.newUsername.includes('{') ||
            this.state.newUsername.includes('}') || this.state.newUsername.includes('[') ||
            this.state.newUsername.includes(']') || this.state.newUsername.includes('\'') ||
            this.state.newUsername.includes('"') || this.state.newUsername.includes('?') ||
            this.state.newUsername.includes('<') || this.state.newUsername.includes('>') ||
            this.state.newUsername.includes(',') || this.state.newUsername.includes(' ') ?
                <Text style={styles.errorText}>Username must not contain any special characters</Text> : null;

        let statJsx =
            this.state.stats.listedMovies + this.state.stats.listedShows +
            this.state.stats.listedInWishMovies + this.state.stats.listedInWishShows +
            this.state.stats.listedInWatchedMovies + this.state.stats.listedInWatchedShows +
            this.state.stats.listedInWatchingShows > 0 ?
                <View style={styles.statsContainer}>
                    <Text style={styles.statsHeader}>We thought you'd like some numbers</Text>
                    {
                        (this.state.stats.listedMovies + this.state.stats.listedShows) > 0 ?
                            <Text style={styles.statWrapper}>
                                <Text style={styles.statNumber}>{this.state.stats.listedMovies + this.state.stats.listedShows}</Text>{'\t'} titles listed!
                            </Text> : null
                    }
                    <Text>
                        {
                            (this.state.stats.listedInWishMovies + this.state.stats.listedInWishShows) > 0 ?
                                <Text style={styles.statWrapper}>
                                    <Text style={styles.statNumber}>{this.state.stats.listedInWishMovies + this.state.stats.listedInWishShows}</Text>{'\t'} titles in your wish list!
                                </Text> : null
                        }
                    </Text>
                    <Text>
                        {
                            (this.state.stats.listedInWatchedMovies + this.state.stats.listedInWatchedShows) > 0 ?
                                <Text style={styles.statWrapper}>
                                    <Text style={styles.statNumber}>{this.state.stats.listedInWatchedMovies + this.state.stats.listedInWatchedShows}</Text>{'\t'} titles in your watched list!
                                </Text> : null
                        }
                    </Text>
                    <Text>
                        {
                            this.state.stats.listedInWatchingShows > 0 ?
                                <Text style={styles.statWrapper}>
                                    <Text style={styles.statNumber}>{this.state.stats.listedInWatchingShows}</Text>{'\t'} titles in your watching list!
                                </Text> : null
                        }
                    </Text>
                </View> : null;

        return (
            <ImageBackground blurRadius={1.3}
                source={require('../assets/lilypads.png')}
                resizeMode="cover" style={styles.bgImage}>
                <View style={styles.header}>
                    <MaterialIcons name="person" size={25} color="#fefefe" />
                    <Text style={styles.headerTitle}>Update Profile</Text>
                </View>
                <ScrollView style={styles.scrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <View style={styles.container}>
                        <View style={styles.profileContainer}>
                            <AntDesignIcon name="profile" size={80} color="#34495e" style={styles.profileIcon} />
                            <View style={styles.textInputWrapper}>
                                <TextInput placeholder="Your Name"
                                    defaultValue={this.state.name}
                                    editable={this.state.isNameEditable}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={newName => this.setState({ newName })}
                                    returnKeyType="done" />
                                <EditIcon name="edit-2"
                                    size={20}
                                    color={this.state.isNameEditable ? '#6bb9f0' : '#67809f'}
                                    onPress={() => this.changeEditable('name')} />
                            </View>
                            <View style={styles.textInputWrapper}>
                                <TextInput placeholder="Your Username"
                                    defaultValue={this.state.username}
                                    editable={this.state.isUsernameEditable}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={newUsername => this.setState({ newUsername })}
                                    returnKeyType="done" />
                                <EditIcon name="edit-2"
                                    size={20}
                                    color={this.state.isUsernameEditable ? '#6bb9f0' : '#67809f'}
                                    onPress={() => this.changeEditable('username')} />
                            </View>
                            <View style={styles.footer}>
                                {usernameLengthErrorTextJsx}
                                {usernameCharErrorTextJsx}
                            </View>
                            <TouchableOpacity style={styles.saveProfileBtn}
                                onPress={() => console.warn('Saved Profile!')}>
                                <Text style={styles.btnText}>Save Profile</Text>
                                {indicatorJsx}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.changePass}
                                onPress={() =>
                                    this.props.navigation.navigate('ChangePasswordScreen')
                                }>
                                <Text style={styles.changePassText}>Change your password?</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={styles.horizontalRule} /> */}
                        {statJsx}
                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    bgImage: {
        width: '100%',
        height: '100%',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
        top: 0,
        width: '100%',
        zIndex: 1,
        padding: 20,
        backgroundColor: '#6bb9f0',
        height: 63.5,
    },
    headerTitle: {
        color: '#fefefe',
        fontSize: 18,
        marginLeft: 10,
    },
    container: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    profileContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 20,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 10,
        borderWidth: 0.1,
        borderColor: '#013243',
    },
    statsContainer: {
        borderWidth: 0.1,
        borderColor: '#013243',
        flexDirection: 'column',
        padding: 20,
        paddingBottom: 0,
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
    },
    statsHeader: {
        fontSize: 13,
        color: '#34495e',
        textAlign: 'center',
        marginBottom: 15,
    },
    statNumber: {
        fontSize: 25,
        color: '#013243',
    },
    profileIcon: {
        margin: 25,
        color: '#34495e',
    },
    changePassText: {
        color: '#22a7f0',
        marginTop: 25,
    },
    textInputWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgba(103, 128, 159, 0.5)',
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 25,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    textInput: {
        marginRight: 10,
        flex: 5,
        minHeight: '6%',
        opacity: 1,
    },
    saveProfileBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 50,
        padding: 15,
        width: '50%',
        backgroundColor: '#22a7f0',
    },
    btnText: {
        color: '#fff',
        fontSize: 15,
    },
    indicator: {
        marginLeft: 20,
    },
    footer: {
        marginBottom: 10,
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 14,
        alignSelf: 'center',
        textAlign: 'center',
        marginBottom: 10,
    },
});
