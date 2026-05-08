document.getElementById('download-button').addEventListener('click', () => {
    const youtubeUrlInput = document.getElementById('youtube-url');
    const statusMessageDiv = document.getElementById('status-message');
    const youtubeUrl = youtubeUrlInput.value;

    // Basic URL validation
    if (!youtubeUrl) {
        statusMessageDiv.textContent = 'Please enter a YouTube URL.';
        statusMessageDiv.style.color = 'red';
        return;
    }

    // Simple check for YouTube domain (this is not exhaustive)
    if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
        statusMessageDiv.textContent = 'Please enter a valid YouTube URL.';
        statusMessageDiv.style.color = 'red';
        return;
    }

    // Informing about processing
    statusMessageDiv.textContent = 'Processing... Your download will start shortly.';
    statusMessageDiv.style.color = 'orange';

    // For the prototype, we'll just display a success message after a short delay
    // to simulate processing.
    setTimeout(() => {
        statusMessageDiv.textContent = 'Processing complete. Your download should start automatically.';
        statusMessageDiv.style.color = 'green';
        
        // Trigger a dummy download
        const dummyMp3Blob = new Blob(['ID3\u0003\u0000\u0000\u0000\u0000\u0000\u0000'], { type: 'audio/mpeg' }); 
        const downloadUrl = URL.createObjectURL(dummyMp3Blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'converted_audio.mp3'; 
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        }, 100);
        
    }, 1500); // Simulate processing time
});
