import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";

// Tipos para facilitar el manejo de errores
type EducationFormKeys = keyof Omit<Education, "id">;

interface FormErrors {
  institution?: string;
  degree?: string;
  field?: string;
  graduationYear?: string;
}

// 🔑 Definimos la longitud mínima requerida
const MIN_LENGTH = 3;

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  const [formData, setFormData] = useState<Omit<Education, "id">>({
    institution: "",
    degree: "",
    field: "",
    graduationYear: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Función de validación de campo
  const validateField = (field: EducationFormKeys, value: string): boolean => {
    let error = "";
    const requiredFields: EducationFormKeys[] = ["institution", "degree"];
    // 🔑 Campos de texto a los que se aplica la longitud mínima
    const textFields: EducationFormKeys[] = ["institution", "degree", "field"];

    const trimmedValue = value.trim();

    // 1. Validación de REQUERIDO
    if (requiredFields.includes(field) && !trimmedValue) {
      error = `Este campo es obligatorio.`;
    }
    // 2. Validación de LONGITUD MÍNIMA
    else if (
      textFields.includes(field) &&
      trimmedValue.length > 0 && // Solo si tiene contenido (para que el error de 'obligatorio' se muestre primero)
      trimmedValue.length < MIN_LENGTH
    ) {
      error = `Debe tener al menos ${MIN_LENGTH} caracteres.`;
    }
    // 3. Validación de FORMATO (Año de Graduación)
    else if (
      field === "graduationYear" &&
      trimmedValue.length > 0 && // Solo si tiene contenido
      (!/^\d{4}$/.test(trimmedValue) ||
        parseInt(trimmedValue) > new Date().getFullYear() + 5)
    ) {
      error = "Debe ser un año válido (YYYY).";
    }

    // Actualizar el estado de errores
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    return error.length === 0;
  };

  // Función para manejar el cambio de texto y la validación en tiempo real
  const handleInputChange = (field: EducationFormKeys, text: string) => {
    setFormData({ ...formData, [field]: text });
    validateField(field, text); // Validación en tiempo real
  };

  // Función de validación final del formulario antes de agregar
  const validateForm = () => {
    let isFormValid = true;
    const fieldsToValidate: EducationFormKeys[] = [
      "institution",
      "degree",
      "field", // Incluimos el opcional 'field' para validar su longitud si tiene contenido
      "graduationYear",
    ];

    fieldsToValidate.forEach((field) => {
      if (!validateField(field, formData[field] || "")) {
        isFormValid = false;
      }
    });

    return isFormValid;
  };

  const handleAdd = () => {
    if (!validateForm()) {
      Alert.alert(
        "Error de Validación",
        `Por favor corrige los errores. Los campos de texto deben tener al menos ${MIN_LENGTH} caracteres.`
      );
      return;
    }

    const newEducation: Education = {
      id: Date.now().toString(),
      ...formData,
    };

    addEducation(newEducation);

    setFormData({
      institution: "",
      degree: "",
      field: "",
      graduationYear: "",
    });
    setErrors({});

    Alert.alert("Éxito", "Educación agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta educación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteEducation(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Educación</Text>

        {/* Campo Institución */}
        <InputField
          label="Institución *"
          placeholder="Nombre de la universidad/institución"
          value={formData.institution}
          onChangeText={(text) => handleInputChange("institution", text)}
          error={errors.institution} // Pasa el error
        />

        {/* Campo Título/Grado */}
        <InputField
          label="Título/Grado *"
          placeholder="Ej: Licenciatura, Maestría"
          value={formData.degree}
          onChangeText={(text) => handleInputChange("degree", text)}
          error={errors.degree} // Pasa el error
        />

        {/* Campo Área de Estudio (Opcional) */}
        <InputField
          label="Área de Estudio"
          placeholder="Ej: Ingeniería en Sistemas"
          value={formData.field}
          onChangeText={(text) => handleInputChange("field", text)}
          error={errors.field} // Pasa el error
        />

        {/* Campo Año de Graduación */}
        <InputField
          label="Año de Graduación"
          placeholder="Ej: 2023"
          value={formData.graduationYear}
          onChangeText={(text) => handleInputChange("graduationYear", text)}
          keyboardType="numeric"
          error={errors.graduationYear} // Pasa el error
        />

        <NavigationButton title="Agregar Educación" onPress={handleAdd} />

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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  cardInstitution: {
    fontSize: 14,
    color: "#95a5a6",
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    color: "#95a5a6",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
