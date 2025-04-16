// Mountain Wedding Invitation - Complete JavaScript

// Initialize everything when the page loads
window.onload = function() {
    startAnimations();
    initializeLeaves();
    animateCards();
    setupCountdown();
    
    // Update with the actual names for the wedding
    document.getElementById('leftName').textContent = "Your";
    document.getElementById('rightName').textContent = "Name";
    document.querySelector('#main-content h1').textContent = "Your & Name";
    document.querySelector('#celebration h2').innerHTML = "<span class='block'>Your</span><span class='block'>&</span><span class='block'>Name</span>";
};

// Splash screen animation and timing
setTimeout(() => {
    document.getElementById('splash').style.opacity = 0;
    setTimeout(() => {
        document.getElementById('splash').style.display = 'none';
        // Show the navbar
        const navbar = document.querySelector('.navbar');
        navbar.style.opacity = 1;
        navbar.style.pointerEvents = 'auto';
    }, 1000);
}, 5000);

// Typing animation for splash screen
function typeWriter(text, i, fnCallback) {
    if (i < text.length) {
        document.getElementById("typing-text").innerHTML = text.substring(0, i + 1) + '<span class="blinking-cursor">|</span>';

        setTimeout(function() {
            typeWriter(text, i + 1, fnCallback)
        }, 100);
    } else if (typeof fnCallback == 'function') {
        // Remove the blinking cursor
        document.getElementById("typing-text").innerHTML = text;
        setTimeout(fnCallback, 700);
    }
}

// Fade in animation for elements
function fadeIn(element, duration, callback) {
    element.style.opacity = 0;
    element.style.display = 'block';
    let opacity = 0;
    const interval = 50;
    const gap = interval / duration;

    function increaseOpacity() {
        opacity += gap;
        element.style.opacity = Math.min(opacity, 1);
        if (opacity < 1) {
            requestAnimationFrame(increaseOpacity);
        } else if (callback) {
            callback();
        }
    }

    requestAnimationFrame(increaseOpacity);
}

// Start the animations sequence
function startAnimations() {
    let typingText = "Join us as we say 'I do' in the mountains";
    typeWriter(typingText, 0, function() {
        // Typing animation is complete, start the fade-in of main content
        const mainContent = document.getElementById("main-content");
        fadeIn(mainContent, 1000);
    });
}

// Create and animate falling leaves
const leaves = ['🍃', '🍂', '🍁', '🌿', '☘️'];
const maxLeaves = 15;
let currentLeaves = 0;

function createLeaf() {
    if (currentLeaves >= maxLeaves) return;

    const leaf = document.createElement('div');
    leaf.classList.add('leaf');
    leaf.style.left = `${Math.random() * 100}vw`;
    leaf.style.animationDuration = `${Math.random() * 3 + 5}s`;
    leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
    document.getElementById('leaves-container').appendChild(leaf);
    currentLeaves++;

    leaf.addEventListener('animationend', () => {
        leaf.remove();
        currentLeaves--;
        setTimeout(createLeaf, Math.random() * 1000);
    });
}

function initializeLeaves() {
    for (let i = 0; i < maxLeaves; i++) {
        setTimeout(createLeaf, Math.random() * 3000);
    }
}

// Header carousel controls
const headerCarouselContainer = document.querySelector('.header-carousel-container');
const headerCarouselItems = headerCarouselContainer.querySelectorAll('.header-carousel-item');
let headerCurrentIndex = 0;

function updateHeaderCarousel() {
    headerCarouselContainer.style.transform = `translateX(-${headerCurrentIndex * 100}%)`;
}

function slideHeaderCarousel(direction) {
    headerCurrentIndex = (headerCurrentIndex + direction + headerCarouselItems.length) % headerCarouselItems.length;
    updateHeaderCarousel();
}

// Auto slide every 4 seconds
setInterval(() => slideHeaderCarousel(1), 4000);

// Initialize the carousel
updateHeaderCarousel();

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
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${minutes}</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${seconds}</span>
                    <span class="countdown-label">Seconds</span>
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

// Add to Calendar function
function addToCalendar(eventTitle, eventDate, eventTime, venue) {
    const startDateTime = new Date(eventDate + ' ' + eventTime);
    const endDateTime = new Date(startDateTime.getTime() + 3600000); // Add 1 hour for event duration

    const ua = navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    const isMac = /macintosh|mac os x/.test(ua);
    const isWindows = /win/.test(ua);

    if (isiOS) {
        addToAppleCalendar(eventTitle, startDateTime, endDateTime, venue);
    } else if (isAndroid) {
        addToGoogleCalendar(eventTitle, startDateTime, endDateTime, venue);
    } else if (isMac) {
        // Offer choice between Apple Calendar and Google Calendar
        if (confirm('Do you want to add this event to Apple Calendar? Click OK for Apple Calendar or Cancel for Google Calendar.')) {
            addToAppleCalendar(eventTitle, startDateTime, endDateTime, venue);
        } else {
            addToGoogleCalendar(eventTitle, startDateTime, endDateTime, venue);
        }
    } else if (isWindows) {
        // Offer choice between Outlook and Google Calendar
        if (confirm('Do you want to add this event to Outlook? Click OK for Outlook or Cancel for Google Calendar.')) {
            addToOutlookCalendar(eventTitle, startDateTime, endDateTime, venue);
        } else {
            addToGoogleCalendar(eventTitle, startDateTime, endDateTime, venue);
        }
    } else {
        // Default to Google Calendar for unknown devices
        addToGoogleCalendar(eventTitle, startDateTime, endDateTime, venue);
    }
}

function addToGoogleCalendar(eventTitle, startDateTime, endDateTime, venue) {
    const googleCalendarUrl = 'https://www.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + encodeURIComponent(eventTitle) +
        '&dates=' + startDateTime.toISOString().replace(/-|:|\.\d+/g, '') +
        '/' + endDateTime.toISOString().replace(/-|:|\.\d+/g, '') +
        '&details=' + encodeURIComponent('Mountain Wedding Event') +
        '&location=' + encodeURIComponent(venue) +
        '&sf=true&output=xml';

    window.open(googleCalendarUrl, '_blank');
}

function addToAppleCalendar(eventTitle, startDateTime, endDateTime, venue) {
    const appleCalendarUrl = 'data:text/calendar;charset=utf-8,' +
        encodeURIComponent('BEGIN:VCALENDAR\n' +
            'VERSION:2.0\n' +
            'BEGIN:VEVENT\n' +
            'URL:' + document.URL + '\n' +
            'DTSTART:' + startDateTime.toISOString().replace(/-|:|\.\d+/g, '') + '\n' +
            'DTEND:' + endDateTime.toISOString().replace(/-|:|\.\d+/g, '') + '\n' +
            'SUMMARY:' + eventTitle + '\n' +
            'DESCRIPTION:Mountain Wedding Event\n' +
            'LOCATION:' + venue + '\n' +
            'END:VEVENT\n' +
            'END:VCALENDAR');

    window.open(appleCalendarUrl);
}

function addToOutlookCalendar(eventTitle, startDateTime, endDateTime, venue) {
    window.open('https://outlook.office.com/owa/?path=/calendar/action/compose&rru=addevent&' +
        'subject=' + encodeURIComponent(eventTitle) +
        '&startdt=' + startDateTime.toISOString() +
        '&enddt=' + endDateTime.toISOString() +
        '&body=' + encodeURIComponent('Mountain Wedding Event') +
        '&location=' + encodeURIComponent(venue));
}

// Open Google Maps directions
function openDirections() {
    window.open('https://www.google.com/maps/search/?api=1&query=Nimbuchar+Kotdwar+Uttarakhand', '_blank');
}

// Live stream function
function openLiveStream() {
    alert("Get ready to join us virtually! The livestream link will be available closer to the wedding date.");
    // In production, replace with actual live stream URL:
    // window.open("https://your-livestream-url.com", "_blank");
}

// Scroll animation for event cards
const eventCards = document.querySelectorAll('.event-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

eventCards.forEach(card => {
    observer.observe(card);
});

// Location carousel
const locationCarousel = document.querySelector('.location-carousel');
const locationImages = locationCarousel.querySelectorAll('img');
let currentLocationImage = 0;

function showNextLocationImage() {
    locationImages[currentLocationImage].classList.remove('active');
    currentLocationImage = (currentLocationImage + 1) % locationImages.length;
    locationImages[currentLocationImage].classList.add('active');
}

setInterval(showNextLocationImage, 3000);

// Animate cards on page load
function animateCards() {
    const cards = document.querySelectorAll('.event-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 300); // Stagger the animations
    });
}

// Show names in navbar on scroll
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    const threshold = viewportHeight * 0.5; // 50vh

    if (scrollPosition > threshold) {
        document.getElementById('leftName').classList.add('visible');
        document.getElementById('rightName').classList.add('visible');
    } else {
        document.getElementById('leftName').classList.remove('visible');
        document.getElementById('rightName').classList.remove('visible');
    }
});

// Loading overlay functions
function showLoading(message) {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.classList.add('loading-overlay');
    loadingOverlay.innerHTML = `
        <div>
            <div class="spinner"></div>
            <div class="loading-text">${message}</div>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
}

function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// Notification function
function showNotification(message, type = 'success') {
    const container = document.querySelector('.notification-container') || createNotificationContainer();
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    // Trigger reflow to ensure the animation works
    notification.offsetHeight;

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 500);
    }, 3000);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
    return container;
}

// Photo sharing functions
function showPhotoOptions() {
    document.getElementById('photoModal').classList.remove('hidden');
    document.getElementById('photoModal').classList.add('flex');
}

function closePhotoModal() {
    document.getElementById('photoModal').classList.add('hidden');
    document.getElementById('photoModal').classList.remove('flex');
}

let capturedImage = null;

function takePhoto() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            const video = document.getElementById('video');
            video.srcObject = stream;
            video.play();
            document.getElementById('cameraView').classList.remove('hidden');
            document.getElementById('photoModal').classList.add('hidden');

            document.getElementById('captureBtn').onclick = function() {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                capturedImage = canvas.toDataURL('image/jpeg');
                showPreview();
            };
        })
        .catch(function(err) {
            console.error("Error accessing the camera", err);
            showNotification("Error accessing the camera. Please try again or use the upload option.", "error");
        });
}

function showPreview() {
    const preview = document.getElementById('preview');
    preview.src = capturedImage;
    document.getElementById('cameraView').classList.add('hidden');
    document.getElementById('previewView').classList.remove('hidden');
}

function retakePhoto() {
    document.getElementById('previewView').classList.add('hidden');
    document.getElementById('cameraView').classList.remove('hidden');
}

function uploadCapturedPhoto() {
    if (capturedImage) {
        showLoading('Uploading your photo...');
        // Simulate uploading process (replace with actual upload in production)
        setTimeout(() => {
            hideLoading();
            showNotification('Thank you for sharing your moment! Your photo has been uploaded.', 'success');
            closePreviewView();
        }, 1500);
    } else {
        showNotification('No photo captured. Please take a photo first.', 'error');
    }
}

function closePreviewView() {
    document.getElementById('previewView').classList.add('hidden');
    closeCameraView();
}

function closeCameraView() {
    const video = document.getElementById('video');
    const stream = video.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    document.getElementById('cameraView').classList.add('hidden');
    document.getElementById('photoModal').classList.remove('hidden');
    document.getElementById('photoModal').classList.add('flex');
}

function uploadPhotos() {
    document.getElementById('fileInput').click();
}

document.getElementById('fileInput').addEventListener('change', function(event) {
    const files = event.target.files;
    if (files.length > 0) {
        showLoading('Uploading your photos...');
        // Simulate uploading process (replace with actual upload in production)
        setTimeout(() => {
            hideLoading();
            const message = files.length === 1
                ? 'Thank you for sharing your moment! Your photo has been uploaded.'
                : `Thank you for sharing your moments! ${files.length} photos have been uploaded.`;
            showNotification(message, 'success');
        }, 2000);
    }
    closePhotoModal();
});