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
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EditIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import db from '../db/db_exp';

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            refreshing: false,
            isNameEditable: false,
            isUsernameEditable: false,
            isEmailEditable: false,
            name: '',
            username: '',
            email: '',
            uuid: '',
            stats: {},
            newName: '',
            newUsername: '',
            newEmail: '',
        };

        this.getUserId = () => {
            return new Promise((resolve, reject) => {
                AsyncStorage.multiGet(['USER_KEY', 'UUID'])
                    .then(storedValues => {
                        // storedValues is a 2D array
                        let username = storedValues[0][1];
                        let uuid = storedValues[1][1];
                        resolve({
                            username,
                            uuid,
                        });
                    })
                    .catch(error => console.warn(error.message));
            });
        };

        this.changeEditable = (field) => {
            switch (field) {
                case 'name':
                    this.setState({isNameEditable: !this.state.isNameEditable});
                    break;
                case 'username':
                    this.setState({ isUsernameEditable: !this.state.isUsernameEditable });
                    break;
                case 'email':
                    this.setState({ isEmailEditable: !this.state.isEmailEditable });
                    break;
                default: null;
            }
        };

        this.updateProfile = () => {
            this.setState({ isLoading: true });
            let {name, username, email, uuid, newName, newUsername, newEmail} = this.state;
            const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            if (this.state.isNameEditable && newName === '') {
                // Name field is editable but name has not been changed
                this.setState({ isLoading: false });
                Alert.alert('Error', 'Please change your screen name for updating!', [{
                    text: 'okay',
                }]);
            } else if (this.state.isNameEditable && newName === name) {
                // Name field is editable but name has not been changed
                this.setState({ isLoading: false });
                Alert.alert('Error', 'Please change your screen name for updating!', [{
                    text: 'okay',
                }]);
            } else if (this.state.isUsernameEditable && newUsername === '') {
                // Username field is editable but username has not been changed
                this.setState({ isLoading: false });
                Alert.alert('Error', 'Please change your username for updating!', [{
                    text: 'okay',
                }]);
            } else if (this.state.isUsernameEditable && username === newUsername) {
                // Username is same as before
                this.setState({ isLoading: false });
                Alert.alert('Error', 'Please change your username for updating!', [{
                    text: 'okay',
                }]);
            } else if (this.state.isEmailEditable && newEmail === '') {
                // Email field is editable but email has not been changed
                this.setState({ isLoading: false });
                Alert.alert('Error', 'Please change your email for updating!', [{
                    text: 'okay',
                }]);
            } else if (this.state.isEmailEditable && email === newEmail) {
                // Email is same as before
                this.setState({ isLoading: false });
                Alert.alert('Error', 'Please change your email for updating!', [{
                    text: 'okay',
                }]);
            } else if (this.state.isEmailEditable && !newEmail.match(mailFormat)) {
                // Email format is incorrect
                this.setState({ isLoading: false });
                Alert.alert('Error', 'The email you entered is invalid!', [{
                    text: 'okay',
                }]);
            } else if (!!this.state.isUsernameEditable && (this.state.newUsername.includes('.') || this.state.newUsername.includes('/') ||
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
                this.state.newUsername.includes(',') || this.state.newUsername.includes(' ') ||
                this.state.newUsername.length < 6)) {

                this.setState({ isLoading: false });
                Alert.alert('Error', 'Some fields may have errors!', [{
                    text: 'okay',
                }]);
            } else {
                if (this.state.isNameEditable) {
                    // Name field is editable
                    if (this.state.isUsernameEditable) {
                        // Username field is editable
                        if (this.state.isEmailEditable) {
                        // Email field is editable
                            db.updateProfile(username, uuid, newName, newUsername, newEmail)
                                .then(result => {
                                    this.setState({ isLoading: false });
                                    Alert.alert('Success', 'Your profile has been updated!', [{
                                        text: 'okay',
                                        onPress: () => this.setState({ name: newName, username: newUsername, email: newEmail }, this._onRefresh()),
                                    }]);
                                }, error => {
                                    this.setState({ isLoading: false });
                                    console.warn(error.message);
                                    Alert.alert('Error', 'Please try again!', [{
                                        text: 'okay',
                                    }]);
                                });
                        } else {
                            // Only Name and Username fields are editable
                            db.updateProfile(username, uuid, newName, newUsername, null)
                                .then(result => {
                                    this.setState({ isLoading: false });
                                    Alert.alert('Success', 'Your profile has been updated!', [{
                                        text: 'okay',
                                        onPress: () => this.setState({ name: newName, username: newUsername }, this._onRefresh()),
                                    }]);
                                }, error => {
                                    this.setState({ isLoading: false });
                                    console.warn(error.message);
                                    Alert.alert('Error', 'Please try again!', [{
                                        text: 'okay',
                                    }]);
                                });
                        }
                    } else {
                        if (this.state.isEmailEditable) {
                        // Name and Email fields are editable
                            db.updateProfile(username, uuid, newName, null, newEmail)
                                .then(result => {
                                    this.setState({ isLoading: false });
                                    Alert.alert('Success', 'Your profile has been updated!', [{
                                        text: 'okay',
                                        onPress: () => this.setState({ name: newName, email: newEmail }, this._onRefresh()),
                                    }]);
                                }, error => {
                                    this.setState({ isLoading: false });
                                    console.warn(error.message);
                                    Alert.alert('Error', 'Please try again!', [{
                                        text: 'okay',
                                    }]);
                                });
                        } else {
                            // Only Name field is editable
                            db.updateProfile(username, uuid, newName, null, null)
                                .then(result => {
                                    this.setState({ isLoading: false });
                                    Alert.alert('Success', 'Your profile has been updated!', [{
                                        text: 'okay',
                                        onPress: () => this.setState({ name: newName }, this._onRefresh()),
                                    }]);
                                }, error => {
                                    this.setState({ isLoading: false });
                                    console.warn(error.message);
                                    Alert.alert('Error', 'Please try again!', [{
                                        text: 'okay',
                                    }]);
                                });
                        }
                    }
                } else {
                    // Name field is not editable
                    if (this.state.isUsernameEditable) {
                        // Username field is editable
                        if (this.state.isEmailEditable) {
                            // Username and Email fields are editable
                            db.updateProfile(username, uuid, null, newUsername, newEmail)
                                .then(result => {
                                    this.setState({ isLoading: false });
                                    Alert.alert('Success', 'Your profile has been updated!', [{
                                        text: 'okay',
                                        onPress: () => this.setState({ username: newUsername, email: newEmail }, this._onRefresh()),
                                    }]);
                                }, error => {
                                    this.setState({ isLoading: false });
                                    console.warn(error.message);
                                    Alert.alert('Error', 'Please try again!', [{
                                        text: 'okay',
                                    }]);
                                });
                        } else {
                            // Only username field is editable
                            db.updateProfile(username, uuid, null, newUsername, null)
                                .then(result => {
                                    this.setState({ isLoading: false });
                                    Alert.alert('Success', 'Your profile has been updated!', [{
                                        text: 'okay',
                                        onPress: () => this.setState({ username: newUsername }, this._onRefresh()),
                                    }]);
                                }, error => {
                                    this.setState({ isLoading: false });
                                    console.warn(error.message);
                                    Alert.alert('Error', 'Please try again!', [{
                                        text: 'okay',
                                    }]);
                                });
                        }
                    } else {
                        // Username field is not editable
                        if (this.state.isEmailEditable) {
                            // Only Email field is editable
                            db.updateProfile(username, uuid, null, null, newEmail)
                                .then(result => {
                                    this.setState({ isLoading: false });
                                    Alert.alert('Success', 'Your profile has been updated!', [{
                                        text: 'okay',
                                        onPress: () => this.setState({ email: newEmail }, this._onRefresh()),
                                    }]);
                                }, error => {
                                    this.setState({ isLoading: false });
                                    console.warn(error.message);
                                    Alert.alert('Error', 'Please try again!', [{
                                        text: 'okay',
                                    }]);
                                });
                        } else {
                            // None of the fields are editable
                            this.setState({ isLoading: false });
                            Alert.alert('Oops', 'Please tap on the edit icon to edit a field!', [{
                                text: 'okay',
                            }]);
                        }
                    }
                }
                console.warn('Your new details: ' + this.state.name + this.state.username);
            }
            //     if (this.state.isNameEditable) {
            //         // Name field is editable
            //         if (this.state.isUsernameEditable) {
            //             // Username field is editable
            //             db.updateProfile(username, uuid, newName, newUsername)
            //                 .then(result => {
            //                     this.setState({ isLoading: false });
            //                     Alert.alert('Success', 'Your profile has been updated!', [{
            //                         text: 'okay',
            //                         onPress: () => this.setState({name: newName, username: newUsername}, this._onRefresh()),
            //                     }]);
            //                 }, error => {
            //                     this.setState({ isLoading: false });
            //                     console.warn(error.message);
            //                     Alert.alert('Error', 'Please try again!', [{
            //                         text: 'okay',
            //                     }]);
            //                 });
            //         } else {
            //             // Only Name field is editable
            //             db.updateProfile(username, uuid, newName, null)
            //                 .then(result => {
            //                     this.setState({ isLoading: false });
            //                     Alert.alert('Success', 'Your profile has been updated!', [{
            //                         text: 'okay',
            //                         onPress: () => this.setState({ name: newName }, this._onRefresh()),
            //                     }]);
            //                 }, error => {
            //                     this.setState({ isLoading: false });
            //                     console.warn(error.message);
            //                     Alert.alert('Error', 'Please try again!', [{
            //                         text: 'okay',
            //                     }]);
            //                 });
            //         }
            //     } else {
            //         // Name field is not editable
            //         if (this.state.isUsernameEditable) {
            //             // Only username field is editable
            //             db.updateProfile(username, uuid, null, newUsername)
            //                 .then(result => {
            //                     this.setState({ isLoading: false });
            //                     Alert.alert('Success', 'Your profile has been updated!', [{
            //                         text: 'okay',
            //                         onPress: () => this.setState({ username: newUsername }, this._onRefresh()),
            //                     }]);
            //                 }, error => {
            //                     this.setState({ isLoading: false });
            //                     console.warn(error.message);
            //                     Alert.alert('Error', 'Please try again!', [{
            //                         text: 'okay',
            //                     }]);
            //                 });
            //         } else {
            //             this.setState({ isLoading: false });
            //             Alert.alert('Oops', 'Please tap on the edit icon to edit a field!', [{
            //                 text: 'okay',
            //             }]);
            //         }
            //     }
            //     console.warn('Your new details: ' + this.state.name + this.state.username);
            // }
        };

        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({ isNameEditable: false, isUsernameEditable: false, isEmailEditable: false });
            }
        );
    }

    componentDidMount() {
        this.getUserId()
            .then(result => {
                db.getUser(result.uuid)
                    .then(details => {
                        this.setState({
                            username: details.username, email: details.email, uuid: result.uuid, name: details.name,
                        });
                    }, error => {
                        console.warn('User by the username ' + result + ' was not found!');
                    })
                    .catch(error => console.warn(error.message));
                // Return retrieved username to chained then()
                return result;
            })
            .then(result => {
                console.warn(result.username + ' is the user!!');
                db.getStats(result.uuid)
                    .then(stats => {
                        this.setState({ stats }, () => console.warn(this.state.stats.listedMovies));
                    });
            });
    }

    _onRefresh = () => {
        this.setState({ refreshing: true }, () => {
            this.getUserId()
                .then(result => {
                    db.getStats(result.uuid)
                        .then(result => {
                            this.setState({
                                isNameEditable: !this.state.isNameEditable ? false : false,
                                isUsernameEditable: !this.state.isUsernameEditable ? false : false,
                                isEmailEditable: !this.state.isEmailEditable ? false : false,
                                stats: result,
                                refreshing: false,
                            }, () => console.warn(this.state.stats.listedMovies));
                        }, this.setState({
                            refreshing: false,
                            isNameEditable: !this.state.isNameEditable ? false : false,
                            isUsernameEditable: !this.state.isUsernameEditable ? false : false,
                            isEmailEditable: !this.state.isEmailEditable ? false : false,
                        }))
                        .catch(error => console.warn(error.message));
                })
                .catch(error => console.warn(error.message));
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
                            <View style={!this.state.isNameEditable ? styles.textInputBlurWrapper : styles.textInputActiveWrapper}>
                                <TextInput placeholder="Your Name"
                                    defaultValue={this.state.name}
                                    editable={this.state.isNameEditable}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={newName => this.setState({ newName })}
                                    returnKeyType="done" />
                                <EditIcon name="edit-2"
                                    size={20}
                                    color={this.state.isNameEditable ? '#913d88' : '#67809f'}
                                    onPress={() => this.changeEditable('name')} />
                            </View>
                            <View style={!this.state.isUsernameEditable ? styles.textInputBlurWrapper : styles.textInputActiveWrapper}>
                                <TextInput placeholder="Your Username"
                                    defaultValue={this.state.username}
                                    editable={this.state.isUsernameEditable}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={newUsername => this.setState({ newUsername })}
                                    returnKeyType="done" />
                                <EditIcon name="edit-2"
                                    size={20}
                                    color={this.state.isUsernameEditable ? '#913d88' : '#67809f'}
                                    onPress={() => this.changeEditable('username')} />
                            </View>
                            <View style={!this.state.isEmailEditable ? styles.textInputBlurWrapper : styles.textInputActiveWrapper}>
                                <TextInput placeholder="Your Email"
                                    defaultValue={this.state.email}
                                    editable={this.state.isEmailEditable}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    autoCompleteType="email"
                                    onChangeText={newEmail => this.setState({ newEmail })}
                                    returnKeyType="done" />
                                <EditIcon name="edit-2"
                                    size={20}
                                    color={this.state.isEmailEditable ? '#913d88' : '#67809f'}
                                    onPress={() => this.changeEditable('email')} />
                            </View>
                            <View style={styles.footer}>
                                {usernameLengthErrorTextJsx}
                                {usernameCharErrorTextJsx}
                            </View>
                            <TouchableOpacity style={styles.saveProfileBtn}
                                onPress={() => this.updateProfile()}>
                                <Text style={styles.btnText}>Save Profile</Text>
                                {indicatorJsx}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.changePass}
                                onPress={() =>
                                    this.props.navigation.navigate('ChangePasswordScreen', {
                                        username: this.state.username,
                                        uuid: this.state.uuid,
                                    })
                                }>
                                <Text style={styles.changePassText}>Change your password?</Text>
                            </TouchableOpacity>
                        </View>
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
        backgroundColor: '#913d88',
        height: 63.5,
    },
    headerTitle: {
        color: '#fefefe',
        fontSize: 16,
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
        paddingBottom: 10,
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
    statWrapper: {
        fontSize: 14,
        color: '#22313f',
    },
    statNumber: {
        fontSize: 18,
        color: '#67809f',
    },
    profileIcon: {
        margin: 25,
        color: '#34495e',
    },
    changePassText: {
        color: '#963694',
        marginTop: 25,
    },
    textInputBlurWrapper: {
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
    textInputActiveWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#963694',
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
        backgroundColor: '#963694',
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
