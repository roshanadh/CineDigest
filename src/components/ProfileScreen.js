import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import EditIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import db from '../db/db';

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isNameEditable: false,
            isUsernameEditable: false,
            isPasswordEditable: false,
            name: '',
            username: '',
        };

        this.getUsername = () => {
            return new Promise((resolve, reject) => {
                let username = AsyncStorage.getItem('USER_KEY');
                resolve(username)
                    .catch(error => console.warn('ERROR in getUsername ' + error.message));
            });
        };

        this.changeEditable = (field) => {
            switch (field) {
                case 'name':
                    this.setState({isNameEditable: true});
                    break;
                case 'username':
                    this.setState({ isUsernameEditable: true });
                    break;
                case 'password':
                    this.setState({ isPasswordEditable: true });
                    break;
                default: null;
            }
        };
    }

    componentDidMount() {
        this.getUsername()
            .then((result) => {
                db.getUser(result)
                    .then(details => {
                        this.setState({
                            username: details.username, name: details.name,
                        }, () => {console.warn('User ' + this.state.name + ' retrieved successfully!');});
                    }, error => {
                        console.warn('User by the username ' + result + ' was not found!');
                    })
                    .catch(error => console.warn(error.message));
            });
    }

    render() {
        let indicatorJsx = this.state.isLoading ?
            <ActivityIndicator size="small" color="#fefefe"
                style={styles.indicator} /> : null;

        let usernameLengthErrorTextJsx =
            this.state.username.length > 0 && this.state.username.length < 6 ?
                <Text style={styles.errorText}>Username must contain atleast 6 characters</Text> : null;

        let usernameCharErrorTextJsx =
            this.state.username.includes('.') || this.state.username.includes('/') ||
            this.state.username.includes('\\') || this.state.username.includes('|') ||
            this.state.username.includes('~') || this.state.username.includes('`') ||
            this.state.username.includes('!') || this.state.username.includes('@') ||
            this.state.username.includes('+') || this.state.username.includes('-') ||
            this.state.username.includes('*') || this.state.username.includes('=') ||
            this.state.username.includes('#') || this.state.username.includes('$') ||
            this.state.username.includes('%') || this.state.username.includes('^') ||
            this.state.username.includes('&') || this.state.username.includes('(') ||
            this.state.username.includes(')') || this.state.username.includes(';') ||
            this.state.username.includes(':') || this.state.username.includes('{') ||
            this.state.username.includes('}') || this.state.username.includes('[') ||
            this.state.username.includes(']') || this.state.username.includes('\'') ||
            this.state.username.includes('"') || this.state.username.includes('?') ||
            this.state.username.includes('<') || this.state.username.includes('>') ||
            this.state.username.includes(',') || this.state.username.includes(' ') ?
                <Text style={styles.errorText}>Username must not contain any special characters</Text> : null;

        return (
            <ImageBackground blurRadius={1.3}
                source={require('../assets/lilypads.png')}
                resizeMode="cover" style={styles.bgImage}>
                <View style={styles.header}>
                    <MaterialIcons name="person" size={25} color="#fefefe" />
                    <Text style={styles.headerTitle}>Update Profile</Text>
                </View>
                <View style={styles.container}>
                    <Text style={styles.editInfo}>Tap the edit icon to change your screen names</Text>
                    <View style={styles.textInputWrapper}>
                        <TextInput placeholder="Your Name"
                            defaultValue={this.state.name}
                            editable={this.state.isNameEditable}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={name => this.setState({ name })}
                            returnKeyType="done" />
                        <EditIcon name="edit-2"
                            size={20}
                            color={this.state.isNameEditable ? '#6bb9f0' : '#67809f'}
                            onPress={() => this.changeEditable('name')} />
                    </View>
                    <View style={styles.textInputWrapper}>
                        <TextInput placeholder="Your Username"
                            defaultValue={this.state.username}
                            editable={this.state.isUsernameEditable}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={username => this.setState({ username })}
                            returnKeyType="done" />
                        <EditIcon name="edit-2"
                            size={20}
                            color={this.state.isUsernameEditable ? '#6bb9f0' : '#67809f'}
                            onPress={() => this.changeEditable('username')} />
                    </View>
                    <TouchableOpacity style={styles.changePass}
                        onPress={() =>
                            this.props.navigation.navigate('ChangePasswordScreen')
                        }>
                        <Text style={styles.changePassText}>Change your password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveProfileBtn}
                        onPress={() => console.warn('Saved Profile!')}>
                        <Text style={styles.btnText}>Save Profile</Text>
                        {indicatorJsx}
                    </TouchableOpacity>
                    <View style={styles.footer}>
                        {usernameLengthErrorTextJsx}
                        {usernameCharErrorTextJsx}
                    </View>
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
        flexDirection: 'row',
        justifyContent: 'center',
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
        marginLeft: 10,
    },
    scrollView: {
        marginTop: 50,
    },
    container: {
        justifyContent: 'center',
        padding: 20,
		flex: 1,
        alignItems: 'center',
    },
    editInfo: {
        marginTop: 25,
        marginBottom: 25,
        color: '#34495e',
    },
    changePassText: {
        color: '#22a7f0',
        marginTop: 25,
        marginBottom: 15,
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 50,
        marginTop: 20,
        padding: 15,
        width: '50%',
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
