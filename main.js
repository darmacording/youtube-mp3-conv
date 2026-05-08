document.getElementById('download-button').addEventListener('click', async () => {
    const youtubeUrlInput = document.getElementById('youtube-url');
    const statusMessageDiv = document.getElementById('status-message');
    const youtubeUrl = youtubeUrlInput.value.trim();

    // Basic URL validation
    if (!youtubeUrl) {
        statusMessageDiv.textContent = 'Please enter a YouTube URL.';
        statusMessageDiv.style.color = 'red';
        return;
    }

    if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
        statusMessageDiv.textContent = 'Please enter a valid YouTube URL.';
        statusMessageDiv.style.color = 'red';
        return;
    }

    statusMessageDiv.textContent = 'Processing... This may take a moment depending on the video length.';
    statusMessageDiv.style.color = 'orange';

    try {
        // Using Cobalt API for conversion
        const response = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                url: youtubeUrl,
                isAudioOnly: true,
                audioFormat: 'mp3',
                vQuality: '720'
            })
        });

        const data = await response.json();

        if (data.status === 'stream' || data.status === 'redirect') {
            statusMessageDiv.textContent = 'Conversion successful! Starting download...';
            statusMessageDiv.style.color = 'green';

            // Trigger download
            const downloadUrl = data.url;
            const a = document.createElement('a');
            a.href = downloadUrl;
            
            // Note: browser might rename based on headers, but we can try to hint it.
            // Cobalt usually provides a good filename in the URL or headers.
            a.target = '_blank'; 
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else if (data.status === 'picker') {
            statusMessageDiv.textContent = 'Found multiple formats. Please use a direct video link for better results.';
            statusMessageDiv.style.color = 'orange';
        } else {
            throw new Error(data.text || 'Conversion failed. Please try again.');
        }

    } catch (error) {
        console.error('Error:', error);
        statusMessageDiv.textContent = 'Error: ' + error.message + '. The conversion service might be busy. Please try again later.';
        statusMessageDiv.style.color = 'red';
    }
});
