// app/info.tsx

import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { InputField }  from "../components/InputField";
import { NavigationButton } from "@/components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { PersonalInfo } from "@/types/cv.types";


export default function PersonalInfoScreen() {
	const router = useRouter(); 
  const { cvData, updatePersonalInfo } = useCVContext();
  const [formData, setFormData] = useState<PersonalInfo>(cvData.personalInfo);

  useEffect(() => {
    setFormData(cvData.personalInfo);
  }, [cvData.personalInfo]);

  const handleSave = () => {
    if (!formData.fullName || !formData.email) {
			Alert.alert("Error", "Por favor completa al menos el nombre y el email.");
			return;
		}

		updatePersonalInfo(formData);
		Alert.alert("Éxito", "Información guardada correctamente.", [
			{ text: "OK", onPress: () => router.back() },
		]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <InputField
          label="Nombre completo*"
          placeholder="Jhonny Villanueva"
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        />

        <InputField
          label="Email *"
          placeholder="vj@email.com"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          label="Teléfono"
          placeholder="+593 999 999 9999"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          keyboardType="phone-pad"
        />

        <InputField
          label="Ubicación"
          placeholder="Quito, Ecuador"
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />

        <InputField
          label="Resumen Profesional"
          placeholder="DEscribe brevemente tu perfil profesional..."
          value={formData.summary}
          onChangeText={(text) => setFormData({ ...formData, summary: text })}
					multiline
					numberOfLines={4}
					style={{ height: 100, textAlignVertical: 'top' }}
        />

        <NavigationButton title="Guardar información" onPress={handleSave} />

				<NavigationButton
					title="Cancelar"
					onPress={() => router.back()}
					variant="secondary"
				/>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
	},
	content: {
    padding: 20,
  },
});
