import { useState, useEffect } from 'react';
import { DocumentTextIcon, PencilSquareIcon, MagnifyingGlassIcon, CalendarDaysIcon, TrashIcon } from '@heroicons/react/24/outline';
import NoteForm from '../components/NoteForm';
import { useAuth } from '../hooks/useAuth.js';
import { getNotes, createNote, updateNote, deleteNote } from '../services/noteService';

const NotesPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, id: null });

  // Fetch notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      if (user?.id) {
        try {
          const notesData = await getNotes(user.id);
          setNotes(notesData);
        } catch (error) {
          console.error('Failed to fetch notes:', error);
        }
      }
    };
    fetchNotes();
  }, [user?.id]);

  // Filter and sort notes based on search term
  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Compare creation dates lexicographically (ISO format is sortable)
      if (a.created_at !== b.created_at) {
        return b.created_at.localeCompare(a.created_at);
      }
      return b.id - a.id; // Higher IDs first when dates are equal
    });

  const handleAddNote = async (noteData) => {
    try {
      const notePayload = {
        user_id: user.id,
        title: noteData.title,
        content: noteData.content
      };
      const newNote = await createNote(notePayload);
      setNotes([...notes, newNote]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create note:', error);
      // TODO: Add error handling UI
    }
  };

  const handleEditNote = async (noteData) => {
    try {
      const updatedNote = await updateNote(selectedNote.id, {
        title: noteData.title,
        content: noteData.content
      });
      setNotes(notes.map(note =>
        note.id === selectedNote.id ? updatedNote : note
      ));
      setShowForm(false);
      setSelectedNote(null);
    } catch (error) {
      console.error('Failed to update note:', error);
      // TODO: Add error handling UI
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmation({ show: true, id });
  };

  const confirmDelete = async () => {
    const id = deleteConfirmation.id;
    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    } finally {
      setDeleteConfirmation({ show: false, id: null });
    }
  };

  const handleEditClick = (note) => {
    setSelectedNote(note);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mb-16">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-3 tracking-tight">Notes</h1>
            <p className="text-gray-600 text-lg leading-relaxed">Capture and organize your thoughts.</p>
          </div>
          <button
            onClick={() => {
              setSelectedNote(null);
              setShowForm(true);
            }}
            className="bg-purple-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Note
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-200 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Total Notes</h2>
          <div className="space-y-2 min-h-[120px] flex flex-col justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-900">{notes.length}</span>
              <p className="text-gray-600 text-sm mt-1">All Notes</p>
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-200 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-purple-800 mb-6">Recently Created</h2>
          <div className="space-y-2 min-h-[120px] flex flex-col justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-900">
                {notes.length > 0 ?
                  new Date(notes[notes.length - 1].created_at).toLocaleDateString() :
                  'N/A'
                }
              </span>
              <p className="text-gray-600 text-sm mt-1">Latest Note</p>
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-100 hover:border-orange-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-orange-800 mb-6">Created Today</h2>
          <div className="space-y-2 min-h-[120px] flex flex-col justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-900">
                {notes.filter(note =>
                  new Date(note.created_at).toDateString() === new Date().toDateString()
                ).length}
              </span>
              <p className="text-gray-600 text-sm mt-1">Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mb-16">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-11"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-3" />
        </div>
      </div>

      {/* Notes List */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">My Notes</h2>
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-400" />
            <h3 className="mt-4 text-2xl font-bold text-gray-900 animate-fade-in-up">No notes yet</h3>
            <p className="mb-8 mt-2 text-gray-600 text-lg leading-relaxed max-w-md mx-auto animate-fade-in-up">Start capturing and organizing your thoughts by creating your first note</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center animate-fade-in-up"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Note
            </button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="h-16 w-16 mx-auto text-gray-400 animate-fade-in-up" />
            <h3 className="mt-4 text-2xl font-bold text-gray-900 animate-fade-in-up">No notes match your search</h3>
            <p className="mb-8 mt-2 text-gray-600 text-lg leading-relaxed max-w-md mx-auto animate-fade-in-up">Try adjusting your search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className="border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer hover:border-gray-300"
                onClick={() => setSelectedNote(note)}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(note);
                        }}
                        className="text-amber-600 hover:text-amber-800 transition-colors"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note.id);
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {note.content.length > 20 ? `${note.content.substring(0, 20)}...` : note.content}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarDaysIcon className="h-4 w-4 mr-1" />
                    <span>{new Date(note.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedNote ? 'Edit Note' : 'Create New Note'}
                </h3>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <NoteForm 
                onSubmit={selectedNote ? handleEditNote : handleAddNote} 
                initialData={selectedNote}
              />
            </div>
          </div>
        </div>
      )}

      {/* Note Details Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            {/* Card Header */}
            <div className="bg-amber-600 rounded-t-2xl p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Note Details</h3>
                <button onClick={() => setSelectedNote(null)} className="text-white hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Title</p>
                  <p className="font-medium text-lg break-words">{selectedNote.title}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Content</p>
                  <p className="font-medium break-words whitespace-pre-wrap">{selectedNote.content}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Created</p>
                  <p className="font-medium">{new Date(selectedNote.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex space-x-4">
                <button
                  onClick={() => {
                    setSelectedNote(null);
                    setShowForm(true);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedNote.id);
                    setSelectedNote(null);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">Delete Note</h3>
              <p className="text-gray-600 mt-2">Are you sure you want to delete this note? This action cannot be undone.</p>

              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => setDeleteConfirmation({ show: false, id: null })}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
