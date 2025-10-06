import React, { createContext, useContext, useState, ReactNode } from "react";
import { CVData, PersonalInfo, Experience, Education } from "../types/cv.types";

/**
 * Context to manage CV data across the app.
 * Provides methods to update personal info, experiences, and education.
 */
interface CVContextType {
  cvData: CVData;
  updatePersonalInfo: (info: PersonalInfo) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Experience) => void;
  deleteExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Education) => void;
  deleteEducation: (id: string) => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [cvData, setCVData] = useState<CVData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    experiences: [],
    education: [],
  });

  const updatePersonalInfo = (info: PersonalInfo) => {
    setCVData((prev) => ({ ...prev, personalInfo: info }));
  };

  const addExperience = (exp: Experience) => {
    setCVData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, exp],
    }));
  };

  const updateExperience = (id: string, exp: Experience) => {
    setCVData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? exp : e)),
    }));
  };

  const deleteExperience = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  };

  const addEducation = (edu: Education) => {
    setCVData((prev) => ({
      ...prev,
      education: [...prev.education, edu],
    }));
  };

  const updateEducation = (id: string, edu: Education) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? edu : e)),
    }));
  };

  const deleteEducation = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  return (
    <CVContext.Provider
      value={{
        cvData,
        updatePersonalInfo,
        addExperience,
        updateExperience,
        deleteExperience,
        addEducation,
        updateEducation,
        deleteEducation,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCVContext = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error("useCVContext debe usarse dentro de CVProvider");
  }
  return context;
};
