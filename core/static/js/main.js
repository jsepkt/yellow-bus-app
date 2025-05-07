// main.js

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Yellow Bus App Loaded");
  
    // Update footer year
    const yearEl = document.getElementById("currentYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
  
  // ==== Toast System ====
  window.showToast = function (message, type = "success") {
    const toastWrapper = document.getElementById("toastWrapper");
    const toast = document.createElement("div");
  
    toast.className = `toast align-items-center text-white bg-${type} border-0 show mb-2`;
    toast.role = "alert";
    toast.ariaLive = "assertive";
    toast.ariaAtomic = "true";
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
  
    toastWrapper.appendChild(toast);
  
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  };
  
  // ==== Loading Spinner System ====
  window.showLoader = function () {
    const loader = document.getElementById("globalLoader");
    if (loader) loader.classList.remove("d-none");
  };
  
  window.hideLoader = function () {
    const loader = document.getElementById("globalLoader");
    if (loader) loader.classList.add("d-none");
  };
  