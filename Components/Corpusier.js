import React, { useState, useEffect } from 'react';
import {View, ScrollView, Text, ActivityIndicator, FlatList, TouchableOpacity} from 'react-native'
const { dialog } = require('electron').remote
const con = require('electron').remote.getGlobal('console')
// const { extract } = require('article-parser');
var h2p = require('html2plaintext');
var removeDiacritics = require('diacritics').remove;
const fetch = require('node-fetch');
var fs = require('fs');
import extractDate from 'extract-date';
import ContextMenuArea from "react-electron-contextmenu";

// import personal components
import SubMenu from './SubMenu'
import FilePicker from './FilePicker'
import VariablesPicker from './VariablesPicker'
import Ender from './Ender'
import {fakeCorpus} from './FakeCorpus'
import Rules from './Rules'

function Corpusier() {
  const [tab, setTab] = useState(1)
  const [file, setFile] = useState("");
                                          // source, jour, mois, auteur
  const [variables, setVariables] = useState([false, false, false, false])
  const [data, setData] = useState("")
  const [corpus, setCorpus] = useState("")
  const [corpus2, updateCorpus2] = useState(fakeCorpus);
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [total, setTotal] = useState(0)
  const [currentTitle, setCurrentTitle] = useState("")
  const [rules, setRules] = useState([]) 
  const [firstSelection, setFirstSelection] = useState('')
  const [showEnder, setShowEnder] = useState(true)
  const [showStart, setShowStart] = useState(true)
  const [previousCorpus, setPreviousCorpus] = useState([])
  const [updatingRules, setUpdatingRules] = useState(false)
  const [testCorpus, setTestCorpus] = useState([])
  // {type: nb, text1: "", text2: ""} nb → 1: delete all occurence of text1,  2: delete from beginning to text 1, 
  // 3: delete from text1 to end, 4: delete from text1 to text2

  useEffect(() => {
    con.log("Array updated : ", corpus2.length)
    if (updatingRules) {
      setUpdatingRules(false)
      for (const rule of rules) {
        applyRule(rule)
      }
    }
  }, [corpus2])

  // useEffect(() => {
  // }, [rules])

  useEffect(() => {
    con.log("First selection updated : ", firstSelection)
  }, [firstSelection])

  const updateFile = (f) => {
    setFile(f)
    setShowEnder(true)
    setShowStart(true)
  }

  const updateTab = (t) => {
    con.log("First selection in updateTab : ", firstSelection)
    setTab(t)
  }

  const updateVariables = (v) => {
    setVariables(v)
  }

  const updateData = (d) => {
    setData(d)
  }

  addRule = (r) => {
    setRules(rules => [...rules, r])

    // corpus before rule save
    let tempPreviousCorpus = [...previousCorpus]
    let currentCorpus = _.cloneDeep(corpus2)
    tempPreviousCorpus.push(currentCorpus)
    setPreviousCorpus(tempPreviousCorpus)

    applyRule(r)
  }

  const updateRule = (t) => {
    con.log("Text 2 : ", t)
    let newRules = rules
    newRules[newRules.length - 1].text2 = t
    con.log("newRules : ", newRules)
    setRules(newRules)
  }

  applyRule = (rule) => {
    switch (rule.type) {
      case 1: 
        let workingCorpus = corpus2
        let cleanCorpus = workingCorpus.map(a => {
          a.content = a.content.replace(new RegExp(rule.text1), "")
          return a
        })
        updateCorpus2(cleanCorpus)
        break;
      case 2: 
        let workingCorpus2 = corpus2
        let cleanCorpus2 = workingCorpus2.map(a => {
          a.content = a.content.replace(new RegExp('.+'+rule.text1, 'gs'), "")
          return a
        })
        updateCorpus2(cleanCorpus2)
        break;
      case 3:
        let workingCorpus3 = corpus2
        con.log("Working corpus : ", workingCorpus3)
        let cleanCorpus3 = workingCorpus3.map(a => {
          a.content = a.content.replace(new RegExp('\\'+rule.text1+'.+', 'gs'), "")
          return a
        })
        updateCorpus2(cleanCorpus3)
        break;
      default:
        break;
    }
  }

  // saving file function
  const saveFile = () => {
    dialog.showSaveDialog({title: "Choisir un nom (format automatiquement ajouté)", 
    properties: ['createDirectory']}).then(result => {
      con.log("Result : ", result)
      if (result.filePath === undefined) {
        con.log("No file selected")
      } else {
        let index = result.filePath.lastIndexOf('/')
        let fileName = result.filePath.substring(index+1)
        if (fileName.substring(fileName.lastIndexOf('.') + 1) != 'txt') {
          fileName = fileName + '.txt'
        }
        let path = result.filePath.substring(0,index+1)

        // we create the corpus 'big string' file from corpus2 array
        let corpusFile= ""
        for (const a of corpus2) {
          corpusFile += a.header + a.title + " \r\n\n" + a.content + " \r\n\n"
        }

        fs.appendFile(path + fileName, corpusFile, function (err) {
          if (err) throw err;
        });
      }
    })
  }

  const handleDate = async(article, url) => {
    let date = ''
    if (article.published == "") {
      const response = await fetch("http://51.210.110.73/api/tests/extract/url=" + encodeURIComponent(url))
      const data = await response.json();
      let calculatedDate = extractDate(data, {locale: 'fr'});
      if (calculatedDate.length > 0 && calculatedDate[0] != '') {
        date = calculatedDate[0].date
      } else {
        let extractedDate = data.match(/\d/g);
        date = extractedDate.slice(0, 8).join('')
        return date
      }
    } else {
      date = article.published
    }
    if (date == '') {
      let newDate = article.content.match(/[0-9][0,9][-/]...[0-9][0,9][0-9][0,9]/g)
      if (newDate.length > 0) {
        date = newDate[0]
      } else {
        date = ""
      }
    } 
    date = date.substring(0,10)
    let month = "" + date.match(/[/-][0-9][0-9][/-]/g)
    let year = date.match(/[0-9][0-9][0-9][0-9]/g)
    let day = date.replace(month, '').replace(year, '')
    month = month.replace(/(\/|-)/g, '')
    con.log("Date formated : " + day + month + year)
    return (day + month + year)
  }

  // corpus processing functions
  const processCorpus = async() => {
    setLoading(true)
    setShowStart(false)
    setTotal(data.length)
    let tempCorpus = ""
    let tempCorpus2 = []
    let counter = 0
    // let tempSelection = ""
    for (const url of data) {
      counter ++
      setProgress(counter)
      try {
        let response = await fetch("https://us-central1-technews-251304.cloudfunctions.net/article-parser?url="
        + url)
        let responseJson = await response.json()
        let article = responseJson.data
        con.log("Article : ", article.title)
        setCurrentTitle(article.title)

        // Handle header
        let preHeader = "****"
        // source
        if (variables[0]) {
          try {preHeader = preHeader + " *source_" + 
          removeDiacritics(article.source).replace(/'| /g, "").replace(/\.fr/g, "")} catch{}
        }

        if (variables[1]) {
          let date = await handleDate(article, url)
          preHeader = preHeader + " *date_" + date
        }

        // if (variables[3]) {
        //   if (typeof(article.author) != 'undefined' && article.author != '') {
        //     preHeader = preHeader + " *auteur_" + article.author
        //   } else {
        //     preHeader = preHeader + " *auteur_Inconnu"
        //   }
        // }

        let header = preHeader + " \r\n"
        let content = await h2p(article.content) + " \r\n\n"
        tempCorpus = tempCorpus + header + article.title + " \r\n\n" + content
        let newItem = {
          header: header,
          title: article.title,
          content: content,
          full: header + article.title + " \r\n\n" + content
        }
        tempCorpus2.push(newItem)
        setTestCorpus(testCorpus => [...testCorpus, newItem])
      } catch {}
    }

    updateCorpus2(tempCorpus2);
    setCorpus(tempCorpus)

    setCurrentTitle("Terminé !")
    setTimeout(() => {
      setLoading(false)
      setTimeout(() => {
        setShowEnder(false)
      }, 4000);
    }, 1000);
  } 

  const renderItem = ({item, index}) => {
    return (
      <View style={{flex: 1, paddingHorizontal: 20, paddingTop: 20, 
                    backgroundColor: (index % 2) == 1 ? '#1E1E1E' : '#333333'}}>
        <View style={{alignItems: 'center', marginBottom: 10}}>
          <View style={{alignSelft: 'center', height: 35, borderRadius: 5, backgroundColor: '#084244', 
                        alignItems: 'center', justifyContent: 'center', width: '80%'}}>
            <Text style={{color: 'white', fontSize: 13, fontWeight: 'bold'}}>{item.header}</Text>
          </View>
        </View>
        <Text style={{color: '#109194', fontSize: 18, marginVertical: 10, fontWeight: 'bold'}}>{item.title}</Text>
        <Text style={{color: 'white', marginBottom: 20}}>{item.content}</Text>
      </View>
    )
  }

  const menuItems = [
    {
      label: "Créer une règle complexe",
      submenu: [
        { label: "Supprimer du début à la sélection", click: () => getSelectionHandler(2) },
        {
          label: "Supprimer de la sélection à la fin",
          click: () => getSelectionHandler(3)
        },
        {
          label: "Supprimer de la sélection à... ",
          click: () => getSelectionHandler(4),
        },
      ]
    },
    {
      label: "Supprimer toutes les occurences de la sélection",
      click: () => getSelectionHandler(1)
    }
  ];

  const menuItems2 = [
    {
      label: "Créer une règle complexe",
      submenu: [
        { label: "Supprimer du début à la sélection", click:  () => getSelectionHandler(2) },
        {
          label: "Supprimer de la sélection à la fin",
          click: () => getSelectionHandler(3)
        },
        {
          label: "Supprimer de « " + firstSelection + " » à la sélection",
          click: () => getSelectionHandler(4),
        },
      ]
    },
    {
      label: "Supprimer toutes les occurences de la sélection",
      click: () => getSelectionHandler(1)
    }
  ];

  const getSelectionHandler = async (rule) => {
    const selection = window.getSelection();
    switch (rule) {
      case 1:
        addRule({type: 1, text1: selection.toString(), text2: ""})
        break;
      case 2: 
        con.log("Rules : ", rules)
        addRule({type: 2, text1: selection.toString(), text2: ""})
        break;
      case 3: 
        addRule({type: 3, text1: selection.toString(), text2: ""})
      break;
      case 4:
        if (firstSelection == '') {
          let s = selection.toString()
          addRule({type: 4, text1: s, text2: ""})
          setFirstSelection(s)
        } else {
          updateRule(selection.toString())
        }
        break;
      default:
        break
    }
  };

  removeRule = (index) => {
    setUpdatingRules(true)
    con.log("Index : ", index)
    con.log("Rules : ", rules)
    con.log("previousCorpus : ", previousCorpus)
    let newRules = [...rules]
    newRules.splice(index, 1)
    // con.log("newRules : ", newRules)
    setRules(rules => newRules)
    let newCorpus = _.cloneDeep(previousCorpus[index])
    con.log("new corpus : ", newCorpus)
    updateCorpus2(newCorpus)
  }
  

  return (
    <View style={{width: '90%'}}>
      <SubMenu getTab={updateTab}/>
      {tab == 1 && <View>
        <ScrollView style={{margin: 20}}>
          <FilePicker gFile={file} getFile={updateFile} getData={updateData}/>
          <View style={{height: 1, backgroundColor: '#5F5F5F'}}/>
          <VariablesPicker getVariables={updateVariables} gVariables={variables}/>
          <View style={{height: 1, backgroundColor: '#5F5F5F'}}/>
          <Rules rules={rules} removeRule={(index) => removeRule(index)}/>
          {/* <Cleaner/> */}
          {file != "" && showEnder &&
          <View>
            <View style={{height: 1, backgroundColor: '#5F5F5F', marginBottom: 20}}/>
            {showStart && <Ender process={processCorpus}/>}
            {loading && <View style={{justifyContent: 'center', height: 100, alignItems: 'center'}}>
              <ActivityIndicator size='large' color='#15B0AF'/>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
                <Text style={{color: 'gray', marginLeft: 10}}>Loading {progress} / {total} :</Text>
                <Text style={{color: 'gray', marginLeft: 10}}>{currentTitle}</Text>
              </View>
            </View>}
            {!loading && !showStart && 
              <Text style={{color: '#15B0AF', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginTop: 20}}>
                Corpus créé ! Utilisez l'onglet "Aperçu" pour créer des règles de nettoyage.
              </Text>
            }
          </View>}
          {/* <FlatList
            style={{height: 600}}
            data={corpus2}
            extraData={corpus2}
            renderItem={renderItem}
            keyExtractor={item => item.title}
          /> */}
        </ScrollView>
      </View>}
      {firstSelection == '' && <ContextMenuArea menuItems={menuItems}>
        <View style={{width: '110%', marginLeft: '-5%', height: tab == 2 ? 670 : 0}}>
          <FlatList
            style={{height: 600}}
            data={corpus2}
            // data={testCorpus.length > 0 ? testCorpus : corpus2}
            // extraData={testCorpus}
            renderItem={renderItem}
            keyExtractor={item => item.title}
          />
          {tab == 2 &&
          <TouchableOpacity 
            style={{backgroundColor: '#1E1E1E', marginTop: 15, height: 50, width: 250, borderRadius: 5, 
                    alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}} 
            onPress={() => saveFile()}>
            <Text style={{color: 'white', textAlign: 'center'}}>Sauvegarder le corpus</Text>
          </TouchableOpacity>}
          <Text style={{color: 'white'}}>{firstSelection}</Text>
        </View>
      </ContextMenuArea>}
      {firstSelection != '' && 
      <ContextMenuArea menuItems={menuItems2}>
        {tab == 2 && <View style={{width: '110%', marginLeft: '-5%'}}>
          <FlatList
            style={{height: 600}}
            data={corpus2}
            renderItem={renderItem}
            keyExtractor={item => item.title}
          />
          <TouchableOpacity 
            style={{backgroundColor: '#1E1E1E', marginTop: 15, height: 50, width: 250, borderRadius: 5, 
                    alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}} 
            onPress={() => saveFile()}>
            <Text style={{color: 'white', textAlign: 'center'}}>Sauvegarder le corpus</Text>
          </TouchableOpacity>
        </View>}
      </ContextMenuArea>}
    </View>
  );
}

export default Corpusier;