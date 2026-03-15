import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";
import { PatientCard, Patient } from "../components/PatientCard";
import { usePatients } from "../hooks/usePatients";
import { getPatientListItem } from "../../lib/patients";

export function PatientList() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { data, loading, error } = usePatients();
  const patients: Patient[] = useMemo(
    () => (data ?? []).map(getPatientListItem),
    [data]
  );

  const filteredPatients = patients.filter((patient) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    return (
      patient.name.toLowerCase().includes(normalizedQuery) ||
      patient.room.toLowerCase().includes(normalizedQuery) ||
      patient.activeTask.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="pb-28 px-5 pt-6">
      <h1 className="text-foreground mb-2">Patients</h1>
      <p className="text-muted-foreground mb-5">
        {loading ? "Loading assigned patients..." : `${patients.length} assigned this shift`}
      </p>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search patients..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {error ? (
        <div className="rounded-2xl bg-[#FFEBEE] px-4 py-3 text-[#C62828]">
          Unable to load patients from the backend: {error}
        </div>
      ) : null}

      {!loading && !error && filteredPatients.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border px-4 py-6 text-muted-foreground">
          No patients matched your search.
        </div>
      ) : null}

      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onClick={() => navigate(`/patient/${patient.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
