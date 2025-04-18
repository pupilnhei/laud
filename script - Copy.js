// Add loading overlay functions
function showLoadingOverlay(message) {
    // Create a loading overlay if it doesn't exist
    let overlay = document.querySelector('.loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'loading-overlay fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50';
        overlay.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <div class="spinner mb-4"></div>
                <p class="text-lg font-medium">${message}</p>
            </div>
        `;
        
        // Add spinner style if not already in the document
        if (!document.querySelector('#spinner-style')) {
            const style = document.createElement('style');
            style.id = 'spinner-style';
            style.textContent = `
                .spinner {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border-left-color: #506D2F;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(overlay);
    } else {
        // Update message if overlay already exists
        const messageElement = overlay.querySelector('p');
        if (messageElement) {
            messageElement.textContent = message;
        }
        overlay.classList.remove('hidden');
    }
}

function hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        // Optionally remove after animation
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}// Initialize everything when the page loads
window.onload = function() {
    setupCountdown();
    
    // Update names if needed
    if (document.querySelector('#leftName')) {
        document.getElementById('leftName').textContent = "Sanma";
    }
    if (document.querySelector('#rightName')) {
        document.getElementById('rightName').textContent = "Rahul";
    }
};

// Countdown timer to wedding day
function setupCountdown() {
    // Set the wedding date - April 27, 2025
    const weddingDate = new Date("April 27, 2025 10:00:00").getTime();
    
    // Update the countdown every second
    const countdownTimer = setInterval(function() {
        // Get today's date and time
        const now = new Date().getTime();
        
        // Find the distance between now and the wedding date
        const distance = weddingDate - now;
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the countdown if element exists
        const countdownElement = document.getElementById("countdown");
        if (countdownElement) {
            countdownElement.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-number">${days}</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${hours}</span>
                    <span class="countdown-label">Hrs</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${minutes}</span>
                    <span class="countdown-label">Mins</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${seconds}</span>
                    <span class="countdown-label">Secs</span>
                </div>
            `;
        }
        
        // If the countdown is over
        if (distance < 0) {
            clearInterval(countdownTimer);
            if (countdownElement) {
                countdownElement.innerHTML = "<div class='text-xl script-font'>Our Wedding Day Has Arrived!</div>";
            }
        }
    }, 1000);
}

// Photo sharing with Google Drive
function showPhotoOptions() {
    document.getElementById('photoModal').classList.remove('hidden');
    document.getElementById('photoModal').classList.add('flex');
}

function closePhotoModal() {
    document.getElementById('photoModal').classList.add('hidden');
    document.getElementById('photoModal').classList.remove('flex');
    
    // Reset any preview if it exists
    const preview = document.getElementById('preview');
    if (preview) {
        preview.classList.add('hidden');
    }
    
    const previewControls = document.getElementById('previewControls');
    if (previewControls) {
        previewControls.classList.add('hidden');
    }
}

function takePhoto() {
    // For mobile devices, access camera if available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        showLoadingOverlay("Accessing camera...");
        
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                hideLoadingOverlay();
                
                // Create camera view if it doesn't exist
                let cameraView = document.getElementById('cameraView');
                if (!cameraView) {
                    cameraView = document.createElement('div');
                    cameraView.id = 'cameraView';
                    cameraView.className = 'fixed inset-0 bg-black z-50 flex flex-col';
                    cameraView.innerHTML = `
                        <div class="flex justify-end p-4">
                            <button id="closeCameraBtn" class="text-white bg-gray-800 rounded-full p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="flex-1 relative">
                            <video id="video" class="absolute inset-0 w-full h-full object-cover"></video>
                        </div>
                        <div class="p-4 flex justify-center">
                            <button id="captureBtn" class="bg-white rounded-full p-4 shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                    `;
                    document.body.appendChild(cameraView);
                    
                    // Set up close button
                    document.getElementById('closeCameraBtn').addEventListener('click', function() {
                        closeCameraView();
                    });
                    
                    // Set up capture button
                    document.getElementById('captureBtn').addEventListener('click', function() {
                        capturePhoto(stream);
                    });
                } else {
                    cameraView.classList.remove('hidden');
                }
                
                // Hide the photo modal
                closePhotoModal();
                
                // Set up video stream
                const video = document.getElementById('video');
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                hideLoadingOverlay();
                console.error("Error accessing the camera", err);
                showNotification("Could not access your camera. Please check permissions or try uploading instead.", "error");
            });
    } else {
        showNotification("Camera not available on this device. Please use the upload option.", "error");
        // Fall back to file upload
        uploadToGoogleDrive();
    }
}

function capturePhoto(stream) {
    const video = document.getElementById('video');
    
    // Create a canvas to capture the photo
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get the data URL from the canvas
    const photoData = canvas.toDataURL('image/jpeg');
    
    // Close camera view
    closeCameraView();
    
    // Show preview before uploading
    let previewContainer = document.getElementById('previewContainer');
    if (!previewContainer) {
        // Create the preview container
        previewContainer = document.createElement('div');
        previewContainer.id = 'previewContainer';
        previewContainer.className = 'mt-6 text-center';
        previewContainer.innerHTML = `
            <h4 class="text-lg font-medium mb-2">Preview Your Photo</h4>
            <div class="relative inline-block">
                <img id="preview" class="max-w-full max-h-64 object-contain mx-auto rounded" src="${photoData}" />
            </div>
            <div class="mt-4 flex justify-center space-x-3">
                <button id="retakePhotoBtn" class="btn secondary-btn bg-gray-600 text-white">
                    Retake
                </button>
                <button id="uploadPhotoBtn" class="btn primary-btn">
                    Upload Photo
                </button>
            </div>
        `;
        
        // Append it to the modal
        document.querySelector('#photoModal .bg-white').appendChild(previewContainer);
        
        // Show the modal again
        showPhotoOptions();
        
        // Set up event listeners for the buttons
        document.getElementById('retakePhotoBtn').addEventListener('click', function() {
            // Remove the preview
            previewContainer.remove();
            // Take another photo
            takePhoto();
        });
        
        document.getElementById('uploadPhotoBtn').addEventListener('click', function() {
            // Remove the preview
            previewContainer.remove();
            
            // Show loading overlay
            showLoadingOverlay("Uploading your photo...");
            
            // Simulate uploading the photo
            setTimeout(() => {
                hideLoadingOverlay();
                showNotification("Thank you! Your wedding photo has been added to our collection.", "success");
                closePhotoModal();
            }, 1500);
            
            // In a real implementation, you would send the photoData to your server/storage
        });
    } else {
        // Update existing preview
        const preview = document.getElementById('preview');
        if (preview) {
            preview.src = photoData;
        }
        // Show the modal again
        showPhotoOptions();
    }
}

function closeCameraView() {
    const cameraView = document.getElementById('cameraView');
    if (cameraView) {
        // Stop all video streams
        const video = document.getElementById('video');
        if (video && video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
        }
        
        cameraView.classList.add('hidden');
        // Optionally remove it completely
        setTimeout(() => {
            cameraView.remove();
        }, 300);
    }
}

function uploadToGoogleDrive() {
    // Show file picker dialog
    document.getElementById('fileInput').click();
}

// Handle file uploads in the background
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                // Show preview for first image
                const file = e.target.files[0];
                const reader = new FileReader();
                
                // Create or show preview container
                let previewContainer = document.getElementById('previewContainer');
                if (!previewContainer) {
                    // Create the preview container if it doesn't exist
                    previewContainer = document.createElement('div');
                    previewContainer.id = 'previewContainer';
                    previewContainer.className = 'mt-6 text-center';
                    previewContainer.innerHTML = `
                        <h4 class="text-lg font-medium mb-2">Preview Your Photo</h4>
                        <div class="relative inline-block">
                            <img id="preview" class="max-w-full max-h-64 object-contain mx-auto rounded" />
                            <div class="mt-2 text-sm text-gray-500">
                                <span id="photoCount">${e.target.files.length} photo${e.target.files.length > 1 ? 's' : ''} selected</span>
                            </div>
                        </div>
                        <div class="mt-4 flex justify-center space-x-3">
                            <button id="cancelUploadBtn" class="btn secondary-btn bg-gray-600 text-white">
                                Cancel
                            </button>
                            <button id="confirmUploadBtn" class="btn primary-btn">
                                Upload Photo${e.target.files.length > 1 ? 's' : ''}
                            </button>
                        </div>
                    `;
                    
                    // Append it to the modal
                    document.querySelector('#photoModal .bg-white').appendChild(previewContainer);
                    
                    // Set up event listeners for the buttons
                    document.getElementById('cancelUploadBtn').addEventListener('click', function() {
                        // Clear the file input
                        fileInput.value = '';
                        // Hide the preview
                        previewContainer.remove();
                    });
                    
                    document.getElementById('confirmUploadBtn').addEventListener('click', function() {
                        // Simulate uploading
                        previewContainer.remove();
                        simulatePhotoUpload(e.target.files);
                    });
                } else {
                    // Update existing preview container
                    document.getElementById('photoCount').textContent = 
                        `${e.target.files.length} photo${e.target.files.length > 1 ? 's' : ''} selected`;
                    document.getElementById('confirmUploadBtn').textContent = 
                        `Upload Photo${e.target.files.length > 1 ? 's' : ''}`;
                    previewContainer.style.display = 'block';
                }
                
                // Show preview of the first image
                reader.onload = function(e) {
                    const preview = document.getElementById('preview');
                    if (preview) {
                        preview.src = e.target.result;
                    }
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
});

function simulatePhotoUpload(files) {
    // Show loading overlay
    showLoadingOverlay(`Uploading ${files.length} photo${files.length > 1 ? 's' : ''}...`);
    
    // Simulate a delay for uploading
    setTimeout(() => {
        hideLoadingOverlay();
        showNotification(`Thank you! ${files.length} photo${files.length > 1 ? 's have' : ' has'} been added to our wedding collection.`, "success");
        closePhotoModal();
        
        // Clear the file input for next time
        document.getElementById('fileInput').value = '';
    }, 2000);
    
    // In a real implementation, you would use FormData and fetch/XMLHttpRequest to upload
    // the files to your server or to storage service
}

function uploadCapturedPhoto() {
    // In a real implementation, this would upload the photo to your storage
    alert("Thank you for sharing your wedding photo! In the real version, this would upload your photo to our collection.");
    closePhotoModal();
    
    // Show success notification
    showNotification("Photo shared successfully! Thanks for contributing to our wedding memories.");
}

// Add to Calendar functionality
function addToCalendar(eventTitle, eventDate, eventTime, venue) {
    const startDateTime = new Date(eventDate + ' ' + eventTime);
    const endDateTime = new Date(startDateTime.getTime() + 3600000); // Add 1 hour for event duration

    const googleCalendarUrl = 'https://www.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + encodeURIComponent(eventTitle) +
        '&dates=' + startDateTime.toISOString().replace(/-|:|\.\d+/g, '') +
        '/' + endDateTime.toISOString().replace(/-|:|\.\d+/g, '') +
        '&details=' + encodeURIComponent('Wedding Event in Uttarakhand') +
        '&location=' + encodeURIComponent(venue) +
        '&sf=true&output=xml';

    window.open(googleCalendarUrl, '_blank');
    
    // Show confirmation
    showNotification("Event added to your calendar!");
}

// Open Google Maps directions
function openDirections() {
    window.open('https://www.google.com/maps/search/?api=1&query=Nimbuchar+Kotdwar+Uttarakhand', '_blank');
}

// Live stream function
function openLiveStream() {
    alert("Get ready to join our wedding virtually! The livestream link will be available closer to the wedding date.");
}

// Notification system
function showNotification(message, type = 'success') {
    // Create container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container fixed top-4 right-4 z-50 flex flex-col items-end';
        document.body.appendChild(container);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `bg-white rounded shadow-md p-4 mb-2 transform translate-x-full transition-transform duration-300 ${type === 'error' ? 'border-l-4 border-red-500' : 'border-l-4 border-green-600'}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2 text-${type === 'error' ? 'red' : 'green'}-600">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            </span>
            <p class="text-sm">${message}</p>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }, 4000);
}

// Animation for event cards
document.addEventListener('DOMContentLoaded', function() {
    // Animate event cards when they come into view
    const eventCards = document.querySelectorAll('.event-card');
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers that don't support IntersectionObserver
        eventCards.forEach(card => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 500);
        });
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    eventCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});