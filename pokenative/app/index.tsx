import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "./../components/ThemedText"; // Adjust the path as necessary

export default function Index() {
  return (
    <SafeAreaView
      style ={styles.container}>
      <ThemedText variant="headline" color="white">Pokédex</ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF0000",
    
  }
});

