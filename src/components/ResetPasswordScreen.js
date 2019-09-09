import React, { Component } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Alert,
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
            userEnteredCode: '',
            code: '',
            email: '',
        };

        this.initState = () => {
            this.setState({
                email: this.props.navigation.getParam('email'),
                code: this.props.navigation.getParam('code'),
            });
        };

        this.genTextIconJsx = () => {
            if (this.state.userEnteredCode.length === 0) {
                return (
                    <MCIcons name="format-text" size={25} color="#ddd" />
                );
            } else {
                return (
                    <MCIcons name="format-text" size={25} color="#963694" />
                );
            }
        };

        this.checkCode = () => {
            netCon.checkNetCon()
                .then(success => {
                    // Internet connection is available
                    const {
                        code,
                        userEnteredCode,
                        email,
                    } = this.state;
                    if (userEnteredCode === '') {
                        this.setState({ isLoading: false });
                        CustomSnackbar.showSnackBar('You haven\'t entered the code!', 'long', '#e74c3c', 'OK');
                    } else if (userEnteredCode !== code) {
                        this.setState({ isLoading: false });
                        CustomSnackbar.showSnackBar('The validation code is incorrect!', 'long', '#e74c3c', 'OK');
                    } else {
                        db.resetPassword(email)
                            .then(results => {
                                // Successfully reset
                                this.setState({ isLoading: false });
                                CustomSnackbar.showSnackBar('Your password has been reset!', 'always', '#3fc380', 'OK');
                                this.props.navigation.navigate('SignIn');
                            }, error => {
                                    // Couldn't reset password
                                    this.setState({ isLoading: false });
                                    if (error.status === 'NO-PERMISSION') {
                                        CustomSnackbar.showSnackBar('Permission denied from server!', 'long', '#e74c3c', 'OK');
                                    } else {
                                        CustomSnackbar.showSnackBar('An error occurred. Please try again!', 'long', '#e74c3c', 'OK');
                                        Alert.alert('Error', error.status);
                                    }
                            })
                            .catch(error => console.warn(error.message));
                    }
                })
                .catch(error => console.warn(error.message));
        };

        this.resetPassHandler = () => {
            this.setState({ isLoading: true });
            this.checkCode();
        };
    }

    componentDidMount() {
        this.initState();
    }

    render() {
        let indicatorJsx = this.state.isLoading ?
            <ActivityIndicator size="small" color="#fefefe"
                style={styles.indicator} /> : <View style={styles.emptyView} />;

        let textIconJsx = this.genTextIconJsx();

        return (
            <View style={styles.metaContainer}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.container}>
                        <View style={styles.changePasswordContainer}>
                            <MCIcons name="textbox-password" size={80} color="#34495e" style={styles.passwordIcon} />
                            <View style={styles.metaWrapper}>
                                <View style={styles.passwordWrapper}>
                                    <TextInput placeholder="Code"
                                        style={styles.textInput}
                                        autoCapitalize="characters"
                                        onChangeText={userEnteredCode => this.setState({ userEnteredCode })}
                                        returnKeyType="done"
                                        onSubmitEditing={this.resetPassHandler} />
                                    {textIconJsx}
                                </View>
                            </View>
                            <TouchableOpacity style={styles.resetPassBtn}
                                onPress={() => this.resetPassHandler()}>
                                <Text style={styles.btnText}>Reset Password</Text>
                                {indicatorJsx}
                            </TouchableOpacity>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>If your recovery code is correct, your password will be reset.</Text>
                                <Text style={styles.infoText}>A temporary password will be emailed at {this.state.email}.</Text>
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
    resetPassBtn: {
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
