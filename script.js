// Initialize everything when the page loads
window.onload = function() {
    setupCountdown();
    animateCards();
    setupRSVPForm();
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

// RSVP Form Setup
function setupRSVPForm() {
    // Set up RSVP button to show/hide form
    const openRsvpBtn = document.getElementById('openRsvpBtn');
    const rsvpFormContainer = document.getElementById('rsvpFormContainer');
    const cancelRsvpBtn = document.getElementById('cancelRsvpBtn');
    
    if (openRsvpBtn && rsvpFormContainer) {
        openRsvpBtn.addEventListener('click', function() {
            rsvpFormContainer.classList.remove('hidden');
            openRsvpBtn.parentElement.classList.add('hidden');
            
            // Scroll to form
            rsvpFormContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
    
    if (cancelRsvpBtn) {
        cancelRsvpBtn.addEventListener('click', function() {
            rsvpFormContainer.classList.add('hidden');
            openRsvpBtn.parentElement.classList.remove('hidden');
            
            // Scroll back to button
            openRsvpBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
    
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent form submission
            
            // Show loading indicator
            showLoadingOverlay("Submitting your RSVP...");
            
            // Get form data
            const formData = new FormData(rsvpForm);
            const formDataObj = {};
            formData.forEach((value, key) => {
                // Handle multiple checkbox values
                if (key === 'events') {
                    if (!formDataObj[key]) {
                        formDataObj[key] = [];
                    }
                    formDataObj[key].push(value);
                } else {
                    formDataObj[key] = value;
                }
            });
            
            // In a real implementation, you would send this data to your server
            console.log('RSVP Data:', formDataObj);
            
            // For Google Sheets integration later:
            /*
            // Example of how to send to Google Sheets via a server proxy
            fetch('/api/submit-rsvp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObj)
            })
            .then(response => response.json())
            .then(data => {
                hideLoadingOverlay();
                if (data.success) {
                    showRSVPThanks(formDataObj);
                    rsvpForm.reset();
                } else {
                    showNotification("There was a problem submitting your RSVP. Please try again later.", "error");
                }
            })
            .catch(error => {
                hideLoadingOverlay();
                showNotification("Connection error. Please check your internet connection and try again.", "error");
            });
            */
            
            // For now, just show a thank you message
            setTimeout(() => {
                hideLoadingOverlay();
                showRSVPThanks(formDataObj);
                rsvpForm.reset();
                
                // Hide form, show button again
                rsvpFormContainer.classList.add('hidden');
                openRsvpBtn.parentElement.classList.remove('hidden');
            }, 1500);
        });
        
        // Show/hide guest count based on attendance
        const attendingRadios = document.querySelectorAll('input[name="attending"]');
        const guestCountField = document.getElementById('guestCount').parentElement;
        
        attendingRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'yes') {
                    guestCountField.style.display = 'block';
                } else {
                    guestCountField.style.display = 'none';
                }
            });
        });
        
        // Initial state
        if (document.querySelector('input[name="attending"]:checked')?.value === 'no') {
            guestCountField.style.display = 'none';
        }
    }
}

// Show RSVP thank you message
function showRSVPThanks(data) {
    // Create a simple alert with thank you message
    alert(`Thank you, ${data.name}! Your RSVP has been received. ${data.attending === 'yes' ? 'We look forward to celebrating with you!' : 'We will miss you at our celebration.'}`);
    
    // Also show a notification
    showNotification("Your RSVP has been received. Thank you!", "success");
}
}

// Photo sharing features
function showPhotoOptions() {
    document.getElementById('photoModal').classList.remove('hidden');
    document.getElementById('photoModal').classList.add('flex');
}

function closePhotoModal() {
    document.getElementById('photoModal').classList.add('hidden');
    document.getElementById('photoModal').classList.remove('flex');
    
    // Remove any preview containers if they exist
    const previewContainer = document.getElementById('previewContainer');
    if (previewContainer) {
        previewContainer.remove();
    }
}

// Choose files through file input
function chooseFiles() {
    document.getElementById('fileInput').click();
}

// Handle file uploads
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                // Show preview of selected photos
                showPhotoPreview(e.target.files);
            }
        });
    }
});

// Show preview of selected photos
function showPhotoPreview(files) {
    // Create or show preview container
    let previewContainer = document.getElementById('previewContainer');
    if (previewContainer) {
        previewContainer.remove();
    }
    
    // Create the preview container
    previewContainer = document.createElement('div');
    previewContainer.id = 'previewContainer';
    previewContainer.className = 'mt-6 text-center';
    previewContainer.innerHTML = `
        <h4 class="text-lg font-medium mb-2">Preview Your Photo</h4>
        <div class="relative inline-block">
            <img id="preview" class="max-w-full max-h-64 object-contain mx-auto rounded" />
            <div class="mt-2 text-sm text-gray-500">
                <span id="photoCount">${files.length} photo${files.length > 1 ? 's' : ''} selected</span>
            </div>
        </div>
        <div class="mt-4 flex justify-center space-x-3">
            <button id="cancelUploadBtn" class="btn secondary-btn bg-gray-600 text-white">
                Cancel
            </button>
            <button id="confirmUploadBtn" class="btn primary-btn">
                Upload Photo${files.length > 1 ? 's' : ''}
            </button>
        </div>
    `;
    
    // Append it to the modal
    document.querySelector('#photoModal .bg-white').appendChild(previewContainer);
    
    // Show preview of the first image
    if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('preview');
            if (preview) {
                preview.src = e.target.result;
            }
        };
        reader.readAsDataURL(files[0]);
    }
    
    // Set up event listeners for the buttons
    document.getElementById('cancelUploadBtn').addEventListener('click', function() {
        // Clear the file input
        fileInput.value = '';
        // Hide the preview
        previewContainer.remove();
    });
    
    document.getElementById('confirmUploadBtn').addEventListener('click', function() {
        // Process the upload
        processPhotoUpload(files);
    });
}

// Process photo upload (simulated for now)
function processPhotoUpload(files) {
    // Remove preview
    const previewContainer = document.getElementById('previewContainer');
    if (previewContainer) {
        previewContainer.remove();
    }
    
    // Show loading overlay
    showLoadingOverlay(`Processing ${files.length} photo${files.length > 1 ? 's' : ''}...`);
    
    // Hide loading after a short delay
    setTimeout(() => {
        hideLoadingOverlay();
        closePhotoModal();
        
        // Tell user that photo sharing will be available soon
        alert("Photo sharing will be available soon! Please check back closer to the wedding date.");
        
        // Clear file input for next time
        document.getElementById('fileInput').value = '';
    }, 1500);
}

// Take photo with camera
function takePhoto() {
    // Check if camera access is available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Show loading while accessing camera
        showLoadingOverlay("Accessing camera...");
        
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                hideLoadingOverlay();
                createCameraInterface(stream);
            })
            .catch(function(error) {
                hideLoadingOverlay();
                console.error("Error accessing camera:", error);
                showNotification("Could not access your camera. Please check permissions or try uploading photos instead.", "error");
            });
    } else {
        showNotification("Your device doesn't support camera access. Please use the upload option instead.", "error");
    }
}

// Create camera interface
function createCameraInterface(stream) {
    // Close photo modal
    closePhotoModal();
    
    // Create camera view
    const cameraView = document.createElement('div');
    cameraView.id = 'cameraView';
    cameraView.className = 'camera-view';
    cameraView.innerHTML = `
        <div class="camera-header">
            <button id="closeCameraBtn" class="camera-close-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="camera-content">
            <video id="cameraVideo" class="camera-video" autoplay playsinline></video>
        </div>
        <div class="camera-footer">
            <button id="capturePhotoBtn" class="camera-capture-btn">
                <i class="fas fa-camera" style="font-size: 24px;"></i>
            </button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(cameraView);
    
    // Set up video stream
    const video = document.getElementById('cameraVideo');
    video.srcObject = stream;
    
    // Set up close button
    document.getElementById('closeCameraBtn').addEventListener('click', function() {
        closeCameraView();
    });
    
    // Set up capture button
    document.getElementById('capturePhotoBtn').addEventListener('click', function() {
        capturePhoto(video);
    });
}

// Capture photo from video stream
function capturePhoto(video) {
    // Create a canvas to capture the photo
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = canvas.toDataURL('image/jpeg');
    
    // Close camera view
    closeCameraView();
    
    // Show photo preview modal
    showCapturedPhotoPreview(imageData);
}

// Show preview of captured photo
function showCapturedPhotoPreview(imageData) {
    // Show the photo modal again
    showPhotoOptions();
    
    // Create preview container
    const previewContainer = document.createElement('div');
    previewContainer.id = 'previewContainer';
    previewContainer.className = 'mt-6 text-center';
    previewContainer.innerHTML = `
        <h4 class="text-lg font-medium mb-2">Preview Your Photo</h4>
        <div class="relative inline-block">
            <img id="preview" class="max-w-full max-h-64 object-contain mx-auto rounded" src="${imageData}" />
        </div>
        <div class="mt-4 flex justify-center space-x-3">
            <button id="retakePhotoBtn" class="btn secondary-btn bg-gray-600 text-white">
                Retake
            </button>
            <button id="uploadCapturedBtn" class="btn primary-btn">
                Upload Photo
            </button>
        </div>
    `;
    
    // Add to modal
    document.querySelector('#photoModal .bg-white').appendChild(previewContainer);
    
    // Set up button actions
    document.getElementById('retakePhotoBtn').addEventListener('click', function() {
        previewContainer.remove();
        takePhoto();
    });
    
    document.getElementById('uploadCapturedBtn').addEventListener('click', function() {
        processCapturedPhotoUpload(imageData);
    });
}

// Process captured photo upload
function processCapturedPhotoUpload(imageData) {
    // Remove preview
    const previewContainer = document.getElementById('previewContainer');
    if (previewContainer) {
        previewContainer.remove();
    }
    
    // Show loading overlay
    showLoadingOverlay("Processing your photo...");
    
    // Hide loading after a short delay
    setTimeout(() => {
        hideLoadingOverlay();
        closePhotoModal();
        
        // Tell user that photo sharing will be available soon
        alert("Photo sharing will be available soon! Please check back closer to the wedding date.");
    }, 1500);
}

// Close camera view
function closeCameraView() {
    const cameraView = document.getElementById('cameraView');
    if (cameraView) {
        // Stop all video streams
        const video = document.getElementById('cameraVideo');
        if (video && video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        
        // Remove camera view
        cameraView.remove();
    }
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
    showNotification("Event added to your calendar!", "success");
}

// Open Google Maps directions
function openDirections() {
    window.open('https://www.google.com/maps/search/?api=1&query=Nimbuchar+Kotdwar+Uttarakhand', '_blank');
}

// Live stream function
function openLiveStream() {
    alert("Get ready to join our wedding virtually! The livestream link will be available closer to the wedding date.");
}

// Open RSVP form
function openRSVPForm() {
    // This function is no longer needed since we have an embedded form
    // Kept for backward compatibility
    const rsvpSection = document.querySelector('.content-section:has(#rsvpForm)');
    if (rsvpSection) {
        rsvpSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Loading overlay
function showLoadingOverlay(message) {
    // Create loading overlay if it doesn't exist
    let overlay = document.querySelector('.loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="text-center">
                <div class="spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        document.body.appendChild(overlay);
    } else {
        // Update message if it already exists
        overlay.querySelector('.loading-text').textContent = message;
        overlay.classList.remove('hidden');
    }
}

function hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        // Remove after animation
        setTimeout(() => overlay.remove(), 500);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-text">${message}</div>
        <div class="notification-close">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Set up close button
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) notification.remove();
                // Remove container if empty
                if (container.children.length === 0) container.remove();
            }, 300);
        }
    }, 5000);
}

// Animation for event cards
function animateCards() {
    const cards = document.querySelectorAll('.event-card');
    setTimeout(() => {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 200);
        });
    }, 1000);
}