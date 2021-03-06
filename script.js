window.onload = function () {
    let flag = false;

    function animateMainMenu() {
        let toBottom = screen.height < 1000 ? 1000 : screen.height >= 1000 && screen.height <= 1200 ? 1250 : screen.height >= 1410 ? 1485 : 1500,
            scrollHeight = Math.max(
                document.body.scrollHeight, document.documentElement.scrollHeight,
                document.body.offsetHeight, document.documentElement.offsetHeight,
                document.body.clientHeight, document.documentElement.clientHeight
            );
        window.addEventListener('scroll', function (e) {
            let activeAnchors = document.querySelectorAll('nav a[data-page]'),
                scrollFromTop = window.scrollY;

            activeAnchors.forEach((anchor) => {
                let sectionsID = document.querySelector(anchor.hash);

                if (scrollHeight - scrollFromTop <= toBottom) {
                    anchor.classList.remove('active');
                    activeAnchors[activeAnchors.length - 1].classList.add('active');
                    return;
                }

                if (sectionsID.offsetTop <= scrollFromTop && 
                    sectionsID.offsetTop + sectionsID.offsetHeight - 3 > scrollFromTop) {
                    anchor.classList.add('active');
                } else {
                    if (scrollFromTop <= 150) {
                        activeAnchors[0].classList.add('active');
                    }else {
                        anchor.classList.remove('active');
                    }
                }
            });
        });
    }

    function animateScroll() {
        const anchors = document.querySelectorAll('nav a[href*="#"]');

        for (let anchor of anchors) {
            anchor.addEventListener('click', (e) => {
                for (let i = 0; i < anchors.length; i++) {
                    anchors[i].classList.remove('active');
                    if (e.target == anchors[i]) {
                        anchors[i].classList.add('active');
                    }
                }
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
            previousSlide = document.querySelector('.slider__control_prev'),
            sliderBlock = document.querySelector('.slider');

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
            currentIndex % 2 != 0 ? sliderBlock.classList.add('bg_blue') : sliderBlock.classList.remove('bg_blue');
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
            currentIndex % 2 != 0 ? sliderBlock.classList.add('bg_blue') : sliderBlock.classList.remove('bg_blue');
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

                // let removeTooltip = document.querySelector('.tooltip').remove();

                portfolioImagesBlock.innerHTML = '';

                for (let i = 0; i < portfolioCategoryBtns.length; i++) {
                    if (e.target == portfolioCategoryBtns[i]) {
                        portfolioCategoryBtns[i].classList.add('category_active');
                        const PATH = `./assets/images/portfolio/${portfolioCategoryBtns[i].getAttribute('data-index')}`;
                        let arrImages = [];

                        for (let j = 0; j < QUANTITY_IMAGES; j++) {
                            let newImage = new Image();
                            newImage.src = `${PATH}/p${j + 1}.jpg`;
                            newImage.setAttribute('class', 'portfolio__image');
                            newImage.setAttribute('alt', 'Portfolio images');
                            newImage.setAttribute('data-tooltip', 'click me');
                            arrImages.push(newImage);
                            if(j == QUANTITY_IMAGES - 1) {
                                shuffle(arrImages);
                                for(let k = 0; k < arrImages.length; k++) {
                                    portfolioImagesBlock.appendChild(arrImages[k]);
                                }
                            }
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
                    IMAGES[i].classList.remove('portfolio-img-active');
                }

                for (let i = 0; i < IMAGES.length; i++) {
                    let fullSizeImage = new Image();
                    fullSizeImage.setAttribute('class', 'image_full');
                    fullSizeImage.setAttribute('alt', 'Portfolio image');
                    fullSizeImage.setAttribute('src', IMAGES[i].src);
                    fullSizeImage.style.display = 'none';
                    if (e.target == IMAGES[i]) {
                        IMAGES[i].classList.add('portfolio-img-active');
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
                closeOverlay(overlay);
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

            if (document.documentElement.clientWidth > 768) {
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
            }else {
                previous.classList.add('show-arrows-left');
                next.classList.add('show-arrows-right');
            }

            
        }
    }

    function closeOverlay(overlay, inputName, inputEmail, inputSubject, inputDescribe, inputSubmit) {
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if ((e.target.className == 'popup-close' && e.target.tagName == 'SPAN') || e.target.classList.contains('overlay-form')) {
                    inputSubject.value = '';
                    inputDescribe.value = '';
                    inputName.value = '';
                    inputEmail.value = '';

                    inputName.style.border = 'none';
                    inputEmail.style.border = 'none';

                    inputSubmit.classList.add('disabled');
                    inputSubmit.setAttribute('data-tooltip', 'required fields: name & email');
                }

                if ((e.target.className == 'close' && e.target.tagName == 'I') || (e.target.className == 'popup-close' && e.target.tagName == 'SPAN') || (e.target.className == 'overlay' && e.target.tagName == 'DIV') || e.target.classList.contains('overlay-form')) {
                    setTimeout(() => {
                        overlay.style.height = '0%';
                        overlay.style.opacity = 0;
                    }, 100);
                    setTimeout(() => {
                        overlay.remove();
                        overlay.style.width = '0%';
                    }, 300);
                }

                if (e.target.classList.contains('overlay-menu')) {
                    let overlay = document.querySelector('.overlay-menu'),
                        burger = document.querySelector('.hamburger'),
                        headerNavigation = document.querySelector('.header__navigation');
                    setTimeout(() => {
                        overlay.style.height = '0%';
                        overlay.style.opacity = 0;
                    }, 100);
                    setTimeout(() => {
                        overlay.remove();
                        overlay.style.width = '0%';
                    }, 300);
                    headerNavigation.classList.remove('mobile-menu_active');
                    burger.classList.remove('active');

                    let menuItems = headerNavigation.querySelectorAll('.navigation__link');
                    for (let i = 0; i < menuItems.length; i++) {
                        menuItems[i].removeAttribute('style');
                    }
                    flag = false;
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
            inputSubject = document.querySelector('input[name="subject"]'),
            inputDescribe = document.querySelector('textarea[name="describe"]'),
            inputSubmit = document.querySelector('.form__input_submit'),
            emailMask = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
            nameMask = /^[A-Za-zа-яА-Я]+(\s)?([A-Za-zа-яА-Я]+)?$/;

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
            e.preventDefault();
            if (this.classList.contains('disabled')) {
                if (emailMask.test(inputEmail.value) === false || inputEmail.value.length == 0) {
                    inputEmail.style.border = '2px solid red';
                }
                if (nameMask.test(inputName.value) === false || inputName.value.length == 0) {
                    inputName.style.border = '2px solid red';
                }
            }else {
                let overlay = document.createElement('div');
                overlay.classList.add('overlay', 'overlay-form');
                document.body.appendChild(overlay);

                let close = document.createElement('span');
                close.innerText = 'OK';
                close.classList.add('popup-close');

                let wrapper = document.createElement('div');
                wrapper.classList.add('form-popup');

                let textP = document.createElement('div');
                textP.innerHTML = `<p class="success">Письмо отправлено</p><b>Тема:</b><p class='popup-description'>${inputSubject.value ? inputSubject.value : 'Без темы'}</p>
                <b>Описание:</b><p class='popup-description'>${inputDescribe.value ? inputDescribe.value : 'Без описания'}</p>`;

                overlay.appendChild(wrapper);
                wrapper.appendChild(textP);
                wrapper.appendChild(close);

                setTimeout(() => {
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.opacity = 1;
                }, 100);

                closeOverlay(overlay, inputName, inputEmail, inputSubject, inputDescribe, inputSubmit);
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
            if (document.documentElement.clientWidth > 768) {
                if (window.scrollY > 150) {
                    header.style.height = '50px';
                    header.style.position = 'sticky';
                    header.style.top = '0';
                    h1.style.marginTop = '4px';
                    navLinks.style.marginTop = '15px';
                    logo.style.fontSize = '1.8rem';
                    headerStub.style.height = '45px';
                } else {
                    header.style.height = '95px';
                    h1.style.marginTop = '25px';
                    navLinks.style.marginTop = '40px';
                    logo.style.fontSize = '2.6rem';
                    headerStub.style.height = '0';
                }
            } else if (document.documentElement.clientWidth <= 768) {
                
            }
        });
        window.addEventListener('resize', function (e) {
            if (document.documentElement.clientWidth < 768) {
                header.removeAttribute('style');
                logo.style.fontSize = '19.6875px';
                h1.style.marginTop = '15px';
            }else if(document.documentElement.clientWidth > 768) {
                if (window.scrollY > 150) {
                    header.style.height = '50px';
                    header.style.position = 'sticky';
                    header.style.top = '0';
                    h1.style.marginTop = '4px';
                    navLinks.style.marginTop = '15px';
                    logo.style.fontSize = '1.8rem';
                    headerStub.style.height = '45px';
                } else {
                    header.style.height = '95px';
                    h1.style.marginTop = '25px';
                    navLinks.style.marginTop = '40px';
                    logo.style.fontSize = '2.6rem';
                    headerStub.style.height = '0';
                }
            }
        });
    }

    function changeSlidePosition() {
        let slidesParent = document.querySelector('.item-img');

        slidesParent.addEventListener('click', function (e) {
            if (e.target.offsetParent.getAttribute('data-position') == '2' && e.target.className == 'slide__button-home') {
                e.target.offsetParent.children[1].classList.toggle('invisible');
            }

            if (e.target.offsetParent.className == 'img-phone' && e.target.offsetParent.tagName == 'DIV' && e.target.offsetParent.getAttribute('data-position') != '2') {
                let slides = document.querySelectorAll('[data-position]'),
                    activeTargetPosition = e.target.offsetParent.getAttribute('data-position'),
                    tooltip = document.querySelector('.tooltip');

                for (let i = 0; i < slides.length; i++) {
                    if (slides[i].classList.contains('img-phone_full-size')) {
                        slides[i].classList.remove('img-phone_full-size');
                        slides[i].children[2].removeAttribute('data-tooltip');
                        slides[i].setAttribute('data-position', activeTargetPosition);
                        slides[i].children[0].setAttribute('data-tooltip', 'click to change position');
                    }
                }

                if (tooltip) {
                    tooltip.remove();
                }

                e.target.offsetParent.setAttribute('data-position', '2');
                e.target.offsetParent.children[2].setAttribute('data-tooltip', 'click me');
                e.target.offsetParent.children[0].removeAttribute('data-tooltip');
                e.target.offsetParent.classList.add('img-phone_full-size');
            }
        });
    }

    function addInteractiveFor1Slide() {
        let wrapperForSlides = document.querySelector('.slider__item_centered'),
            mobileBtnHome = document.querySelectorAll('.slide__button-home');

        wrapperForSlides.addEventListener('click', function(e) {
            for(let i = 0; i < mobileBtnHome.length; i++) {
                if(e.target == mobileBtnHome[i]) {
                    e.target.previousElementSibling.classList.toggle('invisible');
                }
            }
        });
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
        }
        return array;
    }

    function removeTooltips() {
        if (document.documentElement.clientWidth <= 768) {
            let tooltips = document.querySelectorAll('[data-tooltip]');

            for (let i = 0; i < tooltips.length; i++) {
                if (i == tooltips.length - 1) {
                    break;
                }
                tooltips[i].removeAttribute('data-tooltip');
            }
        }
    }

    function getMobileMenu () {
        let burger = document.querySelector('.hamburger'),
            headerNavigation = document.querySelector('.header__navigation'),
            headerWrapper = document.querySelector('.header-wrapper'),
            activeMenu = document.querySelector('.navigation__links');


        burger.addEventListener('click', function(e) {
            flag = !flag;
            if(flag === true) {
                let overlay = document.createElement('div');
                let wrapper = document.createElement('div');
                this.classList.add('active');
                headerNavigation.classList.add('mobile-menu_active');
                overlay.classList.add('overlay', 'overlay-menu');
                headerWrapper.prepend(overlay);
                wrapper.classList.add('mobile-menu-wrapper');
                overlay.appendChild(wrapper);
    
                setTimeout(() => {
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.opacity = 1;
                    setTimeout(() => {
                        wrapper.classList.add('mobile-menu-wrapper_active');
                        let menuItems = headerNavigation.querySelectorAll('.navigation__link');
                        for (let i = 0; i < menuItems.length; i++) {
                            setTimeout(() => {
                                menuItems[i].style.left = 0;
                            }, i * 150);
                        }
                    }, 150);
                }, 100);
            }else {
                let overlay = document.querySelector('.overlay-menu');
                setTimeout(() => {
                    overlay.style.height = '0%';
                    overlay.style.opacity = 0;
                }, 100);
                setTimeout(() => {
                    overlay.remove();
                    overlay.style.width = '0%';
                }, 300);
                headerNavigation.classList.remove('mobile-menu_active');
                burger.classList.remove('active');

                let menuItems = headerNavigation.querySelectorAll('.navigation__link');
                for (let i = 0; i < menuItems.length; i++) {
                    menuItems[i].removeAttribute('style');
                }
            }

            closeOverlay(document.querySelector('.overlay-menu'));

        });

        window.addEventListener('resize', function (e) {
            let overlay = document.querySelector('.overlay-menu');
            if (overlay) {
                let burger = document.querySelector('.hamburger'),
                    headerNavigation = document.querySelector('.header__navigation');
                setTimeout(() => {
                    overlay.style.height = '0%';
                    overlay.style.opacity = 0;
                }, 100);
                setTimeout(() => {
                    overlay.remove();
                    overlay.style.width = '0%';
                }, 300);
                headerNavigation.classList.remove('mobile-menu_active');
                burger.classList.remove('active');

                let menuItems = headerNavigation.querySelectorAll('.navigation__link');
                for (let i = 0; i < menuItems.length; i++) {
                    menuItems[i].removeAttribute('style');
                }
                flag = false;
            }
        });

        activeMenu.addEventListener('click', function(e) {
            if (document.querySelector('.header__navigation.mobile-menu_active')) {
                if (e.target.offsetParent.classList.contains('navigation__link')) {
                    let overlay = document.querySelector('.overlay-menu');
                    if (overlay) {
                        let burger = document.querySelector('.hamburger'),
                            headerNavigation = document.querySelector('.header__navigation');
                        setTimeout(() => {
                            overlay.style.height = '0%';
                            overlay.style.opacity = 0;
                        }, 100);
                        setTimeout(() => {
                            overlay.remove();
                            overlay.style.width = '0%';
                        }, 300);
                        headerNavigation.classList.remove('mobile-menu_active');
                        burger.classList.remove('active');
    
                        let menuItems = headerNavigation.querySelectorAll('.navigation__link');
                        for (let i = 0; i < menuItems.length; i++) {
                            menuItems[i].removeAttribute('style');
                        }
                        flag = false;
                    }
                }

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
    changeSlidePosition();
    addInteractiveFor1Slide();
    removeTooltips();
    getMobileMenu();
}