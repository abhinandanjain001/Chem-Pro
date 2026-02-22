import { CBTResult, ChatMessage, Note, StoredUser, User, UserRole } from "../types";

const USERS_KEY = "chemgenius_users";
const SESSION_KEY = "chemgenius_session";
const NOTES_KEY = "chemgenius_notes";
const CBT_RESULTS_KEY = "chemgenius_cbt_results";
const chatKey = (userId: string) => `chemgenius_chat_${userId}`;
const ADMIN_KEY = "chemgenius_admin_verified";

// Secret key for admin access (change this to your desired key)
const ADMIN_SECRET_KEY = "ChemGenius@2026Admin";

const loadJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const saveJson = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const toPublicUser = (user: StoredUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const getUsers = (): StoredUser[] => loadJson<StoredUser[]>(USERS_KEY, []);

export const getCurrentUser = (): User | null => {
  const session = loadJson<{ userId: string | null }>(SESSION_KEY, { userId: null });
  if (!session.userId) return null;
  const users = getUsers();
  const user = users.find(u => u.id === session.userId);
  return user ? toPublicUser(user) : null;
};

export const setSessionUser = (userId: string | null) => {
  saveJson(SESSION_KEY, { userId });
};

export const signUp = (name: string, email: string, password: string, role: UserRole): User => {
  const users = getUsers();
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    throw new Error("Email already registered.");
  }
  const storedUser: StoredUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    name,
    email,
    role,
    password,
    createdAt: new Date().toISOString(),
  };
  const updated = [storedUser, ...users];
  saveJson(USERS_KEY, updated);
  setSessionUser(storedUser.id);
  return toPublicUser(storedUser);
};

export const login = (email: string, password: string): User => {
  const users = getUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    throw new Error("Invalid email or password.");
  }
  setSessionUser(user.id);
  return toPublicUser(user);
};

export const logout = () => {
  setSessionUser(null);
};

export const getNotes = (): Note[] => loadJson<Note[]>(NOTES_KEY, []);

export const addNote = (note: Omit<Note, "id" | "createdAt">): Note => {
  const notes = getNotes();
  const created: Note = {
    ...note,
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };
  saveJson(NOTES_KEY, [created, ...notes]);
  return created;
};

export const deleteNote = (noteId: string) => {
  const notes = getNotes();
  saveJson(NOTES_KEY, notes.filter(n => n.id !== noteId));
};

export const getCbtResults = (): CBTResult[] => loadJson<CBTResult[]>(CBT_RESULTS_KEY, []);

export const addCbtResult = (result: Omit<CBTResult, "id" | "createdAt">): CBTResult => {
  const results = getCbtResults();
  const created: CBTResult = {
    ...result,
    id: `cbt_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };
  saveJson(CBT_RESULTS_KEY, [created, ...results]);
  return created;
};

export const getResultsForUser = (userId: string): CBTResult[] => {
  const results = getCbtResults();
  return results.filter(r => r.userId === userId);
};

export const getChatHistory = (userId: string): ChatMessage[] =>
  loadJson<ChatMessage[]>(chatKey(userId), []);

export const addChatMessage = (userId: string, message: Omit<ChatMessage, "id" | "createdAt">): ChatMessage => {
  const history = getChatHistory(userId);
  const created: ChatMessage = {
    ...message,
    id: `chat_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };
  saveJson(chatKey(userId), [...history, created]);
  return created;
};

export const clearChatHistory = (userId: string) => {
  saveJson(chatKey(userId), []);
};

export const verifyAdminKey = (key: string): boolean => {
  if (key === ADMIN_SECRET_KEY) {
    saveJson(ADMIN_KEY, { verified: true, timestamp: Date.now() });
    return true;
  }
  return false;
};

export const isAdminVerified = (): boolean => {
  const data = loadJson<{ verified: boolean; timestamp: number }>(ADMIN_KEY, { verified: false, timestamp: 0 });
  return data.verified;
};

export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_KEY);
};
