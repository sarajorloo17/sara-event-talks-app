function createTweetUrl(note) {
    const text = encodeURIComponent(note.title + '\n' + note.link);
    return `https://twitter.com/intent/tweet?text=${text}`;
}

function renderNotes(notes) {
    const list = document.getElementById('notes-list');
    list.innerHTML = '';
    if (!notes.length) {
        list.innerHTML = '<li>No release notes found.</li>';
        return;
    }
    notes.forEach(note => {
        const li = document.createElement('li');
        li.className = 'note-item';
        li.innerHTML = `
            <div class="note-title">${note.title}</div>
            <div class="note-date">${note.pubDate}</div>
            <div class="note-desc">${note.description}</div>
            <a href="${note.link}" target="_blank">Read more</a>
            <button class="tweet-btn">Tweet</button>
        `;
        li.querySelector('.tweet-btn').onclick = () => {
            window.open(createTweetUrl(note), '_blank');
        };
        list.appendChild(li);
    });
}

function fetchNotes() {
    document.getElementById('spinner').style.display = 'inline-block';
    fetch('/api/notes').then(r => r.json()).then(notes => {
        renderNotes(notes);
        document.getElementById('spinner').style.display = 'none';
    }).catch(() => {
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('notes-list').innerHTML = '<li>Error loading notes.</li>';
    });
}

document.getElementById('refresh-btn').onclick = fetchNotes;
window.onload = fetchNotes;
