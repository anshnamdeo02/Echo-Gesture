// References to HTML elements
const convertedText = document.getElementById('converted_text');
const startButton = document.getElementById('click_to_record');
const submitButton = document.getElementById('submit_text');
const videoContainer = document.getElementById('video_container');
let recognition;

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
} else {
    console.log("Speech recognition not supported in this browser.");
}

// Toggle Recording State
let isRecording = false;

function toggleRecording() {
    isRecording = !isRecording;
    const button = document.getElementById("click_to_record");
    if (isRecording) {
        button.classList.add("recording");
        recognition.start();
    } else {
        button.classList.remove("recording");
        recognition.stop();
    }
}

// Capture Speech Results
recognition.onresult = (event) => {
    let transcript = event.results[event.results.length - 1][0].transcript.trim();
    // Remove special characters from transcript
    transcript = transcript.replace(/[^a-zA-Z\s]/g, '');
    convertedText.value += transcript + ' '; // Add cleaned text to text box
};

recognition.onend = () => {
    startButton.textContent = 'Start Recording';
};

recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
};

// Available Videos
const availableVideos = [
    "Again.mp4", "All.mp4", "After.mp4", "Against.mp4", "Age.mp4", "Alone.mp4",
    "Also.mp4", "And.mp4", "Ask.mp4", "At.mp4", "Beautiful.mp4", "Before.mp4",
    "Best.mp4", "Better.mp4", "Busy.mp4", "But.mp4", "Bye.mp4", "Can.mp4", 
    "Cannot.mp4", "Change.mp4", "College.mp4", "Come.mp4", "Computer.mp4", 
    "Day.mp4", "Distance.mp4", "Do Not.mp4", "Do.mp4", "Does Not.mp4",
    "Eat.mp4", "Engineer.mp4", "Flight.mp4", "Finish.mp4", "From.mp4"
];

// Get video path for a given word
function getVideoPath(word) {
    const matchingVideo = availableVideos.find(video => 
        video.toLowerCase() === `${word.toLowerCase()}.mp4`
    );
    return matchingVideo ? `assets/${matchingVideo}` : null;
}

// Play videos in sequence
function playVideosInSequence(videoPaths) {
    let index = 0;

    function playNextVideo() {
        if (index < videoPaths.length) {
            videoContainer.innerHTML = ''; // Clear previous content
            const videoElement = document.createElement("video");
            videoElement.src = videoPaths[index];
            videoElement.controls = true;
            videoElement.style.height = "220px";
            videoContainer.appendChild(videoElement);

            videoElement.addEventListener('ended', () => {
                index++;
                playNextVideo();
            });

            videoElement.play().catch(err => {
                console.error("Playback error:", err);
            });
        }
    }

    playNextVideo();
}

// Process Text with Fallback
async function processTextWithFallback(inputText) {
    let generatedText = inputText;

    try {
        // Example API request (Replace URL and payload with actual API details)
        const response = await fetch('https://api.example.com/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: inputText })
        });

        if (response.ok) {
            const data = await response.json();
            generatedText = data.generatedText || inputText;
        } else {
            console.warn("API request failed, falling back to local processing.");
        }
    } catch (error) {
        console.error("API Error:", error);
        console.warn("Falling back to local processing.");
    }

    // Clean and process the text
    generatedText = generatedText.replace(/[^a-zA-Z\s]/g, '');
    convertedText.value = generatedText;

    // Generate video paths and play videos
    const words = generatedText.split(/\s+/);
    const videoPaths = words.map(getVideoPath).filter(path => path);
    if (videoPaths.length) {
        playVideosInSequence(videoPaths);
    } else {
        alert("No matching videos found for the input text.");
    }
}

// Submit Button Logic
submitButton.addEventListener('click', () => {
    const inputText = convertedText.value.trim();
    if (!inputText) {
        alert("No text provided!");
        return;
    }

    // Process the text with API fallback
    processTextWithFallback(inputText);
});

// Reset Text on Start Button Click
startButton.addEventListener('click', () => {
    convertedText.value = '';
});
