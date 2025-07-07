'use strict';


// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }


// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}


// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}


// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}


// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    // Remove active class from all navigation links
    for (let j = 0; j < navigationLinks.length; j++) {
      navigationLinks[j].classList.remove("active");
    }

    // Remove active class from all pages
    for (let j = 0; j < pages.length; j++) {
      pages[j].classList.remove("active");
    }

    // Add active class to clicked navigation link
    this.classList.add("active");

    // Find and activate the corresponding page
    const pageName = this.innerHTML.toLowerCase();
    for (let j = 0; j < pages.length; j++) {
      if (pages[j].dataset.page === pageName) {
        pages[j].classList.add("active");
        break;
      }
    }

    // Scroll to top
    window.scrollTo(0, 0);

  });
}

// image modal variables
const imageModalContainer = document.querySelector("[data-image-modal]");
const imageModalCloseBtn = document.querySelector("[data-modal-close]");
const imageModalOverlay = document.querySelector("[data-overlay]");
const modalImage = document.querySelector("[data-modal-image]");
const projectItems = document.querySelectorAll(".project-item");

// image modal toggle function
const imageModalFunc = function () {
  if (imageModalContainer) {
    imageModalContainer.classList.toggle("active");
  }
}

// add click event to all project eye icons
for (let i = 0; i < projectItems.length; i++) {
  const eyeIcon = projectItems[i].querySelector(".project-item-icon-box");
  
  if (eyeIcon) {
    eyeIcon.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      const projectImg = this.parentElement.querySelector("img");
      if (projectImg && modalImage) {
        modalImage.src = projectImg.src;
        modalImage.alt = projectImg.alt;
        imageModalFunc();
      }
    });
  }
}

// add click event to image modal close button
if (imageModalCloseBtn) {
  imageModalCloseBtn.addEventListener("click", imageModalFunc);
}

// add click event to image modal overlay
if (imageModalOverlay) {
  imageModalOverlay.addEventListener("click", imageModalFunc);
}
