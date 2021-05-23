import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Corpusier from './Components/Corpusier'


const GREY_LIGHT = '#EEEEEE'
const GREY_DARK = '#333333'

export default function App() {
  return (
    <View style={styles.container}>
      <Corpusier/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GREY_DARK,
    alignItems: 'center',
    paddingTop: 20
  },
});
