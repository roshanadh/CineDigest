// SignUp.js
import React, {Component} from 'react';
import {
  View,
  TouchableHighlight,
  TextInput,
  Text,
  StyleSheet,
  Alert
} from 'react-native'
export default class SignUpScreen extends Component
 {
  state = {
    Firstname: '', Lastname: '',
     password1: '',  password2: ''
  }
  checkSignUp() {
  

        
           const {password1,password2,Firstname,Lastname} = this.state
              // If password not entered 
               if (password1 == '') 
               Alert.alert ('Error', 'Please enter password',[{
               text:'okay'
               }])
               if (password2 == '') 
               Alert.alert ('Error', 'Please enter confirm password',[{
               text:'okay'
               }])


               else if (Firstname == '') 
               Alert.alert ('Error', 'Yo! Fillup your Firstname',[{
               text:'okay'
               }])
               
               else if (Lastname == '') 
               Alert.alert ('Error', 'Yo! Fillup your Lastname',[{
               text:'okay'
               }])
           
              
              // If Not same return False.     
              else if (password1 != password2) { 
              Alert.alert ('Error', 'Mismatched passwords',[{
              text:'okay'
               }])
              }

              // If same return True. 
              else{  
                this.props.navigation.navigate('SignInScreen')
              }
           
 }
 
  render() {
    return (
      <View style={styles.container}>
        <TextInput
            style={styles.input}
            placeholder='Firstname'
            underlineColorAndroid='transparent'
            onChangeText={(Firstname) => this.setState({Firstname})}/>
        
        <TextInput
            style={styles.input}
            placeholder='Lastname'
            underlineColorAndroid='transparent'
            onChangeText={(Lastname) => this.setState({Lastname})}/>
        
        <TextInput
            style={styles.input}
            placeholder='Password'
            secureTextEntry={true}
            underlineColorAndroid='transparent'
            onChangeText={(password1) => this.setState({password1})}/>
        
        <TextInput
            style={styles.input}
            placeholder='Confirm Password'
            secureTextEntry={true}
            underlineColorAndroid='transparent'
            onChangeText={(password2) => this.setState({password2})}/>
        
       <TouchableHighlight style={[styles.SignupButton]} 
             onPress={() => this.props.navigation.navigate('SignIn')}>
       <Text style={styles.loginText}>Sign-Up</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 45,
    margin: 10,
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  SignupButton: {  
    margin: 10,
    padding: 8,
    alignItems: 'center',
    height:45,
    width:150,
    borderRadius: 12,
    backgroundColor: "#33B8FF",
  },
  loginText: {
    color: 'white',  
  }
})

