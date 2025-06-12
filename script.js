const apiKey = 'AIzaSyANE4GsiQgv1WaWkjBgCOd4Ft4uLCi_qQc'; // Your YouTube Data API key

async function searchMusic() {
  const query = document.getElementById('search').value;
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${apiKey}`);
  const data = await response.json();

  const results = document.getElementById('results');
  results.innerHTML = '';

  data.items.forEach(item => {
    const videoId = item.id.videoId;
    const title = item.snippet.title;

    // Create a container for each result
    const container = document.createElement('div');
    container.className = 'song';

    // Create a title span
    const titleSpan = document.createElement('span');
    titleSpan.textContent = title;

    // Create a play button
    const button = document.createElement('button');
    button.textContent = 'Play';
    button.onclick = () => playVideo(videoId);

    // Append elements
    container.appendChild(titleSpan);
    container.appendChild(button);
    results.appendChild(container);
  });
}

function playVideo(videoId) {
  const player = document.getElementById('player');
  player.innerHTML = `
    <iframe width="560" height="315"
      src="https://www.youtube.com/embed/${videoId}?autoplay=1"
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen></iframe>
  `;
}
