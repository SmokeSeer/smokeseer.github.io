const FORM_COLS = ['name', 'company', 'email', 'message'];

document.addEventListener('DOMContentLoaded', function() {
    // SLAM videos toggle
    const slamCard = document.getElementById('slam-card');
    const slamVideos = document.getElementById('slam-videos');
    const closeButton = slamVideos.querySelector('.close-button');
    
    function toggleVideos(show) {
        slamVideos.classList.toggle('active', show);
        
        if (!show) {
            slamVideos.querySelectorAll('video').forEach(video => video.pause());
        }
        
        if (show) {
            document.addEventListener('keydown', handleVideoKeypress);
        } else {
            document.removeEventListener('keydown', handleVideoKeypress);
        }
    }

    function handleVideoKeypress(e) {
        // Prevent default behavior for these keys while modal is open
        if (['Space', 'ArrowLeft', 'ArrowRight', 'Escape'].includes(e.code)) {
            e.preventDefault();
        }

        const currentVideo = slides[currentSlide].querySelector('video');

        switch(e.code) {
            case 'Space':
                if (currentVideo.paused) {
                    currentVideo.play();
                } else {
                    currentVideo.pause();
                }
                break;
            case 'ArrowLeft':
                showSlide(currentSlide > 0 ? currentSlide - 1 : slides.length - 1);
                break;
            case 'ArrowRight':
                showSlide(currentSlide < slides.length - 1 ? currentSlide + 1 : 0);
                break;
            case 'Escape':
                toggleVideos(false);
                break;
        }
    }

    // Close on backdrop click
    document.querySelector('.backdrop').addEventListener('click', () => toggleVideos(false));
    
    slamCard.addEventListener('click', () => toggleVideos(true));
    closeButton.addEventListener('click', () => toggleVideos(false));
    
    // Close on backdrop click
    slamVideos.addEventListener('click', (e) => {
        if (e.target === slamVideos) {
            toggleVideos(false);
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Slideshow functionality
    const slidesContainer = document.querySelector('.slides-container');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(index) {
        // Pause and reset all videos
        slides.forEach(slide => {
            const video = slide.querySelector('video');
            video.pause();
            video.currentTime = 0;
        });
        
        // Scroll to selected slide
        slidesContainer.scrollTo({
            left: slides[index].offsetLeft,
            behavior: 'smooth'
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentSlide = index;
    }

    // Handle dot clicks
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Handle scroll events
    slamVideos.addEventListener('wheel', (e) => {
        if (!slamVideos.classList.contains('active')) return;

        e.stopPropagation();
        e.preventDefault();
        const delta = Math.sign(e.deltaX);
        const newIndex = currentSlide + delta;
        if (newIndex >= 0 && newIndex < slides.length) {
            showSlide(newIndex);
        }
    });

    // Initialize first slide
    showSlide(0);

    // Form submission handler
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your form submission logic here
        // form.reset();
        const button = form.querySelector('button');
        button.innerHTML = '<i class="fa-solid fa-spinner rotating"></i>'

        var formData = FORM_COLS.reduce((acc, col) => {
            const idName = `contact-form-${col}`;
            acc[col] = document.getElementById(idName).value;
            return acc;
        }
        , {});

        fetch("https://script.google.com/macros/s/AKfycby9JAnzrWH-yu0MYfDZ_9Rh31Q1rFSCo3uNjIOW_liwlO1Qrwag1_yt5IoE2fyC71QV/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        }).then(() => {
            document.getElementById("contact-confirmation").innerText = "Thank you for your interest. Our team will contact you soon.";
            form.style.display = 'none';
            form.reset();
            // alert('Thank you for your interest! We will contact you soon.');
        }).catch(error => {
            document.getElementById("contact-confirmation").innerText = "Something went wrong. Please try again later.";
            button.innerHTML = "Get in Touch";
            // alert('Something went wrong. Please try again later.')
        });
    });
});