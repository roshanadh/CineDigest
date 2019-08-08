import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
} from 'react-native';

export default ({ navigation }) => (
    <View style={{paddingVertical: 20}}>
        <Button
          title="Sign out"
          onPress={() => navigation.navigate('SignInScreen')}
        />
    </View>
  );
