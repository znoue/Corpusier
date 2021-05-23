import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity} from 'react-native'
const { dialog } = require('electron').remote
const con = require('electron').remote.getGlobal('console')
var fs = require('fs')
var path = require('path')
const extractUrls = require("extract-urls");

const FilePicker = ({getFile, getData, gFile}) => {
  const [file, setFile] = useState(gFile);
  const [data, setData] = useState()

  const openFilesBrowser = () => {
    dialog.showOpenDialog({properties: ['openFile']}).then(result => {
      setFile(result.filePaths[0])
      getFile(result.filePaths[0])
      if (result.filePaths === undefined) {
        con.log("No file selected")
      } else {
        fs.readFile(result.filePaths[0], 'utf-8', (err, data) => {
          if(err){
              alert("An error ocurred reading the file :" + err.message);
              con.log("An error ocurred reading the file :" + err.message)
              return;
          }
          let urls = data.split(/\r?\n/)
          let extension = path.extname(result.filePaths[0])
          con.log("Extension : ", extension)
          setData(urls)
          getData(urls)
      });
      }
    }).catch(err => {
      con.log(err)
    })
  }

  return (
    <View style={{flexDirection: 'row', height: 80}}>
      <TouchableOpacity 
        style={{backgroundColor: '#1E1E1E', marginTop: 15, height: 30, width: 140, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginLeft: 5}} 
        onPress={() => openFilesBrowser()}>
        <Text style={{color: 'white'}}>Charger un fichier</Text>
      </TouchableOpacity>
      {file == ""
      ? <Text style={{color: 'white', margin: 20, marginLeft: 35}}>
          Parcourir l'ordinateur et sélectionner la liste d'URL (fichier CSV) à partir desquelles créer le corpus.
        </Text>
      : <Text style={{color: '#15B0AF', margin: 20, marginLeft: 35}}>
          {file}
        </Text>}
    </View>
  );
}

export default FilePicker;