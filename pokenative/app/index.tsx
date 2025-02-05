import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "./../components/ThemedText"; // Adjust the path as necessary
import { useThemeColors } from "./../hooks/useThemeColors"; // Adjust the path as necessary

export default function Index() {

  const colors = useThemeColors();

  return (
    <SafeAreaView
      style ={[styles.container, {backgroundColor: colors.tint}]}>
      <ThemedText variant="headline" color="grayWhite">Pokédex</ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  }
});

