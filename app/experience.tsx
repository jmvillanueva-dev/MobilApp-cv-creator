// app/experience.tsx (Modificado)

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
import { DatePickerField } from "@/components/DatePickerField";
import { useCVContext } from "../context/CVContext";
import { Experience } from "../types/cv.types";

// 1. Definir el tipo para los errores, excluyendo 'id'
type ExperienceFormKeys = keyof Omit<Experience, "id">;

interface FormErrors {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

// Definimos la longitud mínima requerida
const MIN_LENGTH = 3;

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();

  const [formData, setFormData] = useState<Omit<Experience, "id">>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Función de validación de campo
  const validateField = (field: ExperienceFormKeys, value: string): boolean => {
    let error = "";
    const requiredFields: ExperienceFormKeys[] = [
      "company",
      "position",
      "startDate",
    ];
    // Campos de texto a los que se aplicará la longitud mínima (incluyendo opcionales como description)
    const textFields: ExperienceFormKeys[] = [
      "company",
      "position",
      "description",
      "endDate", // endDate y startDate usan DatePicker, pero la validación de fecha ya se maneja allí.
    ];

    const trimmedValue = value.trim();

    // 1. Validación de REQUERIDO (solo para company, position, startDate)
    if (requiredFields.includes(field) && !trimmedValue) {
      error = `El campo de ${field} es obligatorio.`;
    }
    // 2. Validación de LONGITUD MÍNIMA
    else if (
      textFields.includes(field) &&
      trimmedValue.length > 0 && // Solo si tiene contenido (para no pisar el error de campo obligatorio)
      trimmedValue.length < MIN_LENGTH
    ) {
      error = `Debe tener al menos ${MIN_LENGTH} caracteres.`;
    }

    // Nota sobre DatePicker: Los campos startDate y endDate (si usan el DatePicker)
    // tendrán formatos de fecha que cumplen con la longitud, por lo que la validación
    // de longitud no los afectará negativamente, pero su principal validación es si están vacíos.

    // Actualizar el estado de errores
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    return error.length === 0; // Devuelve true si no hay error
  };

  // Función para manejar el cambio de texto y la validación en tiempo real
  const handleInputChange = (field: ExperienceFormKeys, text: string) => {
    setFormData({ ...formData, [field]: text });
    validateField(field, text); // Validación en tiempo real
  };

  // Función de validación final del formulario
  const validateForm = () => {
    let isFormValid = true;

    // Lista de campos a validar antes de guardar
    const fieldsToValidate: ExperienceFormKeys[] = [
      "company",
      "position",
      "startDate",
      "endDate",
      "description",
    ];

    fieldsToValidate.forEach((field) => {
      // Ejecutar la validación con el valor actual del estado
      if (!validateField(field, formData[field] || "")) {
        isFormValid = false;
      }
    });

    // El setErrors final ya está cubierto por las llamadas a validateField dentro del forEach
    return isFormValid;
  };

  const handleAdd = () => {
    if (!validateForm()) {
      Alert.alert(
        "Error de Validación",
        "Por favor corrige todos los errores antes de agregar la experiencia. Asegúrate de que los campos de texto tengan al menos 3 caracteres."
      );
      return;
    }

    const newExperience: Experience = {
      id: Date.now().toString(),
      ...formData,
    };

    addExperience(newExperience);

    // Limpiar formulario y errores
    setFormData({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setErrors({});

    Alert.alert("Éxito", "Experiencia agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteExperience(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

        {/* Campo Empresa */}
        <InputField
          label="Empresa *"
          placeholder="Nombre de la empresa"
          value={formData.company}
          onChangeText={(text) => handleInputChange("company", text)}
          error={errors.company}
        />

        {/* Campo Cargo */}
        <InputField
          label="Cargo *"
          placeholder="Tu posición"
          value={formData.position}
          onChangeText={(text) => handleInputChange("position", text)}
          error={errors.position}
        />

        {/* Fecha de Inicio (DatePickerField no aplica MIN_LENGTH) */}
        <DatePickerField
          label="Fecha de Inicio *"
          placeholder="DD/MM/YYYY"
          value={formData.startDate}
          onChangeText={(text) => handleInputChange("startDate", text)}
          error={errors.startDate}
        />

        {/* Fecha de Fin (DatePickerField no aplica MIN_LENGTH) */}
        <DatePickerField
          label="Fecha de Fin"
          placeholder="DD/MM/YYYY o 'Actual'"
          value={formData.endDate}
          onChangeText={(text) => handleInputChange("endDate", text)}
          error={errors.endDate}
        />

        {/* Campo Descripción */}
        <InputField
          label="Descripción"
          placeholder="Describe tus responsabilidades y logros..."
          value={formData.description}
          onChangeText={(text) => handleInputChange("description", text)}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }}
          error={errors.description}
        />

        <NavigationButton title="Agregar Experiencia" onPress={handleAdd} />

        {/* ... (El resto del listado y estilos) */}
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
