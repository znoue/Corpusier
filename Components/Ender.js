import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity} from 'react-native'
const { dialog } = require('electron').remote
const con = require('electron').remote.getGlobal('console')

function Ender({process}) {

  // Équivalent à componentDidMount plus componentDidUpdate :
  useEffect(() => {
    // Mettre à jour le titre du document en utilisant l'API du navigateur
  });

  return (
    <View style={{flexDirection: 'row', height: 80, marginTop: 30, justifyContent: 'center'}}>
      <TouchableOpacity 
        style={{backgroundColor: '#1E1E1E', marginTop: 15, height: 50, width: 250, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginLeft: 5}} 
        onPress={() => process()}>
        <Text style={{color: 'white', textAlign: 'center'}}>Démarrer la création du corpus</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Ender;