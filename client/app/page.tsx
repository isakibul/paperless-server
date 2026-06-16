"use client";

import {
  Building2,
  CheckCircle2,
  DoorOpen,
  FileText,
  KeyRound,
  Landmark,
  Loader2,
  Plus,
  ShieldCheck,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { AuthResponse, AuthSession, Role } from "@/types/auth";

type Mode =
  | "organizationLogin"
  | "organizationRegister"
  | "departmentLogin"
  | "departmentRegister"
  | "staffLogin"
  | "staffRegister";

type FormState = Record<string, string>;

const storageKey = "paperless.sessions";

const modeLabels: Record<Mode, string> = {
  organizationLogin: "Org login",
  organizationRegister: "New org",
  departmentLogin: "Dept login",
  departmentRegister: "New dept",
  staffLogin: "Staff login",
  staffRegister: "New staff",
};

const modeIcons: Record<Mode, React.ReactNode> = {
  organizationLogin: <Landmark aria-hidden="true" />,
  organizationRegister: <Plus aria-hidden="true" />,
  departmentLogin: <Building2 aria-hidden="true" />,
  departmentRegister: <DoorOpen aria-hidden="true" />,
  staffLogin: <ShieldCheck aria-hidden="true" />,
  staffRegister: <UserRoundPlus aria-hidden="true" />,
};

const fieldsByMode: Record<
  Mode,
  Array<{
    name: string;
    label: string;
    type?: string;
    options?: string[];
  }>
> = {
  organizationLogin: [
    { name: "organizationUsername", label: "Organization username" },
    { name: "password", label: "Password", type: "password" },
  ],
  organizationRegister: [
    { name: "organizationUsername", label: "Organization username" },
    { name: "organizationName", label: "Organization name" },
    { name: "organizationType", label: "Organization type" },
    { name: "about", label: "About" },
    { name: "password", label: "Password", type: "password" },
  ],
  departmentLogin: [
    { name: "organizationUsername", label: "Organization username" },
    { name: "departmentUsername", label: "Department username" },
    { name: "password", label: "Password", type: "password" },
  ],
  departmentRegister: [
    { name: "departmentUsername", label: "Department username" },
    { name: "departmentName", label: "Department name" },
    { name: "about", label: "About" },
    { name: "password", label: "Password", type: "password" },
  ],
  staffLogin: [
    { name: "organizationUsername", label: "Organization username" },
    { name: "departmentUsername", label: "Department username" },
    { name: "username", label: "Staff username" },
    { name: "password", label: "Password", type: "password" },
  ],
  staffRegister: [
    { name: "fullName", label: "Full name" },
    { name: "username", label: "Staff username" },
    { name: "role", label: "Role", options: ["Staff", "Head"] },
    { name: "password", label: "Password", type: "password" },
  ],
};

const endpoints: Record<Mode, string> = {
  organizationLogin: "/auth/organization-login",
  organizationRegister: "/auth/organization-register",
  departmentLogin: "/auth/department-login",
  departmentRegister: "/auth/department-register",
  staffLogin: "/auth/staff-login",
  staffRegister: "/auth/staff-register",
};

const modeRoles: Partial<Record<Mode, Role>> = {
  organizationLogin: "organization",
  departmentLogin: "department",
  staffLogin: "staff",
};

function makeSession(mode: Mode, response: AuthResponse): AuthSession | null {
  const role = modeRoles[mode];
  const token = response.data.token;

  if (!role || typeof token !== "string") {
    return null;
  }

  if (role === "organization") {
    return {
      role,
      token,
      label: String(response.data.organizationUsername),
      details: {
        id: String(response.data.id),
        username: String(response.data.organizationUsername),
      },
    };
  }

  if (role === "department") {
    return {
      role,
      token,
      label: String(response.data.departmentName),
      details: {
        id: String(response.data.id),
        username: String(response.data.departmentUsername),
        organization: String(response.data.organizationUsername),
      },
    };
  }

  return {
    role,
    token,
    label: String(response.data.fullName),
    details: {
      id: String(response.data.id),
      username: String(response.data.username),
      department: String(response.data.departmentName),
      organization: String(response.data.organizationName),
      role: String(response.data.role),
    },
  };
}

function sessionCopy(role: Role): string {
  if (role === "organization") {
    return "Organization token";
  }

  if (role === "department") {
    return "Department token";
  }

  return "Staff token";
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("organizationLogin");
  const [form, setForm] = useState<FormState>({ role: "Staff" });
  const [sessions, setSessions] = useState<AuthSession[]>([]);
  const [selectedOrgToken, setSelectedOrgToken] = useState("");
  const [selectedDeptToken, setSelectedDeptToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const organizationSessions = useMemo(
    () => sessions.filter((session) => session.role === "organization"),
    [sessions],
  );
  const departmentSessions = useMemo(
    () => sessions.filter((session) => session.role === "department"),
    [sessions],
  );

  useEffect(() => {
    const savedSessions = window.localStorage.getItem(storageKey);

    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions) as AuthSession[];
      setSessions(parsedSessions);
      setSelectedOrgToken(
        parsedSessions.find((session) => session.role === "organization")
          ?.token || "",
      );
      setSelectedDeptToken(
        parsedSessions.find((session) => session.role === "department")
          ?.token || "",
      );
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(sessions));
  }, [sessions]);

  function updateForm(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function clearStatus() {
    setMessage("");
    setError("");
  }

  function resetSessions() {
    setSessions([]);
    setSelectedOrgToken("");
    setSelectedDeptToken("");
    setMessage("Sessions cleared");
    setError("");
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearStatus();
    setIsSubmitting(true);

    try {
      const token =
        mode === "departmentRegister"
          ? selectedOrgToken
          : mode === "staffRegister"
            ? selectedDeptToken
            : undefined;

      const response = await apiRequest(endpoints[mode], form, token);
      const session = makeSession(mode, response);

      if (session) {
        setSessions((current) => [
          session,
          ...current.filter((item) => item.role !== session.role),
        ]);

        if (session.role === "organization") {
          setSelectedOrgToken(session.token);
        }

        if (session.role === "department") {
          setSelectedDeptToken(session.token);
        }
      }

      setMessage(response.message);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Request failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">
            <FileText aria-hidden="true" />
          </div>
          <div>
            <p>Paperless</p>
            <span>Access Console</span>
          </div>
        </div>

        <nav className="modeList" aria-label="Authentication modes">
          {(Object.keys(modeLabels) as Mode[]).map((item) => (
            <button
              className={mode === item ? "modeButton active" : "modeButton"}
              key={item}
              onClick={() => {
                setMode(item);
                clearStatus();
              }}
              type="button"
            >
              {modeIcons[item]}
              <span>{modeLabels[item]}</span>
            </button>
          ))}
        </nav>

        <button className="ghostButton" onClick={resetSessions} type="button">
          <KeyRound aria-hidden="true" />
          <span>Clear sessions</span>
        </button>
      </aside>

      <section className="workspace">
        <div className="topbar">
          <div>
            <p className="eyebrow">Auth workspace</p>
            <h1>{modeLabels[mode]}</h1>
          </div>
          <div className="statusPill">
            <CheckCircle2 aria-hidden="true" />
            <span>{sessions.length} active</span>
          </div>
        </div>

        <div className="contentGrid">
          <section className="panel primaryPanel">
            <form onSubmit={submitForm}>
              <div className="formHeader">
                <div className="formIcon">{modeIcons[mode]}</div>
                <div>
                  <h2>{modeLabels[mode]}</h2>
                  <p>{endpoints[mode]}</p>
                </div>
              </div>

              {mode === "departmentRegister" && (
                <label className="field">
                  <span>Organization session</span>
                  <select
                    onChange={(event) => setSelectedOrgToken(event.target.value)}
                    required
                    value={selectedOrgToken}
                  >
                    <option value="">Select organization</option>
                    {organizationSessions.map((session) => (
                      <option key={session.token} value={session.token}>
                        {session.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {mode === "staffRegister" && (
                <label className="field">
                  <span>Department session</span>
                  <select
                    onChange={(event) =>
                      setSelectedDeptToken(event.target.value)
                    }
                    required
                    value={selectedDeptToken}
                  >
                    <option value="">Select department</option>
                    {departmentSessions.map((session) => (
                      <option key={session.token} value={session.token}>
                        {session.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="fieldGrid">
                {fieldsByMode[mode].map((field) => (
                  <label className="field" key={field.name}>
                    <span>{field.label}</span>
                    {field.options ? (
                      <select
                        onChange={(event) =>
                          updateForm(field.name, event.target.value)
                        }
                        value={form[field.name] || field.options[0]}
                      >
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        autoComplete="off"
                        name={field.name}
                        onChange={(event) =>
                          updateForm(field.name, event.target.value)
                        }
                        required={field.name !== "about"}
                        type={field.type || "text"}
                        value={form[field.name] || ""}
                      />
                    )}
                  </label>
                ))}
              </div>

              {(message || error) && (
                <div className={error ? "notice error" : "notice success"}>
                  {error || message}
                </div>
              )}

              <button className="submitButton" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="spin" aria-hidden="true" />
                ) : (
                  modeIcons[mode]
                )}
                <span>{isSubmitting ? "Working" : modeLabels[mode]}</span>
              </button>
            </form>
          </section>

          <section className="sessionColumn">
            <div className="sectionTitle">
              <UsersRound aria-hidden="true" />
              <h2>Sessions</h2>
            </div>

            {sessions.length === 0 ? (
              <div className="emptyState">No active sessions</div>
            ) : (
              <div className="sessionList">
                {sessions.map((session) => (
                  <article className="sessionCard" key={session.role}>
                    <div>
                      <span className={`roleBadge ${session.role}`}>
                        {session.role}
                      </span>
                      <h3>{session.label}</h3>
                    </div>
                    <dl>
                      {Object.entries(session.details).map(([key, value]) => (
                        <div key={key}>
                          <dt>{key}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <p>{sessionCopy(session.role)}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
