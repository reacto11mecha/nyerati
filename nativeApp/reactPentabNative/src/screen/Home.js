import React from 'react';
import {View, Button} from 'react-native';

export default function Home({navigation}) {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
      <Button title="Scan" onPress={() => navigation.navigate('ScanBarcode')} />
    </View>
  );
}
