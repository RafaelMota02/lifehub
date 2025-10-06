import { useState, useEffect } from 'react';
import { DocumentTextIcon, PencilSquareIcon, MagnifyingGlassIcon, CalendarDaysIcon, TrashIcon } from '@heroicons/react/24/outline';
import NoteForm from '../components/NoteForm';
import { useAuth } from '../context/AuthContext.jsx';
import { getNotes, createNote, updateNote, deleteNote } from '../services/noteService';

const NotesPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);

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

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Failed to delete note:', error);
      // TODO: Add error handling UI
    }
  };

  const handleEditClick = (note) => {
    setSelectedNote(note);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Notes</h1>
        <button 
          onClick={() => {
            setSelectedNote(null);
            setShowForm(true);
          }}
          className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg flex items-center transition-colors"
        >
          <PencilSquareIcon className="h-5 w-5 mr-2" />
          Create Note
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow p-6 border border-amber-200">
          <div className="flex items-center">
            <div className="bg-amber-100 p-3 rounded-lg mr-4">
              <DocumentTextIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-700">Total Notes</h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">{notes.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow p-6 border border-purple-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-700">Recently Edited</h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {notes.length > 0 ? 
                  new Date(notes[notes.length - 1].created_at).toLocaleDateString() : 
                  'N/A'
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow p-6 border border-blue-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-700">Created Today</h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {notes.filter(note => 
                  new Date(note.created_at).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Notes List */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No notes yet</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first note</p>
            <button 
              onClick={() => setShowForm(true)}
              className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Create Note
            </button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="h-16 w-16 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No notes match your search</h3>
            <p className="mt-2 text-gray-500">Try changing your search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
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
                        className="text-amber-600 hover:text-amber-800"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="text-red-600 hover:text-red-800"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
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
                    handleDeleteNote(selectedNote.id);
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
    </div>
  );
};

export default NotesPage;
