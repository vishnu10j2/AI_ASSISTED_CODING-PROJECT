// Mobile sidebar toggle
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const toggleBtn = document.getElementById('sidebarToggle');

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });
}
if (overlay) {
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });
}

// Auto-dismiss alerts after 4 seconds
document.querySelectorAll('.alert-auto-dismiss').forEach(el => {
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.4s';
    setTimeout(() => el.remove(), 400);
  }, 4000);
});

// Confirm delete dialogs
document.querySelectorAll('[data-confirm]').forEach(el => {
  el.addEventListener('click', function (e) {
    if (!confirm(this.dataset.confirm || 'Are you sure?')) {
      e.preventDefault();
    }
  });
});
