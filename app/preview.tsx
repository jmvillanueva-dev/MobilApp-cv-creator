import React from "react";
import { View, StyleSheet } from "react-native";
import { useCVContext } from "../context/CVContext";
import { CVPreview } from "../components/CVPreview";

export default function PreviewScreen() {
  const { cvData } = useCVContext();

  return (
    <View style={styles.container}>
      <CVPreview cvData={cvData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
