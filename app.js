document.addEventListener('DOMContentLoaded', function () {
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const addNoteButton = document.getElementById('addNote');
    const notesContainer = document.getElementById('notesContainer');
    const themeToggleButton = document.getElementById('themeToggle');
    const searchInput = document.getElementById('search');
    const quoteElement = document.getElementById('quote');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let darkMode = localStorage.getItem('darkMode') === 'true';

    async function fetchQuote() {
        try {
            const response = await fetch('https://api.quotable.io/random');
            if (!response.ok) {
                throw new Error('Failed to fetch quote');
            }
            const data = await response.json();
            quoteElement.textContent = data.content;
        } catch (error) {
            console.error(error);
            quoteElement.textContent = '"The best way to predict the future is to invent it." - Alan Kay';
        }
    }

    function displayNotes(filteredNotes = notes) {
        notesContainer.innerHTML = '';
        filteredNotes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';

            const noteTitleElement = document.createElement('h3');
            noteTitleElement.textContent = escapeHTML(note.title);
            noteElement.appendChild(noteTitleElement);

            const noteContentElement = document.createElement('p');
            noteContentElement.textContent = escapeHTML(note.content);
            noteElement.appendChild(noteContentElement);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete';
            deleteButton.textContent = 'Delete';
            deleteButton.style.backgroundColor = 'red';
            deleteButton.style.color = 'white';
            deleteButton.style.padding = '10px';
            deleteButton.style.borderRadius = '5px';
            deleteButton.style.border = 'none';
            deleteButton.style.cursor = 'pointer';
            deleteButton.addEventListener('click', function () {
                deleteNote(note.id);
            });
            deleteButton.addEventListener('mouseover', function () {
                deleteButton.style.backgroundColor = 'darkred';
            });
            deleteButton.addEventListener('mouseout', function () {
                deleteButton.style.backgroundColor = 'red';
            });
            noteElement.appendChild(deleteButton);

            notesContainer.appendChild(noteElement);
        });
    }

    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
    }

    addNoteButton.addEventListener('click', function () {
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();

        if (!title || !content) {
            alert('Please provide both a title and content for your note.');
            return;
        }

        notes.push({
            id: Date.now(),
            title: title,
            content: content
        });

        noteTitle.value = '';
        noteContent.value = '';
        saveNotes();
    });

    function deleteNote(id) {
        notes = notes.filter(note => note.id !== id);
        saveNotes();
    }

    themeToggleButton.addEventListener('click', function () {
        darkMode = !darkMode;
        if (darkMode) {
            document.body.setAttribute('dark-mode', '');
        } else {
            document.body.removeAttribute('dark-mode');
        }
        localStorage.setItem('darkMode', darkMode);
        themeToggleButton.textContent = darkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    });

    function escapeHTML(string) {
        const div = document.createElement('div');
        div.textContent = string;
        return div.innerHTML;
    }

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(searchTerm) || note.content.toLowerCase().includes(searchTerm)
        );
        displayNotes(filteredNotes);
    });

    if (darkMode) {
        document.body.setAttribute('dark-mode', '');
        themeToggleButton.textContent = '☀️ Light Mode';
    }

    fetchQuote();
    displayNotes();
});
