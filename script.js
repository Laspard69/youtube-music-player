const apiKey = 'AIzaSyANE4GsiQgv1WaWkjBgCOd4Ft4uLCi_qQc'; // Your YouTube API key

let currentVideoId = '';
let repeatEnabled = false;

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
    button.onclick = () => playVideo(videoId);

    container.appendChild(titleSpan);
    container.appendChild(button);
    results.appendChild(container);
  });
}

function playVideo(videoId) {
  currentVideoId = videoId;
  const loopParam = repeatEnabled ? `&loop=1&playlist=${videoId}` : '';
  const player = document.getElementById('player');
  player.innerHTML = `
    <iframe width="560" height="315"
      src="https://www.youtube.com/embed/${videoId}?autoplay=1${loopParam}"
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen></iframe>
  `;
}

function toggleRepeat() {
  repeatEnabled = !repeatEnabled;
  const btn = document.getElementById('repeat-btn');
  btn.textContent = `Repeat: ${repeatEnabled ? 'ON' : 'OFF'}`;
  if (currentVideoId) playVideo(currentVideoId);
}
