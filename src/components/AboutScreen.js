import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ImageBackground,
    Linking,
} from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

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

    render() {
        return (
            <ImageBackground blurRadius={1.3}
                source={require('../assets/lilypads.png')}
                resizeMode="cover" style={styles.bgImage}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.container}>
                        <View style={styles.aboutContainer}>
                            <Text style={styles.welcomeText}>Cine Digest</Text>
                            <Text style={styles.text}>
                                is an attempt at providing a platform for
                                movie and television enthusiasts to gather their interests.
                            </Text>
                            <Text style={styles.text}>
                                The application was developed as part of Minor Project II for
                            </Text>
                            <Text style={styles.collegeName}>
                                Gandaki College of Engineering and Science{'\n'}
                                Pokhara, Nepal
                            </Text>
                            <Text style={styles.insight}>
                                by the group of
                            </Text>
                            <Text style={styles.devNameList}>
                                <Text style={styles.devName}>
                                    Roshan Adhikari
                                </Text>{'\n'}
                                <Text style={styles.devName}>
                                    Sakar Raman Parajuli
                                </Text>{'\n'}
                                <Text style={styles.devName}>
                                    Sandhya Acharya
                                </Text>
                            </Text>
                            <Text style={styles.insight}>
                                under the supervision of
                            </Text>
                            <Text style={styles.devNameList}>
                                <Text style={styles.devName}>Er. Mahesh Shakya</Text>.
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
    aboutContainer: {
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
    welcomeText: {
        fontSize: responsiveFontSize(5),
        fontFamily: 'Quicksand-Light',
        width: '100%',
        color: '#963694',
        paddingTop: 0,
        padding: 25,
        textShadowColor: '#aaa',
        textShadowRadius: 6,
        textAlign: 'center',
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
    insight: {
        marginBottom: 5,
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
        marginBottom: 15,
        fontSize: 15,
    },
    devNameList: {
        textAlign: 'center',
        marginBottom: 15,
    },
    devName: {
        color: '#67809f',
        textAlign: 'center',
        marginBottom: 10,
    },
    icon: {
        marginTop: 20,
    },
});
