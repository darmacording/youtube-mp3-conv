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

    // Informing about backend requirement and browser download prompt
    statusMessageDiv.textContent = 'Processing... (Note: Actual conversion requires a backend service. The browser will prompt you to save the file.)';
    statusMessageDiv.style.color = 'orange';

    // In a real application, you would send the youtubeUrl to a backend API here.
    // For this prototype, we'll simulate the process and provide a static message.
    // Example of what a backend call might look like (commented out):
    /*
    fetch('/api/convert-to-mp3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: youtubeUrl })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            statusMessageDiv.textContent = 'Conversion successful! Your file is ready for download.';
            statusMessageDiv.style.color = 'green';
            // Trigger download or provide a link
            // window.location.href = data.downloadUrl; 
        } else {
            statusMessageDiv.textContent = 'Error during conversion: ' + data.message;
            statusMessageDiv.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        statusMessageDiv.textContent = 'An error occurred. Please try again later.';
        statusMessageDiv.style.color = 'red';
    });
    */

    // For the prototype, we'll just display a success message after a short delay
    // to simulate processing.
    setTimeout(() => {
        statusMessageDiv.textContent = 'Processing complete. The browser will now prompt you to save the MP3 file. (This is a simulated download)';
        statusMessageDiv.style.color = 'green';
        
        // To simulate a download, you could create a Blob and a download link.
        // However, since we don't have an actual MP3, this part is conceptual.
        // Example:
        // const dummyMp3Blob = new Blob([''], { type: 'audio/mpeg' }); // Placeholder
        // const downloadUrl = URL.createObjectURL(dummyMp3Blob);
        // const a = document.createElement('a');
        // a.href = downloadUrl;
        // a.download = 'download.mp3'; // Default filename
        // document.body.appendChild(a);
        // a.click();
        // URL.revokeObjectURL(downloadUrl);
        // document.body.removeChild(a);
        
    }, 2000); // Simulate a 2-second processing time
});
