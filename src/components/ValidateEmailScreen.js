import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    Text,
    StyleSheet,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Image,
    StatusBar,
    Dimensions,
} from 'react-native';

import FeatherIcon from 'react-native-vector-icons/Feather';

import CustomSnackbar from '../util/Snackbar';
import db from '../db/db_exp.js';
import netCon from '../util/NetCon.js';

const { width, height } = Dimensions.get('window');
const btnHeight = height <= 640 ? 0.07 * height : 0.06 * height;
const btnWidth = width <= 360 ? 0.4 * width : 0.3 * width;

export default class SignUpScreen extends Component {
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
            if (this.state.code.length === 0) {
                return (
                    <FeatherIcon name="key" size={25} color="#ddd" />
                );
            } else {
                return (
                    <FeatherIcon name="key" size={25} color="#22a7f0" />
                );
            }
        };

        this.initState = () => {
            const name = this.props.navigation.getParam('name', null);
            const email = this.props.navigation.getParam('email', null);
            const username = this.props.navigation.getParam('username', null);
            this.setState({ name, email, username }, () => {
                this.mailCode()
                    .then(validationCode => {
                        console.warn(validationCode + ' is the validation code!');
                    }, error => {
                        this.setState({ isLoading: false });
                        console.warn('Some error occurred in mailCode()');
                    });
            });
        };

        this.validateHandler = () => {
            this.setState({ isLoading: true });
            const { code, userEnteredCode } = this.state;
            console.warn(code + ' is the code!');
            console.warn(userEnteredCode + ' is the entered!');
            if (code !== userEnteredCode) {
                this.setState({ isLoading: false });
                console.warn('Wrong code');
            } else {
                this.setState({ isLoading: false });
                console.warn('Correct code!');
                db.validateUser(this.state.username, this.state.email)
                    .then(result => {
                        console.warn(this.state.username + ' validated!');
                        this.props.navigation.navigate('SignIn');
                    }, error => {
                        console.warn('Could not validate!');
                    });
            }
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
            <ImageBackground blurRadius={1.3} source={require('../assets/lilypads.png')} resizeMode="cover" style={styles.bgImage}>
                <StatusBar barStyle="dark-content"
                    translucent={true}
                    backgroundColor="rgba(255, 255, 255, 1)"
                />
                <ScrollView>
                    <View style={styles.container}>
                        <Image source={require('../assets/mainLogoWText.png')}
                            resizeMode="contain" style={styles.logo} />
                        <Text style={styles.infoText}>We've just emailed you a validation code at {this.state.email}.</Text>
                        <Text style={styles.infoText}>Please validate your email using the code you have received.</Text>
                        <View style={styles.metaWrapper}>
                            <View style={styles.codeWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Validation Code"
                                    autoCapitalize="characters"
                                    onChangeText={(userEnteredCode) => this.setState({ userEnteredCode })}
                                    returnKeyType="done"
                                    onSubmitEditing={this.signUpHandler} />
                                {keyIconJsx}
                            </View>
                        </View>
                        <TouchableOpacity style={styles.validateBtn}
                            onPress={this.validateHandler}>
                            <Text style={styles.btnText}>Validate</Text>
                            {indicatorJsx}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('SignUp', {
                                name: this.state.name,
                                username: this.state.username,
                                email: this.state.email,
                            });
                        }}>
                            <Text style={styles.changeEmailText}>Not you? Change your email</Text>
                        </TouchableOpacity>
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
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
    },
    logo: {
        width: 300,
        height: 150,
        flex: 1,
        marginBottom: 20,
        alignSelf: 'center',
    },
    infoText: {
        textAlign: 'center',
        marginBottom: 20,
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
        borderColor: '#22a7f0',
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
        width: btnWidth,
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
        marginTop: 30,
    },
    footerText: {
        marginBottom: 5,
        textAlign: 'center',
        color: '#336e7b',
    },
    changeEmailText: {
        margin: 30,
        color: '#22a7f0',
    },
});
