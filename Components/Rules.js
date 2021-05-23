import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native'
import { Icon } from 'react-native-elements'
import Corpusier from './Corpusier';


function Rules({rules, removeRule}) {
  const [_rules, updateRules] = useState(rules);

  renderItem = ({item, index}) => {
    return (
      <View style={{flexDirection: 'row', backgroundColor: '#1E1E1E', borderRadius: 10, marginTop: 25}}>
        {item.type == 1 && <View style={{paddingHorizontal: 25, paddingVertical: 20, width: '99%'}}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Supprimer toutes les occurences de</Text> 
            <Text style={{color: 'white', marginTop: 14, padding: 10, backgroundColor: '#084244', borderRadius: 10}}>
              {item.text1}
            </Text>
        </View>}
        {item.type == 2 && <View style={{paddingHorizontal: 25, paddingVertical: 20, width: '99%'}}>
            <Text style={{color: 'white', fontWeight: 'bold', marginBottom: 14}}>
              Supprimer (toutes les occurences) du début de l'article à
            </Text> 
            <Text style={{color: 'white', marginBottom: 10, padding: 10, backgroundColor: '#084244', borderRadius: 10}}>
              {item.text1}
            </Text>  
        </View>}
        {item.type == 3 && <View style={{paddingHorizontal: 25, paddingVertical: 20, width: '99%'}}>
            <Text style={{color: 'white', fontWeight: 'bold', marginBottom: 14}}>
              Supprimer de
            </Text> 
            <Text style={{color: 'white', marginBottom: 10, padding: 10, backgroundColor: '#084244', borderRadius: 10}}>
              {item.text1}
            </Text> 
            <Text style={{color: 'white', fontWeight: 'bold', marginBottom: 10, marginLeft: 4}}>
              à la fin de l'article (toutes les occurences).
            </Text> 
        </View>}
        {item.type == 4 && <View style={{paddingHorizontal: 25, paddingVertical: 20, width: '99%'}}>
            <Text style={{color: 'white', fontWeight: 'bold', marginBottom: 14}}>
              Supprimer (toutes les occurences) à partir de
            </Text> 
            <Text style={{color: 'white', marginBottom: 10, padding: 10, backgroundColor: '#084244', borderRadius: 10}}>
              {item.text1}
            </Text> 
            <Text style={{color: 'white', fontWeight: 'bold', marginBottom: 10}}>
              jusqu'à
            </Text> 
            <Text style={{color: 'white', padding: 10, backgroundColor: '#084244', borderRadius: 10}}>
              {item.text2}
            </Text> 
        </View>}
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Icon
            name='delete'
            type='material'
            color='white'
            size={22}
            onPress={() => removeRule(index)}
            containerStyle={{marginTop: 10, marginRight: 10}}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
      <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold', color: 'white'}}>
        Règles de nettoyage
      </Text>
      {rules.length == 0 && <Text style={{fontSize: 14, textAlign: 'center', color: '#bfbfbf', marginTop: 10, width: '50%'}}>
        (Créer des règles de nettoyage en utilisant le clic droit dans l'aperçu du corpus.
        Elles seront listées et supprimables ici.)
      </Text>}
      <FlatList
        data={rules}
        renderItem={renderItem}
        style={{width: '100%', marginBottom: 25}}
      />
    </View>
  );
}

export default Rules;