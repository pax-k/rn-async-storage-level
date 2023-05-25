import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { RNAsyncStorageLevel } from 'rn-async-storage-level'
import AsyncStorage from '@react-native-async-storage/async-storage'

const storage = new RNAsyncStorageLevel(AsyncStorage, 'test')

async function test() {
  // console.log('aici')
  // await storage.put('key', 'value')
  await storage.put('key3', 'value3')
  await storage.put('key2', 'value2')
  console.log(await storage.values().all())
  // console.log('aici2')
  // const val = await storage._get('key')
  // storage._get('key', undefined, (err, data) => {
  //   console.log('err', err)
  //   console.log('data', data)
  // })
  // console.log('aici3')
  // console.log('val', val)

  // for await (const key of storage.keys()) {
  //   console.log(key)
  // }

  // // Get all at once. Setting a limit is recommended.
  // const keys = await storage.keys({ gt: 'a', limit: 10 }).all()x
  // console.log(keys)
  // const val = await storage.clear()
  // console.log(val)
  // console.log(await AsyncStorage.getAllKeys())x
}
test()

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
