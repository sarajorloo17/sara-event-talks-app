from flask import Flask, render_template, jsonify, request
import requests
import xml.etree.ElementTree as ET

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

def fetch_release_notes():
    headers = {"User-Agent": "Mozilla/5.0"}
    resp = requests.get(FEED_URL, headers=headers)
    if resp.status_code != 200:
        return []
    try:
        root = ET.fromstring(resp.content)
    except ET.ParseError:
        return []
    ns = {'atom': 'http://www.w3.org/2005/Atom'}
    items = []
    for entry in root.findall('atom:entry', ns):
        title = entry.find('atom:title', ns).text if entry.find('atom:title', ns) is not None else ''
        link_elem = entry.find('atom:link', ns)
        link = link_elem.attrib.get('href', '') if link_elem is not None else ''
        pubDate = entry.find('atom:updated', ns).text if entry.find('atom:updated', ns) is not None else ''
        content = entry.find('atom:content', ns).text if entry.find('atom:content', ns) is not None else ''
        items.append({
            'title': title,
            'link': link,
            'pubDate': pubDate,
            'description': content
        })
    return items


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/notes')
def api_notes():
    notes = fetch_release_notes()
    return jsonify(notes)

if __name__ == '__main__':
    app.run(debug=True)
