import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Note, CBTResult, ChatMessage } from '../types';

// ===== NOTES =====
export const getNotesFirebase = async (): Promise<Note[]> => {
  try {
    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...(doc.data() as Note),
      id: doc.id,
    }));
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
};

export const addNoteFirebase = async (note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> => {
  try {
    const docRef = await addDoc(collection(db, 'notes'), {
      ...note,
      createdAt: Timestamp.now(),
    });
    return {
      ...note,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error adding note:', error);
    throw new Error('Failed to add note');
  }
};

export const deleteNoteFirebase = async (noteId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'notes', noteId));
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note');
  }
};

// ===== CBT RESULTS =====
export const getCbtResultsFirebase = async (): Promise<CBTResult[]> => {
  try {
    const q = query(collection(db, 'cbtResults'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...(doc.data() as CBTResult),
      id: doc.id,
    }));
  } catch (error) {
    console.error('Error fetching CBT results:', error);
    return [];
  }
};

export const getResultsForUserFirebase = async (userId: string): Promise<CBTResult[]> => {
  try {
    const q = query(
      collection(db, 'cbtResults'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...(doc.data() as CBTResult),
      id: doc.id,
    }));
  } catch (error) {
    console.error('Error fetching user results:', error);
    return [];
  }
};

export const addCbtResultFirebase = async (result: Omit<CBTResult, 'id' | 'createdAt'>): Promise<CBTResult> => {
  try {
    const docRef = await addDoc(collection(db, 'cbtResults'), {
      ...result,
      createdAt: Timestamp.now(),
    });
    return {
      ...result,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error adding CBT result:', error);
    throw new Error('Failed to save test result');
  }
};

// ===== CHAT MESSAGES =====
export const getChatHistoryFirebase = async (userId: string): Promise<ChatMessage[]> => {
  try {
    const q = query(
      collection(db, `chatHistory_${userId}`),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...(doc.data() as ChatMessage),
      id: doc.id,
    }));
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

export const addChatMessageFirebase = async (userId: string, message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> => {
  try {
    const docRef = await addDoc(collection(db, `chatHistory_${userId}`), {
      ...message,
      createdAt: Timestamp.now(),
    });
    return {
      ...message,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error adding chat message:', error);
    throw new Error('Failed to save message');
  }
};

export const clearChatHistoryFirebase = async (userId: string): Promise<void> => {
  try {
    const q = query(collection(db, `chatHistory_${userId}`));
    const snapshot = await getDocs(q);
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
    }
  } catch (error) {
    console.error('Error clearing chat:', error);
    throw new Error('Failed to clear chat');
  }
};
