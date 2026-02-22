import React, { useEffect, useState } from 'react';
import { Note, User } from '../types';
import { addNote, deleteNote, getNotes } from '../services/localStorageService';
import { addNoteFirebase, deleteNoteFirebase, getNotesFirebase } from '../services/firebaseService';

interface Props {
  user: User;
}

const NotesPage: React.FC<Props> = ({ user }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');

  useEffect(() => {
    const loadNotes = async () => {
      const firebaseNotes = await getNotesFirebase();
      setNotes(firebaseNotes);
    };
    loadNotes();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      const created = await addNoteFirebase({
        title: title.trim(),
        content: content.trim(),
        authorId: user.id,
        authorName: user.name,
        fileUrl: filePreview,
        fileName: file?.name,
        fileType: file?.type,
      });
      setNotes(prev => [created, ...prev]);
      setTitle('');
      setContent('');
      setFile(null);
      setFilePreview('');
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNoteFirebase(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Notes Library</h2>
        <p className="text-slate-500">Admins can publish study notes with PDFs. Students can view and download them anytime.</p>
        {user.role === 'student' && (
          <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-700">✓ All notes published by admins are visible here.</p>
          </div>
        )}
      </div>

      {user.role === 'admin' && (
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-lg space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Add New Note</h3>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="w-full px-4 py-3 rounded-xl border border-white/60 bg-white/80 focus:ring-2 focus:ring-teal-400 outline-none"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the note content..."
            className="w-full h-32 px-4 py-3 rounded-xl border border-white/60 bg-white/80 focus:ring-2 focus:ring-teal-400 outline-none resize-none"
          />
          
          <div className="border-2 border-dashed border-teal-300 bg-teal-50/50 rounded-xl p-6 text-center hover:bg-teal-50 transition-colors">
            <label className="cursor-pointer block">
              <svg className="w-10 h-10 mx-auto text-teal-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <span className="block text-slate-600 mb-2 font-medium">Click to upload PDF or file</span>
              <input type="file" accept=".pdf,.doc,.docx,.txt,.xls,.xlsx" onChange={handleFileSelect} className="hidden" />
              <span className="inline-block px-4 py-2 bg-white text-teal-600 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">Choose File</span>
            </label>
          </div>

          {file && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-green-800">✓ File selected</div>
                  <div className="text-xs text-green-600">{file.name}</div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setFilePreview('');
                  }}
                  className="text-xs font-semibold text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAdd}
            className="w-full px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
          >
            Publish Note {file && '+ File'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.length === 0 && (
          <div className="col-span-full text-center text-slate-400">No notes published yet.</div>
        )}
        {notes.map(note => (
          <div key={note.id} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-lg">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">{note.title}</h4>
                <p className="text-xs text-slate-400">By {note.authorName} • {new Date(note.createdAt).toLocaleString()}</p>
              </div>
              {user.role === 'admin' && (
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-xs font-semibold text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="mt-4 text-slate-600 whitespace-pre-wrap text-sm">{note.content}</p>
            
            {note.fileUrl && (
              <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200">
                <a
                  href={note.fileUrl}
                  download={note.fileName}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  Download {note.fileName}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPage;
