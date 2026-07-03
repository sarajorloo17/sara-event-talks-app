function createTweetUrl(note) {
    const text = encodeURIComponent(note.title + '\n' + note.link);
    return `https://twitter.com/intent/tweet?text=${text}`;
}

let lastNotes = [];

function renderNotes(notes) {
    lastNotes = notes;
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
            <button class="copy-btn">Copy</button>
        `;
        li.querySelector('.tweet-btn').onclick = () => {
            window.open(createTweetUrl(note), '_blank');
        };
        li.querySelector('.copy-btn').onclick = () => {
            const text = `${note.title}\n${note.pubDate}\n${note.description}\n${note.link}`;
            navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!'));
        };
        list.appendChild(li);
    });
}

function exportToCSV() {
    if (!lastNotes.length) return;
    const header = ['Title', 'Date', 'Description', 'Link'];
    const rows = lastNotes.map(n => [
        '"' + n.title.replace(/"/g, '""') + '"',
        '"' + n.pubDate.replace(/"/g, '""') + '"',
        '"' + n.description.replace(/"/g, '""') + '"',
        '"' + n.link.replace(/"/g, '""') + '"'
    ]);
    let csv = header.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bigquery-release-notes.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported to CSV!');
}

document.getElementById('export-csv-btn').onclick = exportToCSV;

document.getElementById('refresh-btn').onclick = fetchNotes;
window.onload = fetchNotes;

// Theme toggle with persistence
const themeToggle = document.getElementById('theme-toggle');
const theme = localStorage.getItem('theme');
if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.checked = true;
}
themeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

// Toast message
function showToast(msg, error) {
    let toast = document.getElementById('toast-msg');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-msg';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = error ? 'toast error' : 'toast';
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2000);
}

function fetchNotes() {
    document.getElementById('spinner').style.display = 'inline-block';
    document.getElementById('notes-list').innerHTML = '<li class="loading-msg">Loading release notes...</li>';
    fetch('/api/notes').then(r => r.json()).then(notes => {
        renderNotes(notes);
        document.getElementById('spinner').style.display = 'none';
    }).catch(() => {
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('notes-list').innerHTML = '<li>Error loading notes. <button onclick="fetchNotes()">Retry</button></li>';
        showToast('Failed to load notes', true);
    });
}

document.getElementById('refresh-btn').onclick = fetchNotes;
window.onload = fetchNotes;
