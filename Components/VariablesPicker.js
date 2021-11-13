import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity } from 'react-native'
const { dialog } = require('electron').remote
const con = require('electron').remote.getGlobal('console')
const variablesNames = [ 'Annuler', 'Source', 'Date']


function VariablesPicker({gVariables, getVariables}) {
  const [auteur, setAuteur] = useState(false);
  const [jour, setJour] = useState(false);
  const [mois, setMois] = useState(false);
  const [source, setSource] = useState(false);
  const [variables, setVariables] = useState(gVariables)

  // Équivalent à componentDidMount plus componentDidUpdate :
  useEffect(() => {
    // con.log("Variables : ", variables)
    // con.log("variables[0] : ", variables[0])
    getVariables(variables)
    // Mettre à jour le titre du document en utilisant l'API du navigateur
  });

  const options = {
    message: 'Choisissez une variable',
    type: 'info',
    buttons: variablesNames,
    noLink: true
  }

  const openSelector = () => {
    dialog.showMessageBox(options).then(result => {
      con.log(result.response)
      let newVariables = [...variables]
      switch (result.response) {
        case 1:
          setSource(true)
          newVariables[0] = true
          setVariables(newVariables)
          break
        case 2:
          setJour(true)
          newVariables[1] = true
          setVariables(newVariables)
          break
        // case 3:
        //   setMois(true)
        //   newVariables[2] = true
        //   setVariables(newVariables)
        //   break
        // case 4:
        //   setAuteur(true)
        //   newVariables[3] = true
        //   setVariables(newVariables)
        //   break
        default:
          break
      }
    }).catch(err => {
      con.log(err)
    })
  }

  const removeVariable = (index) => {
    // con.log("Remove variable ", index)
    let newVariables = [...variables]
    newVariables[index] = false
    setVariables(newVariables)
  }

  return (
    <View style={{marginTop: 20}}>
      <View style={{flexDirection: 'row', height: 80}}>
        <TouchableOpacity 
          style={{backgroundColor: '#1E1E1E', marginTop: 15, height: 30, width: 150, borderRadius: 5, alignItems: 'center', justifyContent: 'center'}} 
          onPress={() => openSelector()}>
          <Text style={{color: 'white'}}>Ajouter une variable</Text>
        </TouchableOpacity>
        <View style={{marginTop: 12, marginLeft: 30}}>
          <Text style={{color: 'white'}}>Choisir les variables / étiquettes (source, date, etc.) à associer à chaque document du corpus. </Text>
          <Text style={{color: 'white'}}>Elles offriront la possibilité de constituer des groupes d'articles pour comparer leurs caractéristiques. </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 15, marginBottom: 30}}>
        {!variables[0] && !variables[1] && !variables[2] && !variables[3] &&
        <Text style={{textAlign: 'center', color: '#bfbfbf', width: '50%', marginTop: -20}}>
          (Les variables doivent être choisies avant la création du corpus, seules les règles de nettoyage
          peuvent être appliquées après coup.)
        </Text>}
        {variables[0] && <TouchableOpacity style={{height: 35, width: 150, backgroundColor: '#242D34', alignItems: 'center', marginRight: 50,
                                  justifyContent: 'flex-end', borderRadius: 150, flexDirection: 'row'}}
                          onPress={() => removeVariable(0)}>
          <Text style={{color: 'white', marginLeft: -100, marginRight: 40}}>Source</Text>
          <Text style={{color: 'white', fontSize: 9, marginBottom: 16, marginRight: 12}}>x</Text>
        </TouchableOpacity>}
        {variables[1] && <TouchableOpacity style={{height: 35, width: 150, backgroundColor: '#242D34', alignItems: 'center', marginRight: 50,
                                  justifyContent: 'flex-end', borderRadius: 150, flexDirection: 'row'}}
                          onPress={() => removeVariable(1)}>
          <Text style={{color: 'white', marginLeft: -100, marginRight: 45}}>Date</Text>
          <Text style={{color: 'white', fontSize: 9, marginBottom: 16, marginRight: 12}}>x</Text>
        </TouchableOpacity>}
        {variables[2] && <TouchableOpacity style={{height: 35, width: 150, backgroundColor: '#242D34', alignItems: 'center', marginRight: 50,
                                  justifyContent: 'flex-end', borderRadius: 150, flexDirection: 'row'}}
                          onPress={() => removeVariable(2)}>
          <Text style={{color: 'white', marginLeft: -100, marginRight: 25}}>Date (mois)</Text>
          <Text style={{color: 'white', fontSize: 9, marginBottom: 16, marginRight: 12}}>x</Text>
        </TouchableOpacity>}
        {variables[3] && <TouchableOpacity style={{height: 35, width: 150, backgroundColor: '#242D34', alignItems: 'center', 
                                  justifyContent: 'flex-end', borderRadius: 150, flexDirection: 'row'}}
                          onPress={() => removeVariable(3)}>
          <Text style={{color: 'white', marginLeft: -100, marginRight: 40}}>Auteur</Text>
          <Text style={{color: 'white', fontSize: 9, marginBottom: 16, marginRight: 12}}>x</Text>
        </TouchableOpacity>}
      </View>
    </View>
  );
}

export default VariablesPicker;