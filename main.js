document.getElementById('download-button').addEventListener('click', async () => {
    const youtubeUrlInput = document.getElementById('youtube-url');
    const statusMessageDiv = document.getElementById('status-message');
    const youtubeUrl = youtubeUrlInput.value.trim();

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

    statusMessageDiv.textContent = 'Fetching video information...';
    statusMessageDiv.style.color = 'orange';

    let videoTitle = 'converted_audio';

    try {
        try {
            const oembedUrl = 'https://www.youtube.com/oembed?url=' + encodeURIComponent(youtubeUrl) + '&format=json';
            const oembedResponse = await fetch(oembedUrl);
            if (oembedResponse.ok) {
                const oembedData = await oembedResponse.json();
                videoTitle = oembedData.title.replace(/[^\w\s-]/gi, '').trim();
            }
        } catch (e) {
            console.warn('Could not fetch video title:', e);
        }

        statusMessageDiv.textContent = 'Converting: "' + videoTitle + '"... Please wait.';

        const instances = [
            'https://api.cobalt.tools/api/json',
            'https://cobalt.meowing.de/api/json',
            'https://cobalt-api.kwiateusz.xyz/api/json'
        ];

        let conversionData = null;

        for (const instance of instances) {
            try {
                const response = await fetch(instance, {
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

                if (response.ok) {
                    conversionData = await response.json();
                    break;
                }
            } catch (err) {
                console.error('Instance ' + instance + ' failed:', err);
            }
        }

        if (conversionData && (conversionData.status === 'stream' || conversionData.status === 'redirect')) {
            statusMessageDiv.textContent = 'Conversion successful! Starting download...';
            statusMessageDiv.style.color = 'green';

            const a = document.createElement('a');
            a.href = conversionData.url;
            a.download = videoTitle + '.mp3';
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            throw new Error('All conversion services are busy. Please try again later.');
        }

    } catch (error) {
        console.error('Error:', error);
        statusMessageDiv.textContent = 'Error: ' + error.message;
        statusMessageDiv.style.color = 'red';
    }
});
