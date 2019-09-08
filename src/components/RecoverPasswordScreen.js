import React, { Component } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

import CustomSnackbar from '../util/Snackbar';
import db from '../db/db_exp.js';
import netCon from '../util/NetCon.js';


export default class ResetPasswordScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Recover Password',
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            email: '',
        };

        this.genEmailIconJsx = () => {
            if (this.state.email.length === 0) {
                return (
                    <Feather name="at-sign" size={25} color="#ddd" />
                );
            } else {
                return (
                    <Feather name="at-sign" size={25} color="#963694" />
                );
            }
        };

        this.checkEmail = () => {
            netCon.checkNetCon()
                .then(success => {
                    // Internet connection is available
                    const {
                        email,
                    } = this.state;

                    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

                    if (email === '') {
                        this.setState({ isLoading: false });
                        CustomSnackbar.showSnackBar('You haven\'t entered your email!', 'long', '#e74c3c', 'OK');
                    } else if (!email.match(mailFormat)) {
                        this.setState({ isLoading: false });
                        CustomSnackbar.showSnackBar('You entered an invalid email!', 'long', '#e74c3c', 'OK');

                    } else {
                        db.checkEmail(email)
                            .then(results => {
                                // Email is registered
                                this.mailCode()
                                    .then(recoveryCode => {
                                        console.warn(recoveryCode + ' is the recovery code!');
                                        this.props.navigation.navigate('ResetPassword', {
                                            code: recoveryCode,
                                            email,
                                        });
                                    }, error => {
                                            CustomSnackbar.showSnackBar('An error occurred. Please try again!', 'long', '#e74c3c', 'OK');
                                            console.warn('Some error occurred in mailCode() ' + error);
                                    });
                            }, error => {
                                    // Email is not registered
                                    this.setState({ isLoading: false });
                                    CustomSnackbar.showSnackBar('The email is not registered!', 'long', '#e74c3c', 'OK');
                            });
                    }
                })
                .catch(error => console.warn(error.message));
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
                db.mailer(this.state.email, 'Recovery Code', 'Your recovery code is: ' + ranString)
                    .then(success => {
                        console.warn('Mailed successfully!');
                        resolve(ranString);
                    }, error => {
                        console.warn('Mail could not be sent!');
                        reject(false);
                    });
            });
        };

        this.sendCodeHandler = () => {
            this.setState({ isLoading: true });
            this.checkEmail();
        };
    }

    render() {
        let indicatorJsx = this.state.isLoading ?
            <ActivityIndicator size="small" color="#fefefe"
                style={styles.indicator} /> : <View style={styles.emptyView} />;

        let emailIconJsx = this.genEmailIconJsx();

        return (
            <View style={styles.metaContainer}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.container}>
                        <View style={styles.changePasswordContainer}>
                            <MCIcons name="textbox-password" size={80} color="#34495e" style={styles.passwordIcon} />
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>A password recovery code will be emailed to you.</Text>
                            </View>
                            <View style={styles.metaWrapper}>
                                <View style={styles.passwordWrapper}>
                                    <TextInput placeholder="Email"
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        onChangeText={email => this.setState({ email })}
                                        returnKeyType="done"
                                        keyboardType="email-address"
                                        autoCompleteType="email"
                                        onSubmitEditing={this.sendCodeHandler} />
                                    {emailIconJsx}
                                </View>
                            </View>
                            <TouchableOpacity style={styles.sendCodeBtn}
                                onPress={() => this.sendCodeHandler()}>
                                <Text style={styles.btnText}>Send Code</Text>
                                {indicatorJsx}
                            </TouchableOpacity>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>The email you provide should be associated with your username.</Text>
                                <Text style={styles.infoText}>Do not share your recovery codes to anyone else.</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bgImage: {
        width: '100%',
        height: '100%',
        flex: 1,
    },
    container: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    changePasswordContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 20,
        flex: 1,
        alignItems: 'center',
        marginBottom: 10,
    },
    infoContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flex: 1,
        width: '100%',
    },
    passwordIcon: {
        margin: 25,
        color: '#34495e',
    },
    metaWrapper: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 25,
        width: '100%',
    },
    passwordWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        paddingLeft: 20,
        paddingRight: 20,
    },
    noBorderPasswordWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    progressBar: {
        width: '100%',
        height: 1.2,
    },
    horizontalRule: {
        borderBottomWidth: 1,
        width: '100%',
        borderColor: '#ddd',
    },
    errorWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#e74c3c',
        paddingLeft: 20,
        paddingRight: 20,
    },
    textInput: {
        marginRight: 10,
        flex: 5,
        minHeight: '6%',
    },
    sendCodeBtn: {
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
        marginTop: 20,
    },
    errorText: {
        color: '#e74c3c',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 13,
        marginBottom: 15,
    },
    infoText: {
        fontSize: 13,
        color: '#6c7a89',
        textAlign: 'center',
        marginBottom: 15,
    },
    highlight: {
        color: '#67809f',
    },
});
