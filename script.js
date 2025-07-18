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

// 👇 this is the key change — renderNotes is now async
async function renderNotes() {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  const container = document.getElementById('notesContainer');
  container.innerHTML = '';

  const grouped = {};

  notes.forEach(note => {
    const date = note.timestamp.substring(0, 11).trim();
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(note);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  for (const date of sortedDates) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'note-group';

    const dateHeader = document.createElement('h3');
    dateHeader.className = 'date-header';
    dateHeader.textContent = `📅 ${date}`;
    groupDiv.appendChild(dateHeader);

    for (const note of grouped[date]) {
      let tag = null;

      // 🔁 Call GPT API for tag
      try {
        const res = await fetch('/api/tag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note: note.text })
        });

        const data = await res.json();
        tag = data.tag;
      } catch (err) {
        console.error('Tagging failed:', err);
      }

      const noteDiv = document.createElement('div');
      noteDiv.className = 'note';
      noteDiv.innerHTML = `
        <div class="timestamp">🕓 ${note.timestamp}</div>
        <div>${note.text}</div>
        ${tag ? `<div class="tag-suggestion">🧠 Suggested tag: <strong>${tag}</strong></div>` : ''}
      `;
      groupDiv.appendChild(noteDiv);
    }

    container.appendChild(groupDiv);
  }
}

renderNotes(); // Initial call
