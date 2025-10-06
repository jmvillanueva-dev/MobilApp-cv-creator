import React from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const InputField = ({ label, error, ...props }: InputFieldProps) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 4,
  },
  inputError: {
    borderColor: "#e74c3c",
  },
});

export default InputField;
