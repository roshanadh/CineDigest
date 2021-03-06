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
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Pie from 'react-native-pie';

import netCon from '../util/NetCon';
import CustomSnackbar from '../util/Snackbar';
import db from '../db/db_exp';

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isValidatedLoading: false,
            refreshing: false,
            isNameEditable: false,
            isUsernameEditable: false,
            isEmailEditable: false,
            name: '',
            username: '',
            email: '',
            uuid: '',
            validatedStatus: true,
            stats: {},
            newName: '',
            newUsername: '',
            newEmail: '',
            code: '',
            userEnteredCode: '',
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
            netCon.checkNetCon()
                .then(success => {
                    // Internet connection available
                    switch (field) {
                        case 'name':
                            this.setState({ isNameEditable: !this.state.isNameEditable });
                            break;
                        case 'username':
                            this.setState({ isUsernameEditable: !this.state.isUsernameEditable });
                            break;
                        case 'email':
                            this.setState({ isEmailEditable: !this.state.isEmailEditable });
                            break;
                        default: null;
                    }
                }, error => {
                    // Internet connection unavailable
                    CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                });
        };

        this.updateProfile = () => {
            this.setState({ isLoading: true });
            let {name, username, email, uuid, newName, newUsername, newEmail} = this.state;
            const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            if (this.state.isNameEditable && newName === '') {
                // Name field is editable but name has not been changed
                this.setState({ isLoading: false });
                CustomSnackbar.showSnackBar('You haven\'t changed your name!', 'long', '#e74c3c', 'OK');
            } else if (this.state.isNameEditable && newName === name) {
                // Name field is editable but name has not been changed
                this.setState({ isLoading: false });
                CustomSnackbar.showSnackBar('You haven\'t changed your name!', 'long', '#e74c3c', 'OK');
            } else if (this.state.isUsernameEditable && newUsername === '') {
                // Username field is editable but username has not been changed
                this.setState({ isLoading: false });
                CustomSnackbar.showSnackBar('You haven\'t changed your username!', 'long', '#e74c3c', 'OK');
            } else if (this.state.isUsernameEditable && username === newUsername) {
                // Username is same as before
                this.setState({ isLoading: false });
                CustomSnackbar.showSnackBar('You haven\'t changed your username!', 'long', '#e74c3c', 'OK');
            } else if (this.state.isEmailEditable && newEmail === '') {
                // Email field is editable but email has not been changed
                this.setState({ isLoading: false });
                CustomSnackbar.showSnackBar('You haven\'t changed your email!', 'long', '#e74c3c', 'OK');
            } else if (this.state.isEmailEditable && email === newEmail) {
                // Email is same as before
                this.setState({ isLoading: false });
                CustomSnackbar.showSnackBar('You haven\'t changed your email!', 'long', '#e74c3c', 'OK');
            } else if (this.state.isEmailEditable && !newEmail.match(mailFormat)) {
                // Email format is incorrect
                this.setState({ isLoading: false });
                CustomSnackbar.showSnackBar('The entered email is invalid!', 'long', '#e74c3c', 'OK');
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
                CustomSnackbar.showSnackBar('Some fields may have error!', 'long', '#e74c3c', 'OK');
            } else {
                if (this.state.isNameEditable) {
                    // Name field is editable
                    if (this.state.isUsernameEditable) {
                        // Username field is editable
                        if (this.state.isEmailEditable) {
                            // Email field is editable
                            db.updateProfile(username, uuid, newName, newUsername, newEmail)
                                .then(result => {
                                    this.setState({ validatedStatus: false });
                                    this.setState({ isLoading: false }, () => {
                                        this.mailCode()
                                            .then(validationCode => {
                                                console.warn(validationCode + ' is the validation code!');
                                                CustomSnackbar.showSnackBar('Validation code has been mailed!', 'short', '#3fc380', null);
                                            }, error => {
                                                this.setState({ isLoading: false });
                                                console.warn('Some error occurred in mailCode()');
                                            });
                                    });
                                    Alert.alert('Success', 'Your profile has been updated!', [{
                                        text: 'okay',
                                        onPress: () => this.setState({ name: newName, username: newUsername, email: newEmail }, this._onRefresh()),
                                    }]);
                                }, error => {
                                        this.setState({ isLoading: false });
                                        console.warn(error.message);
                                        if (error.status === 'ER_DUP_ENTRY') {
                                            if (error.message.includes('email')) {
                                                CustomSnackbar.showSnackBar('The email is already in use!', 'long', '#e74c3c', 'OK');
                                            } else {
                                                CustomSnackbar.showSnackBar('The username is already in use!', 'long', '#e74c3c', 'OK');
                                            }
                                        } else {
                                            CustomSnackbar.showSnackBar('Some error occurred. Please try again!', 'long', '#e74c3c', 'OK');
                                        }
                                });
                        } else {
                            // Only Name and Username fields are editable
                            db.updateProfile(username, uuid, newName, newUsername, null)
                                .then(result => {
                                    this.setState({ isLoading: false }, () => {
                                        this.mailCode()
                                            .then(validationCode => {
                                                console.warn(validationCode + ' is the validation code!');
                                                CustomSnackbar.showSnackBar('Validation code has been mailed!', 'short', '#3fc380', null);
                                            }, error => {
                                                this.setState({ isLoading: false });
                                                console.warn('Some error occurred in mailCode()');
                                            });
                                    });
                                    CustomSnackbar.showSnackBar('Your profile has been updated!', 'long', '#3fc380', null);
                                }, error => {
                                        this.setState({ isLoading: false });
                                        console.warn(error.message);
                                        if (error.status === 'ER_DUP_ENTRY') {
                                            CustomSnackbar.showSnackBar('The username is already in use!', 'long', '#e74c3c', 'OK');
                                        } else {
                                            CustomSnackbar.showSnackBar('Some error occurred. Please try again!', 'long', '#e74c3c', 'OK');
                                        }
                                });
                        }
                    } else {
                        if (this.state.isEmailEditable) {
                            // Name and Email fields are editable
                            db.updateProfile(username, uuid, newName, null, newEmail)
                                .then(result => {
                                    this.setState({ validatedStatus: false });
                                    this.setState({ isLoading: false }, () => {
                                        this.mailCode()
                                            .then(validationCode => {
                                                console.warn(validationCode + ' is the validation code!');
                                                CustomSnackbar.showSnackBar('Validation code has been mailed!', 'short', '#3fc380', null);
                                            }, error => {
                                                this.setState({ isLoading: false });
                                                console.warn('Some error occurred in mailCode()');
                                            });
                                    });
                                    CustomSnackbar.showSnackBar('Your profile has been updated!', 'long', '#3fc380', null);
                                }, error => {
                                        this.setState({ isLoading: false });
                                        console.warn(error.message);
                                        if (error.status === 'ER_DUP_ENTRY') {
                                            CustomSnackbar.showSnackBar('The email is already registered!', 'long', '#e74c3c', 'OK');
                                        } else {
                                            CustomSnackbar.showSnackBar('Some error occurred. Please try again!', 'long', '#e74c3c', 'OK');
                                        }
                                });
                        } else {
                            // Only Name field is editable
                            db.updateProfile(username, uuid, newName, null, null)
                                .then(result => {
                                    this.setState({ isLoading: false });
                                    CustomSnackbar.showSnackBar('Your profile has been updated!', 'long', '#3fc380', null);
                                }, error => {
                                        this.setState({ isLoading: false });
                                        console.warn(error.message);
                                        CustomSnackbar.showSnackBar('Some error occurred. Please try again!', 'long', '#e74c3c', 'OK');
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
                                    this.setState({ validatedStatus: false });
                                    this.setState({ isLoading: false }, () => {
                                        this.mailCode()
                                            .then(validationCode => {
                                                console.warn(validationCode + ' is the validation code!');
                                                CustomSnackbar.showSnackBar('Validation code has been mailed!', 'short', '#3fc380', null);
                                            }, error => {
                                                this.setState({ isLoading: false });
                                                console.warn('Some error occurred in mailCode()');
                                            });
                                    });
                                    CustomSnackbar.showSnackBar('Your profile has been updated!', 'long', '#3fc380', null);
                                }, error => {
                                        this.setState({ isLoading: false });
                                        console.warn(error.message);
                                        if (error.status === 'ER_DUP_ENTRY') {
                                            if (error.message.includes('email')) {
                                                CustomSnackbar.showSnackBar('The email is already in use!', 'long', '#e74c3c', 'OK');
                                            } else {
                                                CustomSnackbar.showSnackBar('The username is already in use!', 'long', '#e74c3c', 'OK');
                                            }
                                        } else {
                                            CustomSnackbar.showSnackBar('Some error occurred. Please try again!', 'long', '#e74c3c', 'OK');
                                        }
                                });
                        } else {
                            // Only username field is editable
                            db.updateProfile(username, uuid, null, newUsername, null)
                                .then(result => {
                                    this.setState({ isLoading: false });
                                    CustomSnackbar.showSnackBar('Your profile has been updated!', 'long', '#3fc380', null);
                                }, error => {
                                        this.setState({ isLoading: false });
                                        console.warn(error.message);
                                        if (error.status === 'ER_DUP_ENTRY') {
                                            CustomSnackbar.showSnackBar('The username is already in use!', 'long', '#e74c3c', 'OK');
                                        } else {
                                            CustomSnackbar.showSnackBar('Some error occurred. Please try again!', 'long', '#e74c3c', 'OK');
                                        }
                                });
                        }
                    } else {
                        // Username field is not editable
                        if (this.state.isEmailEditable) {
                            // Only Email field is editable
                            db.updateProfile(username, uuid, null, null, newEmail)
                                .then(result => {
                                    this.setState({ validatedStatus: false });
                                    this.setState({ isLoading: false }, () => {
                                        this.mailCode()
                                            .then(validationCode => {
                                                console.warn(validationCode + ' is the validation code!');
                                                CustomSnackbar.showSnackBar('Validation code has been mailed!', 'short', '#3fc380', null);
                                            }, error => {
                                                this.setState({ isLoading: false });
                                                console.warn('Some error occurred in mailCode()');
                                            });
                                    });
                                    CustomSnackbar.showSnackBar('Your profile has been updated!', 'long', '#3fc380', null);
                                }, error => {
                                        this.setState({ isLoading: false });
                                        console.warn(error.message);
                                        if (error.status === 'ER_DUP_ENTRY') {
                                            CustomSnackbar.showSnackBar('The email is already registered!', 'long', '#e74c3c', 'OK');
                                        } else {
                                            CustomSnackbar.showSnackBar('Some error occurred. Please try again!', 'long', '#e74c3c', 'OK');
                                        }
                                });
                        } else {
                            // None of the fields are editable
                            this.setState({ isLoading: false });
                            CustomSnackbar.showSnackBar('Please tap on an edit icon to edit a field!', 'long', '#f9690e', 'OK');
                        }
                    }
                }
                console.warn('Your new details: ' + this.state.name + this.state.username);
            }
        };

        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({ isNameEditable: false, isUsernameEditable: false, isEmailEditable: false });
            }
        );

        this.validateHandler = () => {
            netCon.checkNetCon()
                .then(success => {
                    // Internet connection available
                    this.setState({ isValidatedLoading: true });
                    const { code, userEnteredCode } = this.state;
                    console.warn(code + ' is the code!');
                    console.warn(userEnteredCode + ' is the entered!');
                    if (code !== userEnteredCode) {
                        this.setState({ isValidatedLoading: false });
                        CustomSnackbar.showSnackBar('The validation code is incorrect!', 'long', '#f9690e', 'OK');
                        console.warn('Wrong code');
                    } else {
                        console.warn('Correct code!');
                        db.validateUser(this.state.username, this.state.email)
                            .then(result => {
                                console.warn(this.state.username + ' validated!');
                                CustomSnackbar.showSnackBar('Your email has been validated!', 'long', '#3fc380', null);
                                this.setState({ validatedStatus: true, isValidatedLoading: false });
                            }, error => {
                                console.warn('Could not validate!');
                                console.warn(error);
                            });
                    }
                }, error => {
                    // Internet connection unavailable
                    CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                });
        };

        this.resendCode = () => {
            netCon.checkNetCon()
                .then(success => {
                    // Internet connection available
                    this.mailCode()
                        .then(validationCode => {
                            console.warn(validationCode + ' is the validation code!');
                            CustomSnackbar.showSnackBar('Validation code has been resent!', 'short', '#3fc380', null);
                        }, error => {
                            console.warn('Some error occurred in mailCode()');
                        });
                }, error => {
                    // Internet connection unavailable
                    CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                });
        };

        this.genCode = () => {
            let string = Math.random().toString(26).replace('.', '');
            let ranString = '';
            if (string.length > 6) {
                ranString = string.substring(0, 6);
            } else if (string.length < 6) {
                switch (string.length) {
                    case 0:
                        ranString = 'abc023';
                        break;
                    case 1:
                        ranString = string + '123ab';
                        break;
                    case 2:
                        ranString = string + 'aef4';
                        break;
                    case 3:
                        ranString = string + 'r0w';
                        break;
                    case 4:
                        ranString = string + '1a';
                        break;
                    case 5:
                        ranString = string + '1';
                        break;
                    default:
                        null;
                }
            } else {
                ranString = string;
            }
            this.setState({ code: ranString.toUpperCase() });
            return ranString.toUpperCase();
        };

        this.mailCode = () => {
            return new Promise((resolve, reject) => {
                let ranString = this.genCode();
                console.warn(ranString);
                db.mailer(this.state.newEmail.trim().length !== 0 ? this.state.newEmail : this.state.email,
                    'Validation Code',
                    'Your one-time validation code is: ' + ranString
                    + '\nTHIS CODE WILL BE DISCARDED IF YOU SIGNIN STRAIGHT AWAY. '
                    + 'IF YOU CANNOT VALIDATE USING THIS CODE, TRY RESENDING THE CODE!'
                )
                    .then(success => {
                        console.warn('Mailed successfully!');
                        resolve(ranString);
                    }, error => {
                        console.warn('Mail could not be sent!');
                        reject(false);
                    })
                    .catch(error => {
                        console.warn(error);
                        CustomSnackbar.showSnackBar('An error occurred. Please try again later', 'always', '#e74c3c', 'OK');
                    });
            });
        };

        this.genStatJsx = (usernameLengthErrorTextJsx, usernameCharErrorTextJsx, keyIconJsx, validatedIndicatorJsx) => {
            if (usernameLengthErrorTextJsx !== null || usernameCharErrorTextJsx !== null) {
                return (
                    <View style={styles.statsContainer}>
                        {usernameLengthErrorTextJsx}
                        {usernameCharErrorTextJsx}
                    </View>
                );
            } else {
                // No errors
                if (this.state.validatedStatus) {
                    // Display stats for user
                    const {
                        listedMovies,
                        listedShows,
                        listedInWishMovies,
                        listedInWishShows,
                        listedInWatchedMovies,
                        listedInWatchedShows,
                        listedInWatchingShows,
                    } = this.state.stats;

                    const moviesSeries = [(listedInWishMovies / listedMovies) * 100, (listedInWatchedMovies / listedMovies) * 100];
                    const showsSeries = [(listedInWishShows / listedShows) * 100, (listedInWatchedShows / listedShows) * 100, (listedInWatchingShows / listedShows) * 100];

                    const moviesPieJsx =
                        this.state.stats.listedMovies > 0 ?
                            <View style={styles.pieContainer}>
                                <Pie
                                    radius={80}
                                    innerRadius={60}
                                    series={moviesSeries}
                                    colors={['#019875', '#22a7f0']}
                                    backgroundColor={'#000'} />
                                <View style={styles.moviePieInfo}>
                                    <Text style={styles.pieInfoText}>Movies</Text>
                                </View>
                            </View> : null;

                    const showsPieJsx =
                        this.state.stats.listedShows > 0 ?
                            <View style={styles.pieContainer}>
                                <Pie
                                    radius={80}
                                    innerRadius={60}
                                    series={showsSeries}
                                    colors={['#019875', '#22a7f0', '#f27935']}
                                    backgroundColor={'#000'} />
                                <View style={styles.showPieInfo}>
                                    <Text style={styles.pieInfoText}>Shows</Text>
                                </View>
                            </View> : null;
                    return (
                        listedMovies + listedShows +
                        listedInWishMovies + listedInWishShows +
                        listedInWatchedMovies + listedInWatchedShows +
                        listedInWatchingShows > 0 ?
                            <View style={styles.statsContainer}>
                                <Text style={styles.statsHeader}>We thought you'd like some pies!</Text>
                                <View style={styles.graphicsMetaContainer}>
                                    {moviesPieJsx}
                                    {showsPieJsx}
                                </View>
                                <View style={styles.indexContainer}>
                                    <View style={styles.pieIndex}>
                                        <View style={{ ...styles.indexColor, backgroundColor: '#22a7f0' }} />
                                        <Text style={styles.gaugeText}>Wish List</Text>
                                    </View>
                                    <View style={styles.pieIndex}>
                                        <View style={{ ...styles.indexColor, backgroundColor: '#019875' }} />
                                        <Text style={styles.gaugeText}>Watched List</Text>
                                    </View>
                                    <View style={styles.pieIndex}>
                                        <View style={{ ...styles.indexColor, backgroundColor: '#f27935' }} />
                                        <Text style={styles.gaugeText}>Watching List</Text>
                                    </View>
                                </View>
                            </View> : null
                    );
                } else {
                    // Display email validation form
                    return (
                        <View style={styles.statsContainer}>
                            <Text style={styles.infoText}>Please validate your email using the code you have received at {this.state.newEmail.trim().length !== 0 ? this.state.newEmail : this.state.email}.</Text>
                            <View style={styles.textInputActiveWrapper}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Validation Code"
                                    autoCapitalize="characters"
                                    onChangeText={(userEnteredCode) => this.setState({ userEnteredCode })}
                                    returnKeyType="done"
                                    onSubmitEditing={this.validateHandler} />
                                {keyIconJsx}
                            </View>
                            <TouchableOpacity style={styles.saveProfileBtn}
                                onPress={this.validateHandler}>
                                <Text style={styles.btnText}>Validate</Text>
                                {validatedIndicatorJsx}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.resend} onPress={this.resendCode}>
                                <Text style={styles.resendText}>Resend Code</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }
            }
        };
    }

    componentDidMount() {
        this.getUserId()
            .then(result => {
                db.getUser(result.uuid)
                    .then(details => {
                        console.warn(details);
                        this.setState({
                            username: details.username, email: details.email, uuid: result.uuid, name: details.name, validatedStatus: details.validatedStatus,
                        }, () => console.warn('The username is ' + this.state.username + ' validated status is: ' + this.state.validatedStatus));
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
                        .then(stats => {
                            this.setState({
                                isNameEditable: !this.state.isNameEditable ? false : false,
                                isUsernameEditable: !this.state.isUsernameEditable ? false : false,
                                isEmailEditable: !this.state.isEmailEditable ? false : false,
                                stats,
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
        let keyIconJsx = this.state.code.length > 0 ?
            <FeatherIcon name="key" size={25} color="#ddd" /> :
            <FeatherIcon name="key" size={25} color="#963694" />;

        let indicatorJsx = this.state.isLoading ?
            <ActivityIndicator size="small" color="#fefefe"
                style={styles.indicator} /> : null;

        let validatedIndicatorJsx = this.state.isValidatedLoading ?
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

        let statJsx = this.genStatJsx(usernameLengthErrorTextJsx, usernameCharErrorTextJsx, keyIconJsx, validatedIndicatorJsx);

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
                                <FeatherIcon name="edit-2"
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
                                <FeatherIcon name="edit-2"
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
                                <FeatherIcon name="edit-2"
                                    size={20}
                                    color={this.state.isEmailEditable ? '#913d88' : '#67809f'}
                                    onPress={() => this.changeEditable('email')} />
                            </View>
                            <TouchableOpacity style={styles.saveProfileBtn}
                                onPress={() => {
                                    netCon.checkNetCon()
                                        .then(success => {
                                            // Internet connection available
                                            this.updateProfile();
                                        }, error => {
                                            // Internet connection unavailable
                                            CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                                        });
                                }
                            }>
                                <Text style={styles.btnText}>Save Profile</Text>
                                {indicatorJsx}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.changePass}
                                onPress={() =>
                                    netCon.checkNetCon()
                                        .then(success => {
                                            // Internet connection available
                                            this.props.navigation.navigate('ChangePasswordScreen', {
                                                username: this.state.username,
                                                uuid: this.state.uuid,
                                            });
                                        }, error => {
                                            // Internet connection unavailable
                                            CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
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
        width: '100%',
        padding: 20,
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    graphicsMetaContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsHeader: {
        fontSize: 13,
        color: '#34495e',
        textAlign: 'center',
        marginBottom: 15,
    },
    pieContainer: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    moviePieInfo: {
        position: 'absolute',
        width: 100,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
    },
    showPieInfo: {
        position: 'absolute',
        width: 100,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pieInfoText: {
        backgroundColor: 'transparent',
        color: '#67809f',
        fontSize: 14,
    },
    indexContainer: {
        margin: 20,
    },
    pieIndex: {
        marginVertical: 10,
        flexDirection: 'row',
    },
    indexColor: {
        marginRight: 8,
        width: 10,
        borderRadius: 100,
    },
    gauge: {
        marginTop: 20,
    },
    gaugeText: {
        backgroundColor: 'transparent',
        color: '#67809f',
        fontSize: 12,
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
        width: '80%',
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
    infoText: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#6c7a89',
    },
    resend: {
        alignItems: 'center',
        marginTop: 20,
        margin: 10,
    },
    resendText: {
        color: '#963694',
    },
});
