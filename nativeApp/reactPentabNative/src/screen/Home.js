import React from 'react';
import {View, Text, Button} from 'react-native';

export default function Home({navigation}) {
  return (
    <View style={{flex: 1}}>
      <Text style={{fontSize: 18}}>Plz Scan the barcode</Text>
      <Button title="Scan" onPress={() => navigation.navigate('ScanBarcode')} />
    </View>
  );
}
