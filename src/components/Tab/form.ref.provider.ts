import { createContext } from "react";

export const FormRefContext = createContext<{setDisabled: (value: boolean | undefined) => void} | null>(null);