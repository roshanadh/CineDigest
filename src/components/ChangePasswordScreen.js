import React, {Component} from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    ImageBackground,
    ProgressBarAndroid,
    Alert,
} from 'react-native';
import bcrypt from 'react-native-bcrypt';
import db from '../db/db_exp';
import KeyIcon from 'react-native-vector-icons/Feather';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ChangePassword extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Change Password',
            headerTitleStyle: {
                color: '#fefefe',
            },
            headerTintColor: '#fefefe',
            headerStyle: {
                backgroundColor: '#6bb9f0',
                elevation: 0,
            },
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            username: '',
            uuid: '',
            passwordProgress: 0,
            oldPassword: '',
            newPassword: '',
            passwordConfirmation: '',
        };

        this.updatePassword = (newPassword) => {
            if (this.state.newPassword < newPassword) {
                // Password length increased
                if (newPassword.length >= 8) {
                    this.setState({ newPassword, passwordProgress: 1 });
                } else {
                    this.setState({ newPassword, passwordProgress: this.state.passwordProgress + (1 / 8) });
                }
            } else {
                // Password length decreased
                if (newPassword.length === 0) {
                    this.setState({ newPassword, passwordProgress: 0 });
                } else if (newPassword.length >= 8) {
                    this.setState({ newPassword, passwordProgress: 1 });
                } else {
                    this.setState({ newPassword, passwordProgress: this.state.passwordProgress - (1 / 8) });
                }
            }
        };

        this.genProgressBarJsx = () => {
            if (this.state.newPassword.length === 0) {
                return (
                    <ProgressBarAndroid
                        styleAttr="Horizontal"
                        indeterminate={false}
                        progress={1}
                        style={styles.progressBar}
                        color="#22a7f0" />
                );
            } else if (this.state.newPassword.length > 0 && this.state.newPassword.length < 6) {
                return (
                    <ProgressBarAndroid
                        styleAttr="Horizontal"
                        indeterminate={false}
                        progress={this.state.passwordProgress}
                        style={styles.progressBar}
                        color="#e74c3c" />
                );
            } else if (this.state.newPassword.length >= 6 && this.state.newPassword.length < 8) {
                return (
                    <ProgressBarAndroid
                        styleAttr="Horizontal"
                        indeterminate={false}
                        progress={this.state.passwordProgress}
                        style={styles.progressBar}
                        color="#f4b350" />
                );
            } else {
                return (
                    <ProgressBarAndroid
                        styleAttr="Horizontal"
                        indeterminate={false}
                        progress={this.state.passwordProgress}
                        style={styles.progressBar}
                        color="#22a7f0" />
                );
            }
        };

        this.genOldPasswordIconJsx = () => {
            if (this.state.oldPassword.length === 0) {
                return (
                    <KeyIcon name="key" size={25} color="#ddd" />
                );
            } else {
                return (
                    <KeyIcon name="key" size={25} color="#22a7f0" />
                );
            }
        };

        this.genPasswordIconJsx = () => {
            if (this.state.newPassword.length === 0) {
                return (
                    <KeyIcon name="key" size={25} color="#ddd" />
                );
            } else if (this.state.newPassword.length > 0 && this.state.newPassword.length < 6) {
                return (
                    <KeyIcon name="key" size={25} color="#e74c3c" />
                );
            } else if (this.state.newPassword.length >= 6 && this.state.newPassword.length < 8) {
                return (
                    <KeyIcon name="key" size={25} color="#f4b350" />
                );
            } else {
                return (
                    <KeyIcon name="key" size={25} color="#22a7f0" />
                );
            }
        };

        this.genConfirmPasswordIconJsx = () => {
            if (this.state.passwordConfirmation.length === 0) {
                return (
                    <KeyIcon name="key" size={25} color="#ddd" />
                );
            } else if (this.state.passwordConfirmation.length > 0 && (this.state.newPassword !== this.state.passwordConfirmation)) {
                return (
                    <KeyIcon name="key" size={25} color="#e74c3c" />
                );
            } else {
                return (
                    <KeyIcon name="key" size={25} color="#22a7f0" />
                );
            }
        };

        this.changePassword = () => {
            this.setState({ isLoading: true });
            let { oldPassword, newPassword, passwordConfirmation } = this.state;
            console.warn('change password init');
            if (oldPassword === '') {
                this.setState({ isLoading: false });
                // If password not entered
                Alert.alert('Error', 'Please enter your current password!', [{
                    text: 'okay',
                }]);
            } else if (newPassword === '') {
                this.setState({ isLoading: false });
                Alert.alert('Error', 'Please enter a new password!', [{
                    text: 'okay',
                }]);
            } else if (passwordConfirmation === '') {
                this.setState({ isLoading: false });
                Alert.alert('Error', 'Please confirm your new password!', [{
                    text: 'okay',
                }]);
            } else if (passwordConfirmation !== newPassword) {
                this.setState({ isLoading: false });
                // If Not same return False
                Alert.alert('Error', 'The passwords did not match!', [{
                    text: 'okay',
                }]);
            } else if (newPassword.length < 6) {
                Alert.alert('Error', 'Password must contain atleast 6 characters!', [{
                    text: 'okay',
                }]);
            } else {
                // Check if current password is correct
                let username = this.props.navigation.getParam('username', null);
                let user = this.props.navigation.getParam('uuid', null);
                db.verifyUser(username, oldPassword)
                    .then(result => {
                        // Password is correct
                        // Check if new password if the same as current one
                        if (newPassword === oldPassword) {
                            this.setState({ isLoading: false });
                            Alert.alert(
                                'Oops',
                                'Your new password cannot be your current one!', [{
                                    text: 'OK',
                                }]
                            );
                        } else {
                            // Generate Salt for hashing (with 5 rounds) / ASYNC
                            bcrypt.genSalt(5, (_err, salt) => {
                                // Generate Hash for the password / ASYNC
                                bcrypt.hash(this.state.newPassword, salt, (_err, hash) => {
                                    console.warn(hash + ' is the hash!');
                                    let changePromise = db.changePassword(username, hash);
                                    changePromise.then(result => {
                                        this.setState({ isLoading: false });
                                        console.warn(result);
                                        Alert.alert(
                                            'Successful',
                                            'Your password has been changed!', [{
                                                text: 'OK',
                                                onPress: () => this.props.navigation.goBack(),
                                            }]
                                        );
                                    }, err => {
                                        this.setState({ isLoading: false });
                                        Alert.alert('Oops', 'Please try again!');
                                        console.warn(err);
                                    });
                                });
                            });
                        }
                    }, error => {
                            this.setState({ isLoading: false });
                            if (error === 'PASSWORD-MISMATCH') {
                                Alert.alert('Error', 'Your current password is incorrect!');
                            } else {
                                Alert.alert('Error', 'Error message: ' + error);
                            }
                            console.warn(error);
                    });
            }
        };
    }

    render() {
        let indicatorJsx = this.state.isLoading ?
            <ActivityIndicator size="small" color="#fefefe"
                style={styles.indicator} /> : <View style={styles.emptyView} />;
        let newPasswordLengthErrorTextJsx =
            this.state.newPassword.length > 0 && this.state.newPassword.length < 6 ?
                <Text style={styles.errorText}>Password must contain atleast 6 characters</Text> : null;
        let confirmPasswordLengthErrorTextJsx =
            this.state.passwordConfirmation.length > 0 && (this.state.newPassword !== this.state.passwordConfirmation) ?
                <Text style={styles.errorText}>Passwords do not match</Text> : null;
        let progressBarJsx = this.genProgressBarJsx();
        let oldPasswordIconJsx = this.genOldPasswordIconJsx();
        let passwordIconJsx = this.genPasswordIconJsx();
        let confirmPasswordIconJsx = this.genConfirmPasswordIconJsx();

        return (
            <ImageBackground blurRadius={1.3}
                source={require('../assets/lilypads.png')}
                resizeMode="cover" style={styles.bgImage}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.container}>
                        <View style={styles.changePasswordContainer}>
                            <MCIcons name="textbox-password" size={80} color="#34495e" style={styles.passwordIcon} />
                            <View style={styles.metaWrapper}>
                                <View style={styles.passwordWrapper}>
                                    <TextInput placeholder="Old Password"
                                        secureTextEntry={true}
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        onChangeText={oldPassword => this.setState({ oldPassword })}
                                        returnKeyType="next" />
                                    {oldPasswordIconJsx}
                                </View>
                            </View>
                            <View style={styles.metaWrapper}>
                                <View style={styles.noBorderPasswordWrapper}>
                                    <TextInput placeholder="New Password"
                                        secureTextEntry={true}
                                        editable={this.state.isPasswordEditable}
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        onChangeText={newPassword => this.updatePassword(newPassword)}
                                        returnKeyType="next" />
                                    {passwordIconJsx}
                                </View>
                                {progressBarJsx}
                            </View>
                            <View style={styles.metaWrapper}>
                                <View style={
                                    confirmPasswordLengthErrorTextJsx !== null ?
                                        styles.errorWrapper : styles.passwordWrapper
                                }>
                                    <TextInput placeholder="Confirm New Password"
                                        secureTextEntry={true}
                                        editable={this.state.isPasswordEditable}
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        onChangeText={passwordConfirmation => this.setState({ passwordConfirmation })}
                                        returnKeyType="next" />
                                    {confirmPasswordIconJsx}
                                </View>
                            </View>
                            <View style={styles.footer}>
                                {newPasswordLengthErrorTextJsx}
                                {confirmPasswordLengthErrorTextJsx}
                            </View>
                            <TouchableOpacity style={styles.changePassBtn}
                                onPress={() => this.changePassword()}>
                                <Text style={styles.btnText}>Change Password</Text>
                                {indicatorJsx}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>You need a password to access your lists stored on this device.</Text>
                            <Text style={styles.infoText}>Create a strong password that comprises different <Text style={styles.highlight}>$ymb0ls</Text> and <Text style={styles.highlight}>cAsEs</Text>.</Text>
                        </View>
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
        paddingTop: 10,
        paddingBottom: 10,
    },
    changePasswordContainer: {
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
    infoContainer: {
        borderWidth: 0.1,
        borderColor: '#013243',
        flexDirection: 'column',
        padding: 20,
        paddingBottom: 0,
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
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
    progressBar: {
        width: '100%',
        height: 1.2,
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
    textInput: {
        marginRight: 10,
        flex: 5,
        minHeight: '6%',
    },
    changePassBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 50,
        padding: 15,
        width: '70%',
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
    infoText: {
        fontSize: 13,
        color: '#34495e',
        textAlign: 'center',
        marginBottom: 15,
    },
    highlight: {
        color: '#67809f',
    },
});
