/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text} from 'react-native';
import LDClient from 'launchdarkly-react-native-client-sdk';

const client = new LDClient();
const clientConfig = {
  mobileKey: 'mob-43782cf5-7e9f-4350-ba5d-d3000d5099ab',
  stream: true,
  offline: false,
};

const userConfig = {key: 'user123'};

const USERS = ['user1', 'user2', 'user3', 'user4', 'user5'];

const App = () => {
  const [allFlags, setAllFlags] = useState(false);
  const [err, setError] = useState(null);

  const [identifyTime, setIdentifyTime] = useState(0);
  const [configureTime, setConfigureTime] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const startConfigure = Date.now();
        await client.configure(clientConfig, userConfig);
        setConfigureTime(Date.now() - startConfigure);

        const startIdentify = Date.now();
        const randomIndex = Math.floor(Math.random() * USERS.length);
        const randomUser = USERS[randomIndex];
        await client.identify({key: randomUser});
        setIdentifyTime(Date.now() - startIdentify);

        const flags = await client.allFlags();
        setAllFlags(flags);
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    })();

    return () => {
      client.close();
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 1, backgroundColor: 'green'}}>
          <Text
            style={{fontSize: 20}}>{`Configure took ${configureTime}ms`}</Text>
          <Text
            style={{fontSize: 20}}>{`Identify took ${identifyTime}ms`}</Text>
          <Text style={{fontSize: 20}}>{err}</Text>
        </SafeAreaView>

        <SafeAreaView style={{flex: 1}}>
          <Text
            style={{
              fontSize: 20,
              backgroundColor: 'rgba(255,255,255,0.3)',
            }}>
            <Text style={{fontSize: 20}}>All Flags</Text>
            {JSON.stringify(allFlags, null, 2)}
          </Text>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default App;
