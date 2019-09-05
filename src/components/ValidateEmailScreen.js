import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    Text,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Image,
    StatusBar,
    Dimensions,
    ProgressBarAndroid,
} from 'react-native';

import TextIcon from 'react-native-vector-icons/MaterialCommunityIcons';
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
            this.setState({ name, email, username });
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
                <View style={styles.container}>
                    <Text>Hello, {this.state.name}!</Text>
                    <Text>We've just emailed you a validation code at {this.state.email}.</Text>
                    <Text>To activate your Cine Digest account, you will need to validate your email.</Text>
                    <View style={styles.metaWrapper}>
                        <View style={styles.usernameWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Validation Code"
                                autoCapitalize="none"
                                onChangeText={(code) => this.setState({ code })}
                                returnKeyType="done"
                                onSubmitEditing={this.signUpHandler} />
                            {keyIconJsx}
                        </View>
                    </View>
                    <TouchableOpacity style={styles.signupBtn}
                        onPress={this.signUpHandler}>
                        <Text style={styles.btnText}>Validate</Text>
                        {indicatorJsx}
                    </TouchableOpacity>
                </View>
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
    metaWrapper: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 25,
        width: '100%',
    },
    usernameWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#22a7f0',
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    emailWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#22a7f0',
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    progressBar: {
        width: '100%',
        height: 1,
    },
    horizontalRule: {
        borderBottomWidth: 1,
        width: '100%',
        borderColor: '#22a7f0',
    },
    errorWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#e74c3c',
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 14,
        alignSelf: 'center',
        textAlign: 'center',
        marginBottom: 10,
    },
    passwordWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#22a7f0',
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    noBorderPasswordWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    passwordErrorWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.2,
        borderColor: 'red',
        borderRadius: 5,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 40,
    },
    input: {
        marginRight: 10,
        flex: 5,
        minHeight: '6%',
    },
    signupBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 50,
        marginTop: 20,
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
});
