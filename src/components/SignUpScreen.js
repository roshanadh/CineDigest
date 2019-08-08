import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
} from 'react-native';

export default ({ navigation }) => (
    <View style={{ paddingVertical: 20 }}>  
        <Button
          title="Sign In"
          onPress={() => navigation.navigate("SignIn")}
        />
    </View>
  );