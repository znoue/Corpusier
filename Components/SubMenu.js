import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity} from 'react-native'

function SubMenu({getTab}) {
  const [count, setCount] = useState(0);
  const [tab, setTab] = useState(1);

  // Équivalent à componentDidMount plus componentDidUpdate :
  useEffect(() => {
    // Mettre à jour le titre du document en utilisant l'API du navigateur
    getTab(tab)
  }, [tab]);

  return (
    <View style={{width: '100%', flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity 
        style={{width: '50%', flex: 1, alignItems: 'center', height: 40, justifyContent: 'center', borderBottomWidth: 1, 
                backgroundColor: tab == 1 ? '#1E1E1E' : 'transparent', 
                borderColor: '#5F5F5F', borderTopLeftRadius: tab == 1 ? 6 : 0, borderTopRightRadius: tab == 1 ? 6 : 0}}
        onPress={() => setTab(1)}
      >
        <Text style={{color: tab == 1 ? "white" : 'gray', fontWeight: tab == 1 ? 'bold' : 'normal', fontSize: 16}}>Règles de création du corpus</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={{width: '50%', flex: 1, alignItems: 'center', height: 40, justifyContent: 'center', borderBottomWidth: 1, 
                backgroundColor: tab == 2 ? '#1E1E1E' : 'transparent', 
                borderColor: '#5F5F5F', borderTopLeftRadius: tab == 2 ? 6 : 0, borderTopRightRadius: tab == 2 ? 6 : 0}}
        onPress={() => setTab(2)}
      >
        <Text style={{color: tab == 2 ? "white" : 'gray', fontWeight: tab == 2 ? 'bold' : 'normal', fontSize: 16}}>Aperçu du corpus</Text>
      </TouchableOpacity>
    </View>
  );
}

export default SubMenu;