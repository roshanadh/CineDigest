import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    TextInput,
} from 'react-native';
import EditIcon from 'react-native-vector-icons/Feather';

import {onSignOut} from '../auth/auth';

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isNameEditable: false,
            isUsernameEditable: false,
            isPasswordEditable: false,
            name: '',
            username: '',
            oldPassword: '',
            newPassword: '',
            newPasswordConfirmation: '',
        };

        this.changeEditable = (field) => {
            switch (field) {
                case 'name':
                    this.setState(prevState => ({ isNameEditable: !prevState.isNameEditable }));
                    break;
                case 'username':
                    this.setState(prevState => ({ isUsernameEditable: !prevState.isUsernameEditable }));
                    break;
                case 'password':
                    this.setState(prevState => ({ isPasswordEditable: !prevState.isPasswordEditable }));
                    break;
                default: null;
            }
        };
    }

    render() {
        return (
            <ImageBackground blurRadius={1.3}
                source={require('../assets/lilypads.png')}
                resizeMode="cover" style={styles.bgImage}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                </View>
                <View style={styles.container}>
                    <View style={styles.textInputWrapper}>
                        <TextInput placeholder="Your Name"
                            defaultValue="My Details"
                            editable={this.state.isNameEditable}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={this.usernameTextChanged}
                            returnKeyType="next" />
                        <EditIcon name="edit-2"
                            size={20}
                            color={this.state.isNameEditable ? '#6bb9f0' : '#67809f'}
                            onPress={() => this.changeEditable('name')} />
                    </View>
                    <View style={styles.textInputWrapper}>
                        <TextInput placeholder="Your Username"
                            defaultValue="My Details"
                            editable={this.state.isUsernameEditable}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={this.usernameTextChanged}
                            returnKeyType="next" />
                        <EditIcon name="edit-2"
                            size={20}
                            color={this.state.isUsernameEditable ? '#6bb9f0' : '#67809f'}
                            onPress={() => this.changeEditable('username')} />
                    </View>
                    <View style={styles.textInputWrapper}>
                        <TextInput placeholder="Old Password"
                            secureTextEntry={true}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={this.usernameTextChanged}
                            returnKeyType="next" />
                        <EditIcon name="edit-2" size={20} color={this.state.isPasswordEditable ? '#6bb9f0' : '#67809f'} />
                    </View>
                    <View style={styles.textInputWrapper}>
                        <TextInput placeholder="New Password"
                            secureTextEntry={true}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={this.usernameTextChanged}
                            returnKeyType="next" />
                        <EditIcon name="edit-2" size={20} color={this.state.isPasswordEditable ? '#6bb9f0' : '#67809f'} />
                    </View>
                    <View style={styles.textInputWrapper}>
                        <TextInput placeholder="Confirm New Password"
                            secureTextEntry={true}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={this.usernameTextChanged}
                            returnKeyType="next" />
                        <EditIcon name="edit-2" size={20} color={this.state.isPasswordEditable ? '#6bb9f0' : '#67809f'} />
                    </View>
                    <TouchableOpacity style={styles.saveProfileBtn}
                        onPress={() => console.warn('Saved Profile!')}>
                        <Text style={styles.btnText}>Save Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.signOutBtn}
                        onPress={() => onSignOut().then(() => this.props.navigation.navigate('SignedOut'))}>
                        <Text style={styles.btnText}>Sign-out</Text>
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
    header: {
        position: 'absolute',
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
        textAlign: 'center',
    },
    container: {
        padding: 20,
		flex: 1,
		flexDirection: 'column',
        justifyContent: 'center',
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
    saveProfileBtn: {
        marginTop: 20,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 50,
        padding: 15,
        width: '50%',
        backgroundColor: '#22a7f0',
    },
    signOutBtn: {
        position: 'absolute',
        bottom: 10,
        alignItems: 'center',
		borderRadius: 50,
        padding: 15,
        width: '50%',
        backgroundColor: '#22a7f0',
    },
    btnText: {
		color: '#fff',
	},
});
