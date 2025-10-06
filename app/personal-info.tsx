import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "@/components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { PersonalInfo } from "@/types/cv.types";

// Definir el tipo para los errores
interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
}

// 🔑 Definimos la longitud mínima requerida
const MIN_LENGTH = 3;

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { cvData, updatePersonalInfo } = useCVContext();
  const [formData, setFormData] = useState<PersonalInfo>(cvData.personalInfo);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setFormData(cvData.personalInfo);
  }, [cvData.personalInfo]);

  // Función de validación del email
  const isValidEmail = (email: string) => {
    // Regex simple para email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función que valida un campo específico
  const validateField = (field: keyof PersonalInfo, value: string): boolean => {
    let error = "";
    const trimmedValue = value.trim();
    // Campos de texto requeridos que deben tener longitud mínima
    const requiredTextFields: (keyof PersonalInfo)[] = ["fullName", "email"];
    // Campos opcionales que, si se llenan, deben tener longitud mínima
    const optionalTextFields: (keyof PersonalInfo)[] = ["location", "summary"];

    switch (field) {
      case "fullName":
        if (!trimmedValue) {
          error = "El nombre completo es obligatorio.";
        } else if (trimmedValue.length < MIN_LENGTH) {
          error = `Debe tener al menos ${MIN_LENGTH} caracteres.`;
        }
        break;

      case "email":
        if (!trimmedValue) {
          error = "El email es obligatorio.";
        } else if (!isValidEmail(trimmedValue)) {
          error = "Formato de email inválido.";
        }
        // No aplicamos MIN_LENGTH aquí, ya que isValidEmail lo cubre.
        break;

      case "phone":
        // El teléfono es opcional, solo validamos formato si tiene contenido
        if (trimmedValue && !/^\+?[\d\s]*$/.test(trimmedValue)) {
          error = "El teléfono solo debe contener números y el signo +.";
        }
        break;

      case "location":
      case "summary":
        // 🔑 Validación de Longitud Mínima para campos OPCIONALES (si tienen valor)
        if (trimmedValue && trimmedValue.length < MIN_LENGTH) {
          error = `Debe tener al menos ${MIN_LENGTH} caracteres si lo ingresa.`;
        }
        break;
    }

    // Actualizar el estado de errores
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    return error.length === 0; // Devuelve true si no hay error
  };

  // Función para manejar el cambio de texto y la validación en tiempo real
  const handleInputChange = (field: keyof PersonalInfo, text: string) => {
    setFormData({ ...formData, [field]: text });
    validateField(field, text); // Validación en tiempo real
  };

  // Función de validación antes de guardar
  const validateForm = () => {
    let isFormValid = true;

    // Lista de todos los campos que necesitan una validación final
    const fieldsToValidate: (keyof PersonalInfo)[] = [
      "fullName",
      "email",
      "phone",
      "location",
      "summary",
    ];

    fieldsToValidate.forEach((field) => {
      // Usamos el valor del formData para la comprobación final
      if (!validateField(field, formData[field] || "")) {
        isFormValid = false;
      }
    });

    return isFormValid;
  };

  const handleSave = () => {
    if (!validateForm()) {
      // Muestra una alerta general si el formulario no es válido
      Alert.alert(
        "Error de Validación",
        "Por favor, corrige los errores en el formulario y verifica la longitud mínima de 3 caracteres."
      );
      return;
    }

    // Si la validación es exitosa
    updatePersonalInfo(formData);
    Alert.alert("Éxito", "Información guardada correctamente.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Campo Nombre Completo */}
        <InputField
          label="Nombre completo*"
          placeholder="Jhonny Villanueva"
          value={formData.fullName}
          onChangeText={(text) => handleInputChange("fullName", text)}
          error={errors.fullName} // Pasar el error al componente InputField
        />

        {/* Campo Email */}
        <InputField
          label="Email *"
          placeholder="vj@email.com"
          value={formData.email}
          onChangeText={(text) => handleInputChange("email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email} // Pasar el error al componente InputField
        />

        {/* Campo Teléfono */}
        <InputField
          label="Teléfono"
          placeholder="+593 999 999 9999"
          value={formData.phone}
          onChangeText={(text) => handleInputChange("phone", text)}
          keyboardType="phone-pad"
          error={errors.phone} // Pasar el error al componente InputField
        />

        {/* Campo Ubicación */}
        <InputField
          label="Ubicación"
          placeholder="Quito, Ecuador"
          value={formData.location}
          onChangeText={(text) => handleInputChange("location", text)}
          error={errors.location} // Ahora pasamos el error
        />

        {/* Campo Resumen Profesional */}
        <InputField
          label="Resumen Profesional"
          placeholder="Describe brevemente tu perfil profesional..."
          value={formData.summary}
          onChangeText={(text) => handleInputChange("summary", text)}
          multiline
          numberOfLines={4}
          error={errors.summary} // Ahora pasamos el error
          // Nota: Lo ideal es que estos estilos de multiline se manejen dentro de InputField
          style={{
            height: 100,
            textAlignVertical: "top",
            borderWidth: 2,
            borderColor: errors.summary ? "red" : "#fff", // Estilo de error visual aquí
            borderRadius: 8,
            padding: 12,
            backgroundColor: "#fff",
          }}
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
