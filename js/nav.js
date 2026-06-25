/**
 * nav.js — SnackHub shared navigation
 * Replaces the static "Login" link with a user-avatar dropdown when logged in.
 * Call initNav() after the DOM is ready.
 */
(function initNav() {
  const user = JSON.parse(localStorage.getItem('snackhub_user') || 'null');

  // Find the <li> that holds the login link (last nav-links item)
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  // Remove existing login <li>
  const loginLi = navLinks.querySelector('li:last-child');
  if (!loginLi) return;

  if (!user) {
    // Not logged in — keep the Login link as-is
    return;
  }

  // Build initials (e.g. "Hema Sakshi" → "HS")
  const name = user.name || user.email || 'User';
  const parts = name.trim().split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();

  // Replace login <li> with avatar dropdown
  loginLi.outerHTML = `
    <li class="nav-user" id="nav-user-menu">
      <button class="nav-avatar-btn" id="nav-avatar-btn" aria-haspopup="true" aria-expanded="false">
        <span class="nav-avatar-emoji">👤</span>
        <span class="nav-user-name">${parts[0]}</span>
        <svg class="nav-chevron" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
        </svg>
      </button>
      <div class="nav-dropdown" id="nav-dropdown" role="menu">
        <div class="nav-dropdown-header">
          <div class="nav-dropdown-avatar">${initials}</div>
          <div>
            <div class="nav-dropdown-name">${name}</div>
            <div class="nav-dropdown-email">${user.email || ''}</div>
          </div>
        </div>
        <div class="nav-dropdown-divider"></div>
        <a href="profile.html" class="nav-dropdown-item" role="menuitem">
          <span>👤</span> My Profile
        </a>
        <a href="my-orders.html" class="nav-dropdown-item" role="menuitem">
          <span>📦</span> My Orders
        </a>
        <a href="addresses.html" class="nav-dropdown-item" role="menuitem">
          <span>📍</span> Saved Addresses
        </a>
        <a href="wishlist.html" class="nav-dropdown-item" role="menuitem">
          <span>❤️</span> Wishlist
        </a>
        <a href="#" class="nav-dropdown-item" role="menuitem">
          <span>🔔 </span> Notification
        </a>
        <a href="#" class="nav-dropdown-item" role="menuitem">
          <span>🎁  </span> Coupons & Rewards
        </a>
        <a href="#" class="nav-dropdown-item" role="menuitem">
          <span>⚙️</span> Account Settings
        </a>
        <div class="nav-dropdown-divider"></div>
        <button class="nav-dropdown-item nav-dropdown-logout" onclick="navLogout()" role="menuitem">
          <span>🚪</span> Logout
        </button>
      </div>
    </li>`;

  // Toggle dropdown open/close
  const btn = document.getElementById('nav-avatar-btn');
  const dropdown = document.getElementById('nav-dropdown');

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Close on outside click
  document.addEventListener('click', function () {
    dropdown.classList.remove('open');
    btn.setAttribute('aria-expanded', false);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    }
  });
})();

function navLogout() {
  localStorage.removeItem('snackhub_user');
  localStorage.removeItem('token');
  // Show toast if available, then redirect
  if (typeof showToast === 'function') {
    showToast('Logged out successfully!');
    setTimeout(() => window.location.href = 'index.html', 800);
  } else {
    window.location.href = 'index.html';
  }
}
