import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { BackendPatient } from "../../lib/types";

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function usePatients() {
  const [state, setState] = useState<QueryState<BackendPatient[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    api
      .listPatients()
      .then((patients) => {
        if (!active) {
          return;
        }

        setState({
          data: patients,
          loading: false,
          error: null,
        });
      })
      .catch((error: Error) => {
        if (!active) {
          return;
        }

        setState({
          data: null,
          loading: false,
          error: error.message,
        });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}

export function usePatient(patientId?: string) {
  const [state, setState] = useState<QueryState<BackendPatient>>({
    data: null,
    loading: Boolean(patientId),
    error: null,
  });

  useEffect(() => {
    if (!patientId) {
      setState({
        data: null,
        loading: false,
        error: "Missing patient id",
      });
      return;
    }

    let active = true;

    setState({
      data: null,
      loading: true,
      error: null,
    });

    api
      .getPatient(patientId)
      .then((patient) => {
        if (!active) {
          return;
        }

        setState({
          data: patient,
          loading: false,
          error: null,
        });
      })
      .catch((error: Error) => {
        if (!active) {
          return;
        }

        setState({
          data: null,
          loading: false,
          error: error.message,
        });
      });

    return () => {
      active = false;
    };
  }, [patientId]);

  return state;
}
