import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { RNAsyncStorageLevel } from 'rn-async-storage-level'
import AsyncStorage from '@react-native-async-storage/async-storage'

// create a new db
const db = new RNAsyncStorageLevel(AsyncStorage, 'test')
const db_2 = new RNAsyncStorageLevel(AsyncStorage, 'test_2')

async function withAsync() {
  try {
    // listen for 'put' events
    db.on('put', (key, value) => {
      console.log('event: put', key, value)
    })

    // listen for 'del' events
    db.on('del', (key) => {
      console.log('event: del', key)
    })

    // listen for 'clear' events
    db.on('clear', () => {
      console.log('event: clear')
    })

    // write some data
    await db.put('key1', 'value1')
    await db.put('key2', 'value2')

    // get the value of one key
    console.log(await db.get('key1'))

    // get the values of multiple keys
    console.log(await db.getMany(['key1', 'key2']))

    // get all keys
    console.log(await db.keys().all())

    // get all values
    console.log(await db.values().all())

    // get all entries
    console.log(await db.iterator().all())

    // delete a key
    await db.del('key1')

    await db_2.put('key4', 'value4')

    console.log(await AsyncStorage.getAllKeys())

    // clear db
    await db.clear()
    await db_2.clear()

    console.log(await AsyncStorage.getAllKeys())
  } catch (err) {
    console.error(err)
  }
}
withAsync()

function withCallbacks() {
  db.on('put', (key, value) => {
    console.log('event: put', key, value)
  })

  db.on('del', (key) => {
    console.log('event: del', key)
  })

  db.on('clear', () => {
    console.log('event: clear')
  })

  db.put('key1', 'value1', (err) => {
    if (err) console.error(err)
    console.log('put callback')
  })

  db.put('key2', 'value2', (err) => {
    if (err) console.error(err)
    console.log('put callback')
  })

  db.get('key1', (err, result) => {
    if (err) console.error(err)
    console.log('get callback', result)
  })

  db.getMany(['key1', 'key2'], (err, result) => {
    if (err) console.error(err)
    console.log('getMany callback', result)
  })

  db.keys().all((err, result) => {
    if (err) console.error(err)
    console.log('keys callback', result)
  })

  db.values().all((err, result) => {
    if (err) console.error(err)
    console.log('values callback', result)
  })

  db.iterator().all((err, result) => {
    if (err) console.error(err)
    console.log('iterator callback', result)
  })

  // db.del('key1', (err) => {
  //   if (err) console.error(err)
  //   console.log('del callback')
  // })

  // db.clear((err) => {
  //   if (err) console.error(err)
  //   console.log('clear callback')
  // })
}
// withCallbacks()

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
