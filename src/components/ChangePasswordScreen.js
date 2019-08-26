import React, {Component} from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import KeyIcon from 'react-native-vector-icons/Feather';

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
            oldPassword: '',
            newPassword: '',
            passwordConfirmation: '',
        };
    }

    render() {
        let indicatorJsx = this.state.isLoading ?
            <ActivityIndicator size="small" color="#fefefe"
                style={styles.indicator} /> : null;
        let newPasswordLengthErrorTextJsx =
            this.state.newPassword.length > 0 && this.state.newPassword.length < 6 ?
                <Text style={styles.errorText}>Password must contain atleast 6 characters</Text> : null;
        let confirmPasswordErrorTextJsx =
            this.state.passwordConfirmation.length > 0 && (this.state.newPassword !== this.state.passwordConfirmation) ?
                <Text style={styles.errorText}>Passwords do not match</Text> : null;


        return (
            <View style={styles.container}>
                <View style={styles.textInputWrapper}>
                    <TextInput placeholder="Old Password"
                        secureTextEntry={true}
                        editable={this.state.isPasswordEditable}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={oldPassword => this.setState({oldPassword})}
                        returnKeyType="next" />
						<KeyIcon name="key" size={25} color="#ddd" />
                </View>
                <View style={styles.textInputWrapper}>
                    <TextInput placeholder="New Password"
                        secureTextEntry={true}
                        editable={this.state.isPasswordEditable}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={newPassword => this.setState({newPassword})}
                        returnKeyType="next" />
						<KeyIcon name="key" size={25} color="#ddd" />
                </View>
                <View style={styles.textInputWrapper}>
                    <TextInput placeholder="Confirm New Password"
                        secureTextEntry={true}
                        editable={this.state.isPasswordEditable}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={passwordConfirmation => this.setState({passwordConfirmation})}
                        returnKeyType="next" />
						<KeyIcon name="key" size={25} color="#ddd" />
                </View>
                <TouchableOpacity style={styles.changePassBtn}
                    onPress={() => console.warn('Pressed!')}>
                    <Text style={styles.btnText}>Change Password</Text>
                    {indicatorJsx}
                </TouchableOpacity>
                <View style={styles.footer}>
                    {newPasswordLengthErrorTextJsx}
                    {confirmPasswordErrorTextJsx}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 20,
        flex: 1,
        alignItems: 'center',
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
    changePassBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 50,
        marginTop: 20,
        padding: 15,
        width: '60%',
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
    errorText: {
        color: '#e74c3c',
        fontSize: 14,
        alignSelf: 'center',
        textAlign: 'center',
        marginBottom: 10,
    },
});
