export function saveSessions(sessions: any) {
  localStorage.setItem(
    "chat_sessions",
    JSON.stringify(sessions)
  );
}

export function loadSessions() {
  const data =
    localStorage.getItem("chat_sessions");

  return data ? JSON.parse(data) : [];
}

export function saveMode(mode: string) {
  localStorage.setItem("chat_mode", mode);
}

export function loadMode() {
  return localStorage.getItem("chat_mode");
}