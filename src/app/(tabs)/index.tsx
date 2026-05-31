import {Text, View, StyleSheet} from 'react-native';
import {StatusBar} from 'expo-status-bar';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <StatusBar style="dark"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
