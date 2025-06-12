const apiKey = 'AIzaSyANE4GsiQgv1WaWkjBgCOd4Ft4uLCi_qQc'; // Replace with your actual API key

async function searchMusic() {
  const query = document.getElementById('search').value;
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${apiKey}`);
  const data = await response.json();

  const results = document.getElementById('results');
  results.innerHTML = '';

  data.items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.snippet.title;
    li.onclick = () => playVideo(item.id.videoId);
    results.appendChild(li);
  });
}

function playVideo(videoId) {
  const player = document.getElementById('player');
  player.innerHTML = `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
}
