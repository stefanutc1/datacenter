"use client";

import { useState } from "react";

export type SystemStateType =
  | "BOOTING"
  | "ONLINE"
  | "EXPLORING"
  | "INSPECTING"
  | "WARNING"
  | "SIMULATION"
  | "NIGHT_OPERATIONS";

export const useSystemState = (initialState: SystemStateType = "ONLINE") => {
  const [state, setState] = useState<SystemStateType>(initialState);

  const setBooting = () => setState("BOOTING");
  const setOnline = () => setState("ONLINE");
  const setExploring = () => setState("EXPLORING");
  const setInspecting = () => setState("INSPECTING");
  const setSimulation = () => setState("SIMULATION");

  return {
    state,
    setState,
    setBooting,
    setOnline,
    setExploring,
    setInspecting,
    setSimulation,
  };
};
