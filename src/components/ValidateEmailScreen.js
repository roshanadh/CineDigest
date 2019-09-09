import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Dimensions,
} from 'react-native';

import { responsiveFontSize } from 'react-native-responsive-dimensions';
import FeatherIcon from 'react-native-vector-icons/Feather';

import CustomSnackbar from '../util/Snackbar';
import db from '../db/db_exp.js';
import { onSignIn } from '../auth/auth';
import netCon from '../util/NetCon.js';

const { height } = Dimensions.get('window');
const btnHeight = height <= 640 ? 0.07 * height : 0.06 * height;

export default class ValidateEmailScreen extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: false,
            name: '',
            email: '',
            username: '',
            code: '',
            userEnteredCode: '',
        };

        this.genKeyIconJsx = () => {
            if (this.state.userEnteredCode.length === 0) {
                return (
                    <FeatherIcon name="key" size={25} color="#ddd" />
                );
            } else {
                return (
                    <FeatherIcon name="key" size={25} color="#963694" />
                );
            }
        };

        this.initState = () => {
            const name = this.props.navigation.getParam('name', null);
            const email = this.props.navigation.getParam('email', null);
            const username = this.props.navigation.getParam('username', null);
            const uuid = this.props.navigation.getParam('uuid', null);
            this.setState({ name, email, username, uuid }, () => {
                this.mailCode()
                    .then(validationCode => {
                        console.warn(validationCode + ' is the validation code!');
                    }, error => {
                        console.warn('Some error occurred in mailCode()');
                    });
            });
        };

        this.validateHandler = () => {
            netCon.checkNetCon()
                .then(success => {
                    // Internet connection available
                    this.setState({ isLoading: true }, () => {
                        const { code, userEnteredCode } = this.state;
                        console.warn(code + ' is the code!');
                        console.warn(userEnteredCode + ' is the entered!');
                        if (code !== userEnteredCode) {
                            this.setState({ isLoading: false });
                            console.warn('Wrong code');
                            CustomSnackbar.showSnackBar('The validation code was incorrect!', 'long', '#e74c3c', 'OK');
                        } else {
                            console.warn('Correct code!');
                            db.validateUser(this.state.username, this.state.email)
                                .then(result => {
                                    console.warn(this.state.username + ' validated!');
                                    this.setState({ isLoading: false });
                                    CustomSnackbar.showSnackBar('Your email has been validated!', 'long', '#3fc380', null);
                                    // User will be signed-in
                                    onSignIn(this.state.username, this.state.uuid)
                                        .then(() => props.navigation.navigate('SignedIn'))
                                        .catch(error => console.warn(error.message));
                                }, error => {
                                    console.warn('Could not validate!');
                                });
                        }
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
                db.mailer(this.state.email, 'Validation Code', 'Your validation code is: ' + ranString)
                    .then(success => {
                        console.warn('Mailed successfully!');
                        resolve(ranString);
                    }, error => {
                        console.warn('Mail could not be sent!');
                        reject(false);
                    });
            });
        };

        this.redirectToSignIn = () => {
            // User will be signed-in
            netCon.checkNetCon()
                .then(success => {
                    // Internet connection available
                    onSignIn(this.state.username, this.state.uuid)
                        .then(() => props.navigation.navigate('SignedIn'))
                        .catch(error => console.warn(error.message));

                }, error => {
                    // Internet connection unavailable
                    CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                });
        };
    }

    componentDidMount() {
        this.initState();
    }

    render() {
        let keyIconJsx = this.genKeyIconJsx();
        let indicatorJsx = this.state.isLoading ?
            <ActivityIndicator size="small" color="#fefefe"
                style={styles.indicator} /> : null;
        return (
            <View style={styles.metaContainer}>
                <StatusBar barStyle="dark-content"
                    translucent={true}
                    backgroundColor="rgba(255, 255, 255, 1)"
                />
                <ScrollView>
                    <View style={styles.container}>
                        <Text style={styles.welcomeText}>Cine Digest</Text>

                        <Text style={styles.infoText}>Please validate your email using the code you have received at {this.state.email}.</Text>
                        <View style={styles.metaWrapper}>
                            <View style={styles.codeWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Validation Code"
                                    autoCapitalize="characters"
                                    onChangeText={(userEnteredCode) => this.setState({ userEnteredCode })}
                                    returnKeyType="done"
                                    onSubmitEditing={this.validateHandler} />
                                {keyIconJsx}
                            </View>
                        </View>
                        <TouchableOpacity style={styles.validateBtn}
                            onPress={this.validateHandler}>
                            <Text style={styles.btnText}>Validate</Text>
                            {indicatorJsx}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.signInBtn}
                            onPress={() => this.redirectToSignIn()}>
                            <Text style={styles.signInText}>
                                Just Sign Me In
							</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('SignUp', {
                                name: this.state.name,
                                username: this.state.username,
                                email: this.state.email,
                                signUpBtnText: 'Update Email',
                                isFieldEditable: false,
                                shouldUpdate: true,
                            });
                        }}>
                            <Text style={styles.changeEmailText}>Not you? Change your email</Text>
                        </TouchableOpacity>
                        <Text style={styles.infoText}>You will not be able to recover a lost password unless you validate your email.</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    metaContainer: {
        backgroundColor: '#fff',
        height: '100%',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
    },
    welcomeText: {
        fontSize: responsiveFontSize(6),
        fontFamily: 'Quicksand-Light',
        width: '100%',
        marginBottom: 40,
        textAlign: 'center',
        color: '#963694',
        textShadowColor: '#aaa',
        textShadowRadius: 6,
    },
    infoText: {
        textAlign: 'center',
        color: '#6c7a89',
    },
    metaWrapper: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 25,
        width: '100%',
    },
    codeWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    input: {
        marginRight: 10,
        flex: 5,
        minHeight: '6%',
    },
    validateBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 50,
        marginTop: 30,
        padding: 15,
        minHeight: btnHeight,
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
    signInBtn: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 50,
        padding: 15,
        width: '80%',
        borderWidth: 1,
        borderColor: '#963694',
    },
    signInText: {
        color: '#963694',
    },
    changeEmailText: {
        margin: 30,
        color: '#963694',
        textAlign: 'center',
    },
});
