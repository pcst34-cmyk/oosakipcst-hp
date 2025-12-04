document.addEventListener('DOMContentLoaded', function() {

    // 1. Drawer Menu Logic
    const hamburger = document.getElementById('js-hamburger');
    const nav = document.getElementById('js-nav');
    const overlay = document.getElementById('js-drawer-overlay');

    if (hamburger && nav && overlay) {
        const navLinks = nav.querySelectorAll('a');

        // Function to open/close the drawer
        const toggleDrawer = () => {
            hamburger.classList.toggle('is-active');
            nav.classList.toggle('is-active');
            overlay.classList.toggle('is-active');
            document.body.classList.toggle('no-scroll'); // Prevent body scroll when drawer is open
        };

        // Hamburger click opens/closes drawer
        hamburger.addEventListener('click', toggleDrawer);

        // Overlay click closes drawer
        overlay.addEventListener('click', toggleDrawer);

        // Clicking a nav link closes the drawer
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (nav.classList.contains('is-active')) {
                    toggleDrawer();
                }
            });
        });
    }

    // 3. Postal Code to Address Autofill Logic
    const zipSearchButton = document.getElementById('zip-search');
    const zipInput = document.getElementById('zip');
    const addressInput = document.getElementById('address');

    if (zipSearchButton && zipInput && addressInput) {
        zipSearchButton.addEventListener('click', function() {
            let zipcode = zipInput.value;
            
            zipcode = zipcode.replace(/[０-９]/g, function(s) {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
            }).replace(/[-－ー]/g, "");

            if (!/^\d{7}$/.test(zipcode)) {
                alert('有効な7桁の郵便番号を入力してください。');
                return;
            }

            const apiUrl = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`;
            
            zipSearchButton.textContent = '検索中...';
            zipSearchButton.disabled = true;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200 && data.results) {
                        const result = data.results[0];
                        const fullAddress = result.address1 + result.address2 + result.address3;
                        addressInput.value = fullAddress;
                    } else {
                        alert('住所が見つかりませんでした。郵便番号をご確認ください。');
                    }
                })
                .catch(error => {
                    console.error('Error fetching address:', error);
                    alert('住所の取得に失敗しました。時間をおいて再度お試しください。');
                })
                .finally(() => {
                    zipSearchButton.textContent = '住所検索';
                    zipSearchButton.disabled = false;
                });
        });
    }

    // 4. Fade-in on Scroll Animation
    const fadeInTargets = document.querySelectorAll('.fade-in-target');
    if (fadeInTargets.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once it's visible
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1 // Triggers when 10% of the element is visible
        });

        fadeInTargets.forEach(target => {
            observer.observe(target);
        });
    }

    // 5. Hero Slideshow Logic
    const slides = document.querySelectorAll('.hero .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
    }

});