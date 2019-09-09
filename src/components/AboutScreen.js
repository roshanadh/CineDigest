import React, { Component } from 'react';
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
    Linking,
} from 'react-native';
import bcrypt from 'react-native-bcrypt';
import db from '../db/db_exp';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import netCon from '../util/NetCon';
import CustomSnackbar from '../util/Snackbar';

export default class AboutScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'About Cine Digest',
            headerTitleStyle: {
                color: '#fefefe',
            },
            headerTintColor: '#fefefe',
            headerStyle: {
                backgroundColor: '#913d88',
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
    }

    render() {
        return (
            <ImageBackground blurRadius={1.3}
                source={require('../assets/lilypads.png')}
                resizeMode="cover" style={styles.bgImage}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.container}>
                        <View style={styles.changePasswordContainer}>
                            <Text style={styles.text}>
                                <Text style={styles.highlight}>Cine Digest</Text> is an attempt at providing a platform for
                                movie and television enthusiasts to gather their interests.
                            </Text>
                            <Text style={styles.text}>
                                The application, together with its API, was developed as part of Minor Project II for
                            </Text>
                            <Text style={styles.collegeName}>
                                Gandaki College of Engineering and Science{'\n'}
                                Pokhara, Nepal
                            </Text>
                            <Text style={styles.text}>
                                by the group of
                            </Text>
                            <Text style={styles.devNames}>
                                Roshan Adhikari,{'\n'}Sakar Raman Parajuli, and{'\n'}Sandhya Acharya
                            </Text>
                            <Text style={styles.text}>
                                under the supervision of <Text style={styles.highlight}>Er. Mahesh Shakya</Text>.
                            </Text>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>The Cine Digest API fetches title information from </Text>
                            <Text style={styles.highlight}>The Movie Database (TMDB).</Text>
                            <AntDesignIcon name="github"
                                size={40}
                                color="#000"
                                style={styles.icon}
                                onPress={
                                    () => Linking.openURL('https://github.com/roshanadh/CineDigest')
                                }/>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 14,
        color: '#34495e',
        textAlign: 'justify',
        marginBottom: 15,
    },
    infoText: {
        fontSize: 14,
        color: '#34495e',
        textAlign: 'justify',
        marginBottom: 5,
    },
    highlight: {
        color: '#67809f',
    },
    collegeName: {
        color: '#67809f',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 15,
    },
    devNames: {
        color: '#67809f',
        textAlign: 'center',
        marginBottom: 10,
    },
    icon: {
        marginTop: 20,
    },
});
