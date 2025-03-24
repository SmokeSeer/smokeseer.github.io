const FORM_COLS = ['name', 'company', 'email', 'message'];

document.addEventListener('DOMContentLoaded', function() {
    // SLAM videos toggle
    const slamCard = document.getElementById('slam-card');
    const slamVideos = document.getElementById('slam-videos');
    
    slamCard.addEventListener('click', function() {
        slamVideos.classList.toggle('active');
        if (slamVideos.classList.contains('active')) {
            slamVideos.style.maxHeight = (300 + slamVideos.scrollHeight) + "px";
        } else {
            slamVideos.style.maxHeight = "0px";
        }
        // Pause all videos when closing the section
        if (!slamVideos.classList.contains('active')) {
            slamVideos.querySelectorAll('video').forEach(video => video.pause());
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
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
            // Pause all videos when changing slides
            slide.querySelector('video').pause();
        });
        slides[index].classList.add('active');
    }

    prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
        showSlide(currentSlide);
    });

    nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
        showSlide(currentSlide);
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