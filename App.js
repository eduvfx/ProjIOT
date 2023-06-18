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

  const [value, setValue] = useState(0);

  function onMessage(message) {
    if (message.destinationName === "teste")
        setValue(parseInt(message.payloadString));
  }

  useEffect(() => {
    client.connect( {
      onSuccess: () => { 
      console.log("Connected!");
      client.subscribe("teste");
      client.onMessageArrived = onMessage;
    },
    onFailure: () => {
      console.log("Failed to connect!"); 
    }
  });
  }, [])

  function changeValue(c) {
    const message = new Paho.Message((value + 1).toString());
    message.destinationName = "teste";
    c.send(message);
  }

  return (
    <View style={styles.container}>
      <Text>Value is: {value}</Text>
      <Button onPress={() => { changeValue(client);} } title="Press Me"/>
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