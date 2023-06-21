import Paho from "paho-mqtt";
import { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Button, View } from 'react-native';

var client = new Paho.Client(
  "localhost",
  Number(9001),
  `mqtt-async-test-${parseInt(Math.random() * 100)}`
);

export default function App() {

  const [chuva, setChuva] = useState("");
  const [janela, setJanela] = useState("");

  function onMessage(message) {
    if (message.destinationName === "chuva") {
      setChuva(message.payloadString);
      if (message.payloadString == "Esta a chover!") {
        setJanela("Janela Fechada");
      } else {
        setJanela("Janela Aberta");
      }}
    else if (message.destinationName === "janela") {
      if (message.payloadString === "1") {
        setJanela("Janela Aberta")
      } else {
        setJanela("Janela Fechada")
      }
    }
  }

  useEffect(() => {
    client.connect( {
      onSuccess: () => { 
      console.log("Connected!");
      client.subscribe("chuva");
      client.subscribe("janela");
      client.onMessageArrived = onMessage;
    },
    onFailure: () => {
      console.log("Failed to connect!"); 
    }
  });
  }, [])

  function changeValue(c, a) {
    const message = new Paho.Message(a);
    message.destinationName = "janela";
    c.send(message);
  }

  return (
    <View style={styles.container}>
      <View style={{margin:10}}>
      <Text style={{fontWeight: "semi-bold", fontSize: "25px"}}>Projeto IOT - Eduardo Gomes e André Vala</Text></View>
      <View style={{margin:10}}>
      <Button onPress={() => { changeValue(client, "1");} } title="Abrir Janela"/></View>
      <Button onPress={() => { changeValue(client, "0");} } title="Fechar Janela"/>
      <View style={{margin:10}}>
      <Text>{chuva}</Text></View>
      <View style={{margin:10}}>
      <Text>{janela}</Text></View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});