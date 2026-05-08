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
    const proxy = 'https://api.allorigins.win/raw?url=';

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

    statusMessageDiv.textContent = 'Initializing conversion: "' + videoTitle + '"...';

    const triggerDownload = (url, filename) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename + '.mp3';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const tryFallback = () => {
        try {
            statusMessageDiv.textContent = 'Trying alternative server... (Check pop-ups)';
            const veviozUrl = 'https://api.vevioz.com/api/single/mp3?url=' + encodeURIComponent(youtubeUrl);
            window.open(veviozUrl, '_blank');
            statusMessageDiv.textContent = 'Redirected to download server. Please check your browser\'s download folder.';
            statusMessageDiv.style.color = 'green';
        } catch (err) {
            statusMessageDiv.textContent = 'All services are currently busy. Please try again later.';
            statusMessageDiv.style.color = 'red';
        }
    };

    try {
        const initUrl = 'https://loader.to/ajax/download.php?url=' + encodeURIComponent(youtubeUrl) + '&format=mp3';
        const initRes = await fetch(proxy + encodeURIComponent(initUrl));
        const initData = await initRes.json();

        if (initData.success && initData.id) {
            const jobId = initData.id;
            
            const pollInterval = setInterval(async () => {
                try {
                    const progressUrl = 'https://loader.to/ajax/progress.php?id=' + jobId;
                    const progressRes = await fetch(proxy + encodeURIComponent(progressUrl));
                    const progressData = await progressRes.json();

                    if (progressData.success === 1 || progressData.success === true) {
                        if (progressData.download_url) {
                            clearInterval(pollInterval);
                            statusMessageDiv.textContent = 'Success! Starting download...';
                            statusMessageDiv.style.color = 'green';
                            triggerDownload(progressData.download_url, videoTitle);
                        }
                    } else if (progressData.text === 'Error' || progressData.error) {
                        clearInterval(pollInterval);
                        tryFallback();
                    } else {
                        const progress = progressData.progress || 0;
                        statusMessageDiv.textContent = 'Converting... ' + (progress / 10).toFixed(1) + '%';
                    }
                } catch (e) {
                    clearInterval(pollInterval);
                    tryFallback();
                }
            }, 3000);
        } else {
            throw new Error('Init failed');
        }
    } catch (err) {
        console.warn('Loader.to failed, trying fallback...', err);
        tryFallback();
    }
});
