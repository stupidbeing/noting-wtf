function getFormattedTimestamp() {
  const now = new Date();
  return now.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function saveNote() {
  const input = document.getElementById('noteInput');
  const note = input.value.trim();
  if (!note) return;

  const timestamp = getFormattedTimestamp();
  const newNote = { text: note, timestamp };
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes.unshift(newNote);
  localStorage.setItem('notes', JSON.stringify(notes));

  input.value = '';
  renderNotes();
}

function renderNotes() {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  const container = document.getElementById('notesContainer');
  container.innerHTML = '';

  notes.forEach(note => {
    const div = document.createElement('div');
    div.className = 'note';
    div.innerHTML = `<div class="timestamp">🕓 ${note.timestamp}</div><div>${note.text}</div>`;
    container.appendChild(div);
  });
}

renderNotes(); // Load notes on page load
