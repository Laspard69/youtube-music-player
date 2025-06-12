<script>
  const apiKey = 'AIzaSyANE4GsiQgv1WaWkjBgCOd4Ft4uLCi_qQc';
  let currentVideoId = '';
  let repeatEnabled = false;
  let lyricTimer = null;

  async function searchMusic() {
    const query = document.getElementById('search').value;
    if (!query.trim()) return;

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${apiKey}`);
    const data = await response.json();

    const results = document.getElementById('results');
    results.innerHTML = '';

    data.items.forEach(item => {
      const videoId = item.id.videoId;
      const title = item.snippet.title;

      const container = document.createElement('div');
      container.className = 'song';

      const titleSpan = document.createElement('span');
      titleSpan.textContent = title;

      const button = document.createElement('button');
      button.textContent = 'Play';
      button.onclick = () => playVideo(videoId, title);

      container.appendChild(titleSpan);
      container.appendChild(button);
      results.appendChild(container);
    });
  }

  function toggleRepeat() {
    repeatEnabled = !repeatEnabled;
    document.getElementById('repeat-btn').textContent = `Repeat: ${repeatEnabled ? 'ON' : 'OFF'}`;
    if (currentVideoId) playVideo(currentVideoId);
  }

  async function playVideo(videoId, title = '') {
    clearInterval(lyricTimer);
    currentVideoId = videoId;

    const loopParam = repeatEnabled ? `&loop=1&playlist=${videoId}` : '';
    document.getElementById('player').innerHTML = `
      <iframe width="100%" height="400"
        src="https://www.youtube.com/embed/${videoId}?autoplay=1${loopParam}"
        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    `;

    // Try to guess artist & song from title
    let [song, artist] = title.split(' - ');
    if (!artist) artist = song = title;

    song = song.replace(/ *\([^)]*\) */g, '').trim();
    artist = artist.replace(/ *\([^)]*\) */g, '').trim();

    try {
      const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`);
      const data = await res.json();

      if (!data.lyrics) throw new Error('No lyrics');

      const lines = data.lyrics.split('\n').filter(line => line.trim() !== '');
      const lyricsEl = document.getElementById('lyrics');
      let index = 0;
      lyricsEl.innerHTML = '';

      lyricTimer = setInterval(() => {
        if (index < lines.length) {
          const p = document.createElement('p');
          p.textContent = lines[index];
          p.className = 'highlight';
          lyricsEl.appendChild(p);
          lyricsEl.scrollTop = lyricsEl.scrollHeight;
          index++;
        } else {
          clearInterval(lyricTimer);
        }
      }, 2500); // change speed here (2500ms = 2.5s)
    } catch (e) {
      document.getElementById('lyrics').innerHTML = `<p>⚠️ Lyrics not found for <b>${artist} - ${song}</b>.</p>`;
    }
  }
</script>
