window.onload = function () {

    function animateMainMenu() {
        let sections = document.querySelectorAll('[id]');

        const options = {
            threshold: 0.95,
        };

        let observer = new IntersectionObserver(navCheck, options);

        function navCheck(entries) {
            entries.forEach((entry) => {
                const blocksID = entry.target.id;
                const activeAnchor = document.querySelector(`[data-page=${blocksID}]`);
                if (entry.intersectionRatio > 0.7) {
                    let activeAnchors = document.querySelectorAll('nav a[data-page]');
                    activeAnchors.forEach((anchor) => {
                        anchor.classList.remove('active');
                    });
                    activeAnchor.classList.add('active');
                }

                const coords = activeAnchor.getBoundingClientRect();
                const directions = {
                    height: coords.height,
                    width: coords.width,
                    top: coords.top,
                    left: coords.left
                };
            });
        }

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    function animateScroll() {
        const anchors = document.querySelectorAll('nav a[href*="#"]');

        for (let anchor of anchors) {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const blockID = anchor.getAttribute('href');
                document.querySelector(`${blockID}`).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    }

    function slideMainSlider() {
        let slides = document.querySelectorAll('.slider__item'),
            currentIndex = 0,
            nextSlide = document.querySelector('.slider__control_next'),
            previousSlide = document.querySelector('.slider__control_prev');

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.left = (i * 100) + '%';
        }

        nextSlide.addEventListener('click', (e) => {
            e.preventDefault();

            for (let i = 0; i < slides.length; i++) {
                if (currentIndex == slides.length - 1) {

                    for (let j = 0; j < slides.length; j++) {
                        slides[j].style.left = (j * 100) + '%';
                    }
                    break;

                } else {
                    slides[i].style.left = slides[i].style.left.replace('%', '') - 100 + '%';
                }
            }

            if (currentIndex == slides.length - 1) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
        });

        previousSlide.addEventListener('click', (e) => {
            e.preventDefault();
            for (let i = 0; i < slides.length; i++) {
                if (currentIndex == 0) {

                    for (let j = slides.length - 1, counter = 0; j >= 0; j--, counter++) {
                        slides[j].style.left = -(counter * 100) + '%';
                    }
                    break;

                } else {
                    slides[i].style.left = +slides[i].style.left.replace('%', '') + 100 + '%';
                }
            }

            if (currentIndex == 0) {
                currentIndex = slides.length - 1;
            } else {
                currentIndex--;
            }
        });
    }

    let portfolioCategory = document.querySelector('.portfolio__img-category'),
        portfolioCategoryBtns = document.querySelectorAll('.img-category'),
        portfolioImagesBlock = document.querySelector('.img__all .layout-4-column');

    const QUANTITY_IMAGES = 12;

    function switchImageCategory() {

        portfolioCategory.addEventListener('click', (e) => {
            if (e.target.className == 'img-category' && e.target.tagName == 'SPAN') {
                for (let i = 0; i < portfolioCategoryBtns.length; i++) {
                    portfolioCategoryBtns[i].classList.remove('category_active');
                }

                let removeTooltip = document.querySelector('.tooltip').remove();

                portfolioImagesBlock.innerHTML = '';

                for (let i = 0; i < portfolioCategoryBtns.length; i++) {
                    if (e.target == portfolioCategoryBtns[i]) {
                        portfolioCategoryBtns[i].classList.add('category_active');
                        const PATH = `./assets/images/portfolio/${portfolioCategoryBtns[i].getAttribute('data-index')}`;

                        for (let j = 0; j < QUANTITY_IMAGES; j++) {
                            let newImage = new Image();
                            newImage.src = `${PATH}/p${j + 1}.jpg`;
                            newImage.setAttribute('class', 'portfolio__image');
                            newImage.setAttribute('alt', 'Portfolio images');
                            newImage.setAttribute('data-tooltip', 'click me');
                            portfolioImagesBlock.appendChild(newImage);
                        }
                        break;
                    }
                }
            }
        });
    }

    function magnifyImage() {
        portfolioImagesBlock.addEventListener('click', (e) => {
            let IMAGES = document.querySelectorAll('.portfolio__image');

            if (e.target.className == 'portfolio__image' && e.target.tagName == 'IMG') {
                let overlay = document.createElement('div');
                overlay.classList.add('overlay');
                document.body.appendChild(overlay);

                let magnifyImgWrapper = document.createElement('div');
                magnifyImgWrapper.classList.add('magnify-img-item');

                let currentIndexSlider = 0;

                for (let i = 0; i < IMAGES.length; i++) {
                    let fullSizeImage = new Image();
                    fullSizeImage.setAttribute('class', 'image_full');
                    fullSizeImage.setAttribute('alt', 'Portfolio image');
                    fullSizeImage.setAttribute('src', IMAGES[i].src);
                    fullSizeImage.style.display = 'none';
                    if (e.target == IMAGES[i]) {
                        currentIndexSlider = i;
                        fullSizeImage.style.display = 'block';
                        fullSizeImage.style.opacity = 1;
                    }

                    magnifyImgWrapper.appendChild(fullSizeImage);

                }

                let close = document.createElement('i');
                close.classList.add('close');

                let next = document.createElement('span');
                next.classList.add('next');
                next.innerText = '❯';

                let previous = document.createElement('span');
                previous.classList.add('previous');
                previous.innerText = '❮';

                let wrapper = document.createElement('div');
                wrapper.classList.add('magnify-wrapper');
                wrapper.appendChild(magnifyImgWrapper);
                wrapper.appendChild(close);
                wrapper.appendChild(next);
                wrapper.appendChild(previous);
                overlay.appendChild(wrapper);

                setTimeout(() => {
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.opacity = 1;
                }, 100);
                thumbMagnifiedImage(next, previous, wrapper, currentIndexSlider);
                closeMagnifyImage(overlay);
            }
        });

    }

    function thumbMagnifiedImage(next, previous, imgWrapper, currentIndexSlider) {
        let images = document.querySelectorAll('.image_full');

        if (next && previous && images) {
            next.addEventListener('click', (e) => {
                ++currentIndexSlider;
                if (currentIndexSlider == images.length) {
                    currentIndexSlider = 0;
                }
                for (let i = 0; i < images.length; i++) {
                    images[i].style.display = 'none';
                    images[i].style.opacity = 0;
                }
                images[currentIndexSlider].style.display = 'block';

                setTimeout(() => {
                    images[currentIndexSlider].style.opacity = 1;
                }, 10);
            });

            previous.addEventListener('click', (e) => {
                --currentIndexSlider;
                if (currentIndexSlider < 0) {
                    currentIndexSlider = images.length - 1;
                }
                for (let i = 0; i < images.length; i++) {
                    images[i].style.display = 'none';
                    images[i].style.opacity = 0;
                }
                images[currentIndexSlider].style.display = 'block';

                setTimeout(() => {
                    images[currentIndexSlider].style.opacity = 1;
                }, 10);
            });

            imgWrapper.addEventListener('mouseenter', showArrows);
            imgWrapper.addEventListener('mouseleave', showArrows);

            function showArrows(e) {
                if ((e.target.className == 'magnify-wrapper' && e.target.tagName == 'DIV') && e.type == 'mouseenter') {
                    previous.classList.add('show-arrows-left');
                    next.classList.add('show-arrows-right');
                }

                if ((e.target.className == 'magnify-wrapper' && e.target.tagName == 'DIV') && e.type == 'mouseleave') {
                    previous.classList.remove('show-arrows-left');
                    next.classList.remove('show-arrows-right');
                }
            }
        }
    }

    function closeMagnifyImage(overlay) {
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if ((e.target.className == 'close' && e.target.tagName == 'I') || (e.target.className == 'overlay' && e.target.tagName == 'DIV')) {
                    setTimeout(() => {
                        overlay.style.height = '0%';
                        overlay.style.opacity = 0;
                    }, 100);
                    setTimeout(() => {
                        overlay.remove();
                        overlay.style.width = '0%';
                    }, 300);
                }
            });
        }
    }

    function addBalloonHint() {
        document.addEventListener('mouseover', getTooltip);
        document.addEventListener('mouseout', getTooltip);

        function getTooltip(e) {
            let dataTooltip = document.querySelectorAll('[data-tooltip]');

            let tooltipBlock = document.createElement('div');
            tooltipBlock.classList.add('tooltip');
            tooltipBlock.innerText = e.target.getAttribute('data-tooltip');

            if ((e.target.hasAttribute('data-tooltip') && !e.target.classList.contains('category_active')) && e.type == 'mouseover') {

                document.body.appendChild(tooltipBlock);
                let blockCoordinates = e.target.getBoundingClientRect(),
                    centeredBlock = blockCoordinates.left + blockCoordinates.width / 2 - tooltipBlock.offsetWidth / 2,
                    topBlock = blockCoordinates.top - tooltipBlock.offsetHeight;

                tooltipBlock.style.opacity = 1;
                tooltipBlock.style.left = `${centeredBlock}px`;
                tooltipBlock.style.top = `${topBlock - 25}px`;

                window.addEventListener('scroll', (e) => {
                    tooltipBlock.remove();
                    return;
                });
            }

            if ((e.target.hasAttribute('data-tooltip') && !e.target.classList.contains('category_active')) && e.type == 'mouseout') {
                let tooltipBlock = document.querySelector('.tooltip');

                if (tooltipBlock != null) {
                    setTimeout(() => {
                        tooltipBlock.style.top = 0;
                        tooltipBlock.style.opacity = 0;
                    }, 100);

                    tooltipBlock.remove();
                }
            }
        }
    }

    function validateForm() {
        let inputName = document.querySelector('input[name="name"]'),
            inputEmail = document.querySelector('input[name="email"]'),
            inputSubmit = document.querySelector('.form__input_submit'),
            emailMask = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
            nameMask = /^[A-Za-z]+(\s)?([A-Za-z]+)?$/;

        inputEmail.addEventListener('input', function (e) {
            let emailValue = this.value;
            if (emailMask.test(emailValue) === true) {
                this.style.border = '2px solid green';

                if (nameMask.test(inputName.value) === true) {
                    inputSubmit.classList.remove('disabled');
                    inputSubmit.removeAttribute('data-tooltip');
                } else {
                    inputSubmit.classList.add('disabled');
                    inputSubmit.setAttribute('data-tooltip', 'required fields: name & email');
                }
            } else {
                this.style.border = '2px solid red';
                inputSubmit.classList.add('disabled');
                inputSubmit.setAttribute('data-tooltip', 'required fields: name & email');
            }

            if (!this.value.length) {
                this.style.border = 'none';
            }
        });

        inputName.addEventListener('input', function (e) {
            let nameValue = this.value;
            if (nameMask.test(nameValue) === true) {
                this.style.border = '2px solid green';

                if (emailMask.test(inputEmail.value) === true) {
                    inputSubmit.classList.remove('disabled');
                    inputSubmit.removeAttribute('data-tooltip');
                } else {
                    inputSubmit.classList.add('disabled');
                    inputSubmit.setAttribute('data-tooltip', 'required fields: name & email');
                }
            } else {
                this.style.border = '2px solid red';
                inputSubmit.classList.add('disabled');
                inputSubmit.setAttribute('data-tooltip', 'required fields: name & email');
            }

            if (!this.value.length) {
                this.style.border = 'none';
            }
        });

        inputSubmit.addEventListener('click', function (e) {
            if (this.classList.contains('disabled')) {
                e.preventDefault();
                if (emailMask.test(inputEmail.value) === false || inputEmail.value.length == 0) {
                    inputEmail.style.border = '2px solid red';
                }
                if (nameMask.test(inputName.value) === false || inputName.value.length == 0) {
                    inputName.style.border = '2px solid red';
                }
            }
        });
    }

    function stickHeader() {
        let header = document.querySelector('.header'),
            h1 = document.querySelector('h1'),
            navLinks = document.querySelector('.navigation__links'),
            logo = document.querySelector('.logo'),
            headerStub = document.querySelector('.header-stub');

        window.addEventListener('scroll', function (e) {
            let headerCoords = 0;
            if (window.scrollY > 150) {
                header.style.height = '50px';
                header.style.position = 'sticky';
                header.style.top = '0';
                h1.style.marginTop = '4px';
                navLinks.style.marginTop = '15px';
                logo.style.fontSize = '1.8rem';
                headerStub.style.display = 'block';
            } else {
                header.style.height = '95px';
                header.style.position = 'unset';
                h1.style.marginTop = '25px';
                navLinks.style.marginTop = '40px';
                logo.style.fontSize = '2.6rem';
                headerStub.style.display = 'none';
            }
        });
    }

    stickHeader();
    animateScroll();
    animateMainMenu();
    slideMainSlider();
    switchImageCategory();
    magnifyImage();
    addBalloonHint();
    validateForm();

}