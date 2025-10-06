import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface DatePickerFieldProps {
  label: string;
  value: string; // El valor se recibirá como string (formato final)
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
}

// Función auxiliar para formatear la fecha
const formatDate = (date: Date): string => {
  // Aquí puedes definir el formato que prefieras (Ej: YYYY-MM-DD o Ene 2024)
  // Usaremos un formato simple y legible: DD/MM/YYYY
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses son 0-indexados
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder = "Selecciona una fecha",
  error,
}) => {
  const [date, setDate] = useState(value ? new Date() : new Date()); // Opcional: inicializar con el valor existente
  const [show, setShow] = useState(false);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || date;

    // Ocultar el selector de fecha
    // En iOS, necesitamos una lógica específica para saber si se hizo "cancel" o "done"
    setShow(Platform.OS === "ios" ? true : false);

    if (event.type === "set" || Platform.OS === "android") {
      setDate(currentDate);
      // Formatear la fecha a string y enviarla al formulario padre
      onChangeText(formatDate(currentDate));
    } else if (event.type === "dismissed" && Platform.OS === "ios") {
      setShow(false); // Ocultar si se canceló en iOS
    }
  };

  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* Usamos un TouchableOpacity para abrir el DatePicker */}
      <TouchableOpacity onPress={showDatePicker} style={styles.inputContainer}>
        <Text
          style={[
            styles.textInput,
            error && styles.inputError,
            !value && styles.placeholderText,
          ]}
        >
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date" // Modo solo de fecha
          display={Platform.OS === "ios" ? "spinner" : "default"} // Mejor UI en iOS
          onChange={handleDateChange}
          // Puedes establecer el idioma del selector si es necesario
          locale="es-ES"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  inputContainer: {
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  textInput: {
    fontSize: 16,
    padding: 12,
    color: "#000",
  },
  placeholderText: {
    color: "#777",
  },
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});
