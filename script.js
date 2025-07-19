function getFormattedTimestamp() {
  return new Date().toISOString(); // Use consistent ISO format
}

function suggestTag(noteText) {
  const text = noteText.toLowerCase();
  if (text.includes('again') || text.includes('loop')) return 'Spiral';
  if (text.includes('peace') || text.includes('quiet') || text.includes('nature')) return 'Stillness';
  if (text.includes('fear') || text.includes('panic') || text.includes('overthinking')) return 'Fear';
  if (text.includes('clarity') || text.includes('truth')) return 'Clarity';
  if (text.includes('nudge') || text.includes('aligned')) return 'Alignment';
  return null;
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

  const grouped = {};
  notes.forEach(note => {
    const date = new Date(note.timestamp).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(note);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  sortedDates.forEach(date => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'note-group';

    const dateHeader = document.createElement('h3');
    dateHeader.className = 'date-header';
    dateHeader.textContent = `📅 ${date}`;
    groupDiv.appendChild(dateHeader);

    grouped[date].forEach(note => {
      const tag = suggestTag(note.text);
      const time = new Date(note.timestamp).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const noteDiv = document.createElement('div');
      noteDiv.className = 'note';
      noteDiv.innerHTML = `
        <div class="timestamp">🕓 ${time}</div>
        <div>${note.text}</div>
        ${tag ? `<div class="tag-suggestion">🧠 Suggested tag: <strong>${tag}</strong></div>` : ''}
      `;
      groupDiv.appendChild(noteDiv);
    });

    container.appendChild(groupDiv);
  });
}

renderNotes();
