(() => {
    "use strict";
    const modules_flsModules = {};
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                const headerElement = document.querySelector(headerItem);
                if (!headerElement.classList.contains("_header-scroll")) {
                    headerElement.style.cssText = `transition-duration: 0s;`;
                    headerElement.classList.add("_header-scroll");
                    headerItemHeight = headerElement.offsetHeight;
                    headerElement.classList.remove("_header-scroll");
                    setTimeout((() => {
                        headerElement.style.cssText = ``;
                    }), 0);
                } else headerItemHeight = headerElement.offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if (typeof SmoothScroll !== "undefined") (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            functions_FLS(`[gotoBlock]: Юхуу...їдемо до ${targetBlock}`);
        } else functions_FLS(`[gotoBlock]: Йой... Такого блоку немає на сторінці: ${targetBlock}`);
    };
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if (e.type === "click") {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    if (modules_flsModules.fullpage) {
                        const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fp-section]");
                        const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;
                        if (fullpageSectionId !== null) {
                            modules_flsModules.fullpage.switchingSection(fullpageSectionId);
                            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
                        }
                    } else gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if (e.type === "watcherCallback" && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if (targetElement.dataset.watch === "navigator") {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
    function headerScroll() {
        addWindowScrollEvent = true;
        const header = document.querySelector("header.header");
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        let scrollDirection = 0;
        let timer;
        document.addEventListener("windowScroll", (function(e) {
            const scrollTop = window.scrollY;
            clearTimeout(timer);
            if (scrollTop >= startPoint) {
                !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
                if (headerShow) {
                    if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    timer = setTimeout((() => {
                        !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    }), headerShowTimer);
                }
            } else {
                header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
                if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
            }
            scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
        }));
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function script_menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (e.target.closest(".icon-menu")) document.documentElement.classList.toggle("menu-open");
            if (e.target.closest(".menu") && document.documentElement.classList.contains("menu-open")) document.documentElement.classList.remove("menu-open");
        }));
    }
    script_menuInit();
    const calculatorConfigs = {
        tags: {
            min: 12,
            max: 12 * 12,
            step: 12,
            price_per_unit: 6
        },
        locations: {
            min: 1,
            max: 30,
            step: 1,
            price_per_unit: 89
        },
        smiirl: {
            facebook: 300,
            instagram: 400,
            tiktok: 500
        }
    };
    const tagRange = document.getElementById("tagRange");
    const locationRange = document.getElementById("locationRange");
    const facebookCheckbox = document.getElementById("facebookCheckbox");
    const tiktokCheckbox = document.getElementById("tiktokCheckbox");
    const instagramCheckbox = document.getElementById("instagramCheckbox");
    const tagCountElement = document.getElementById("tagCount");
    const locationCountElement = document.getElementById("locationCount");
    const paymentTagElement = document.getElementById("paymentTag");
    const paymentLocationElement = document.getElementById("paymentLocation");
    const totalPriceElement = document.getElementById("totalValue");
    function initSliders() {
        tagRange.min = calculatorConfigs.tags.min;
        tagRange.max = calculatorConfigs.tags.max;
        tagRange.step = calculatorConfigs.tags.step;
        tagRange.value = calculatorConfigs.tags.min;
        locationRange.min = calculatorConfigs.locations.min;
        locationRange.max = calculatorConfigs.locations.max;
        locationRange.step = calculatorConfigs.locations.step;
        locationRange.value = calculatorConfigs.locations.min;
    }
    initSliders();
    function updateSliderBackground(slider) {
        const value = slider.value;
        const percentage = (value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, #EA580C 0%, #EA580C ${percentage}%, #E1E1E1 ${percentage}%, #E1E1E1 100%)`;
    }
    function calculatePrice() {
        const tagCount = parseInt(tagRange.value, 10);
        const locationCount = parseInt(locationRange.value, 10);
        let totalPrice = 0;
        const tagPrice = tagCount * calculatorConfigs.tags.price_per_unit;
        const locationPrice = locationCount * calculatorConfigs.locations.price_per_unit;
        let smiirlPrice = 0;
        if (facebookCheckbox.checked) smiirlPrice += calculatorConfigs.smiirl.facebook;
        if (tiktokCheckbox.checked) smiirlPrice += calculatorConfigs.smiirl.tiktok;
        if (instagramCheckbox.checked) smiirlPrice += calculatorConfigs.smiirl.instagram;
        totalPrice = tagPrice + locationPrice + smiirlPrice;
        tagCountElement.textContent = tagCount;
        locationCountElement.textContent = locationCount;
        paymentTagElement.textContent = tagPrice;
        paymentLocationElement.textContent = locationPrice;
        totalPriceElement.textContent = `$${totalPrice}`;
    }
    [ tagRange, locationRange, facebookCheckbox, tiktokCheckbox, instagramCheckbox ].forEach((element => {
        element.addEventListener("input", (() => {
            calculatePrice();
            updateSliderBackground(element);
        }));
    }));
    calculatePrice();
    document.getElementById("contactForm").addEventListener("submit", (async function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        try {
            const response = await fetch("/foo/bar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            if (response.ok) console.log("Form submitted successfully!"); else console.log("Error submitting the form.");
        } catch (error) {
            console.error("Error:", error);
            console.log("Failed to send form.");
        }
    }));
    window["FLS"] = true;
    pageNavigation();
    headerScroll();
})();