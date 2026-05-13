// ── CLOCK ──
function clock() {
  const n = new Date();
  const h = n.getHours().toString().padStart(2, '0');
  const m = n.getMinutes().toString().padStart(2, '0');
  const el = document.getElementById('utilTime');
  if (el) el.innerHTML = `<i class="far fa-clock" style="color:var(--gold)"></i>${h}:${m}`;
}
clock();
setInterval(clock, 30000);
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('yr');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ── DARK MODE ──
const dmToggle = document.getElementById('dmToggle');
const dmIcon = document.getElementById('dmIcon');
function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  if (dmIcon) dmIcon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('mut-theme', dark ? 'dark' : 'light');
}
const savedTheme = localStorage.getItem('mut-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
applyTheme(savedTheme === 'dark' || (savedTheme === null && prefersDark));
if (dmToggle) dmToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current !== 'dark');
});

// ── NAVBAR SCROLL ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── HAMBURGER ──
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileMenu');
if (ham && mob) {
  ham.addEventListener('click', () => {
    const open = mob.classList.toggle('open');
    ham.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mob.classList.remove('open');
    ham.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.style.overflow = '';
  }));
}

// ── STAT COUNTERS ──
const counters = document.querySelectorAll('.stat-num[data-target]');
const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.classList.contains('done')) {
      e.target.classList.add('done');
      const target = +e.target.dataset.target;
      let cur = 0;
      const step = target / 60;
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) {
          e.target.textContent = target + '%';
          if (target > 20 || target === 3 || target === 5) e.target.textContent = target + '+';
          clearInterval(t);
        } else {
          e.target.textContent = Math.floor(cur);
        }
      }, 16);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => cObs.observe(c));

// ── REVEAL ON SCROLL ──
const reveals = document.querySelectorAll('.reveal');
const rObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); rObs.unobserve(e.target); } });
}, { threshold: 0.1 });
reveals.forEach(r => rObs.observe(r));

// ── CAROUSEL ──
const carData = [
  { img: 'https://i.postimg.cc/vTH4mMH5/Network.jpg', t: 'Networking Lab', d: 'Hands-on enterprise networking experience' },
  { img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80', t: 'Programming Sessions', d: 'Learn modern languages and frameworks' },
  { img: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=600&q=80', t: 'Collaborative Learning', d: 'Work together on real-world projects' },
  { img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80', t: 'Industry Events', d: 'Connect with tech industry leaders' },
  { img: 'https://i.postimg.cc/2jc6xs5j/sd.jpg', t: 'Software Development', d: 'Build innovative applications and solutions' },
];
const track = document.getElementById('ctrack');
if (track) {
  [...carData, ...carData].forEach(item => {
    const d = document.createElement('div');
    d.className = 'car-item';
    d.innerHTML = `<img src="${item.img}" alt="${item.t}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=600&q=80'">
    <div class="car-overlay"><h3>${item.t}</h3><p>${item.d}</p></div>`;
    track.appendChild(d);
  });
}

// ── TOUR DATETIME ──
function setTourMin() {
  const el = document.getElementById('tourDateTime');
  if (!el) return;
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  const pad = n => String(n).padStart(2, '0');
  el.min = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T09:00`;
  el.value = el.min;
}
setTourMin();

// ── MODALS ──
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
window.addEventListener('click', e => {
  if (e.target.classList?.contains('modal')) closeModal(e.target.id);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'), document.body.style.overflow = '');
});

// ═══════════════════════════════════════════════════════════════
// ══════════════════ BOOKINGS & MESSAGES STORAGE ════════════════
// ═══════════════════════════════════════════════════════════════

function getStudentBookings() {
  if (!currentStudent) return [];
  const bookings = localStorage.getItem(`bookings_${currentStudent.student_number}`);
  return bookings ? JSON.parse(bookings) : [];
}

function saveBooking(bookingData) {
  if (!currentStudent) return false;
  const bookings = getStudentBookings();
  const newBooking = {
    id: Date.now(),
    ...bookingData,
    booking_date: new Date().toISOString(),
    status: 'pending'
  };
  bookings.push(newBooking);
  localStorage.setItem(`bookings_${currentStudent.student_number}`, JSON.stringify(bookings));
  return true;
}

function deleteBooking(bookingId) {
  if (!currentStudent) return false;
  let bookings = getStudentBookings();
  bookings = bookings.filter(b => b.id != bookingId);
  localStorage.setItem(`bookings_${currentStudent.student_number}`, JSON.stringify(bookings));
  return true;
}

function getStudentMessages() {
  if (!currentStudent) return [];
  const messages = localStorage.getItem(`messages_${currentStudent.student_number}`);
  return messages ? JSON.parse(messages) : [];
}

function saveMessage(messageData) {
  if (!currentStudent) return false;
  const messages = getStudentMessages();
  const newMessage = {
    id: Date.now(),
    ...messageData,
    sent_date: new Date().toISOString(),
    read: false
  };
  messages.push(newMessage);
  localStorage.setItem(`messages_${currentStudent.student_number}`, JSON.stringify(messages));
  return true;
}

function markMessageAsRead(messageId) {
  if (!currentStudent) return false;
  const messages = getStudentMessages();
  const index = messages.findIndex(m => m.id == messageId);
  if (index !== -1) {
    messages[index].read = true;
    localStorage.setItem(`messages_${currentStudent.student_number}`, JSON.stringify(messages));
    return true;
  }
  return false;
}

function deleteMessage(messageId) {
  if (!currentStudent) return false;
  let messages = getStudentMessages();
  messages = messages.filter(m => m.id != messageId);
  localStorage.setItem(`messages_${currentStudent.student_number}`, JSON.stringify(messages));
  return true;
}

// ═══════════════════════════════════════════════════════════════
// ══════════════════ PROFILE WITH IMAGE PROCESSING ═══════════════
// ═══════════════════════════════════════════════════════════════

function getStoredProfileImage() {
  if (!currentStudent) return null;
  const stored = localStorage.getItem(`profile_img_${currentStudent.student_number}`);
  if (stored && stored.startsWith('data:image')) {
    return stored;
  }
  return null;
}

function updateNavProfileImage(imageUrl) {
  const profileImg = document.querySelector('.profile-avatar-img-nav');
  if (profileImg) {
    if (imageUrl && imageUrl.startsWith('data:image')) {
      profileImg.src = imageUrl;
      profileImg.style.display = 'inline-block';
      const profileIcon = document.querySelector('.profile-section .fa-user-circle');
      if (profileIcon) profileIcon.style.display = 'none';
    }
  }
}

function cropToSquare(file, size = 200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        const minDimension = Math.min(img.width, img.height);
        const offsetX = (img.width - minDimension) / 2;
        const offsetY = (img.height - minDimension) / 2;
        
        ctx.drawImage(img, offsetX, offsetY, minDimension, minDimension, 0, 0, size, size);
        
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
        ctx.strokeStyle = '#C9A84C';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(dataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

function showProfileModal() {
  if (!currentStudent) {
    openModal('loginModal');
    return;
  }
  
  let profileModal = document.getElementById('profileModal');
  if (!profileModal) {
    profileModal = document.createElement('div');
    profileModal.id = 'profileModal';
    profileModal.className = 'modal';
    profileModal.innerHTML = `
      <div class="modal-box" style="max-width: 500px;">
        <div class="modal-head">
          <h2><i class="fas fa-user-circle"></i> My Profile</h2>
          <button class="modal-close" onclick="closeModal('profileModal')">&times;</button>
        </div>
        <div class="modal-body" id="profileModalBody"></div>
      </div>
    `;
    document.body.appendChild(profileModal);
  }
  
  loadProfileContent();
  openModal('profileModal');
}

function loadProfileContent() {
  const container = document.getElementById('profileModalBody');
  if (!container || !currentStudent) return;
  
  const profileImage = getStoredProfileImage() || 'https://ui-avatars.com/api/?background=7B1C2E&color=fff&rounded=true&size=120&bold=true&name=' + encodeURIComponent(currentStudent.first_name + '+' + currentStudent.last_name);
  
  container.innerHTML = `
    <style>
      .profile-avatar { text-align: center; margin-bottom: 1.5rem; }
      .profile-avatar-img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--gold); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
      .profile-upload-btn { margin-top: 0.75rem; display: inline-flex; align-items: center; gap: 0.5rem; background: var(--off); border: 1px solid var(--border); padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; }
      .profile-upload-btn:hover { background: var(--navy); color: var(--white); border-color: var(--navy); }
      .profile-info { background: var(--off); border-radius: 12px; padding: 1rem; margin-bottom: 1rem; }
      .profile-info-item { display: flex; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid var(--border); }
      .profile-info-item:last-child { border-bottom: none; }
      .profile-info-label { font-weight: 600; color: var(--navy); }
      .profile-info-value { color: var(--text); }
      .profile-edit-btn { width: 100%; margin-top: 0.5rem; margin-bottom: 0.5rem; }
      .save-success { background: #d4edda; color: #155724; padding: 8px; border-radius: 8px; margin-top: 10px; text-align: center; font-size: 0.8rem; }
      .profile-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
      .profile-tab { padding: 0.5rem 1rem; cursor: pointer; border-radius: 8px 8px 0 0; transition: all 0.2s; font-size: 0.85rem; font-weight: 500; }
      .profile-tab:hover { background: var(--off); }
      .profile-tab.active { background: var(--gold); color: var(--navy); }
      .tab-content { display: none; }
      .tab-content.active { display: block; }
      .booking-item, .message-item { background: var(--off); border-radius: 12px; padding: 1rem; margin-bottom: 0.75rem; border-left: 4px solid var(--gold); }
      .booking-status { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
      .status-pending { background: #ffc107; color: #000; }
      .status-confirmed { background: #28a745; color: #fff; }
      .status-cancelled { background: #dc3545; color: #fff; }
      .delete-btn { background: none; border: none; color: #dc3545; cursor: pointer; font-size: 0.8rem; margin-left: 0.5rem; }
      .delete-btn:hover { color: #bd2130; }
      .message-unread { background: rgba(201,168,76,0.1); border-left-color: var(--gold); }
      .empty-state { text-align: center; padding: 2rem; color: var(--muted); }
    </style>
    
    <div class="profile-avatar">
      <img src="${profileImage}" alt="Profile" class="profile-avatar-img" id="profileAvatarPreview">
      <div>
        <label class="profile-upload-btn">
          <i class="fas fa-camera"></i> Change Photo
          <input type="file" id="profileImageUpload" accept="image/jpeg,image/png,image/jpg" style="display: none;">
        </label>
      </div>
    </div>
    
    <div class="profile-tabs">
      <div class="profile-tab active" data-tab="info">📋 My Info</div>
      <div class="profile-tab" data-tab="bookings">📅 My Bookings <span id="bookingCount" style="background:var(--gold);color:var(--navy);padding:0 6px;border-radius:10px;margin-left:5px;font-size:0.7rem;">0</span></div>
      <div class="profile-tab" data-tab="messages">💬 My Messages <span id="messageCount" style="background:var(--gold);color:var(--navy);padding:0 6px;border-radius:10px;margin-left:5px;font-size:0.7rem;">0</span></div>
    </div>
    
    <div id="tabInfo" class="tab-content active">
      <div class="profile-info">
        <div class="profile-info-item">
          <span class="profile-info-label"><i class="fas fa-user"></i> Full Name</span>
          <span class="profile-info-value">${escapeHtml(currentStudent.first_name)} ${escapeHtml(currentStudent.last_name)}</span>
        </div>
        <div class="profile-info-item">
          <span class="profile-info-label"><i class="fas fa-id-card"></i> Student Number</span>
          <span class="profile-info-value">${escapeHtml(currentStudent.student_number)}</span>
        </div>
        <div class="profile-info-item">
          <span class="profile-info-label"><i class="fas fa-envelope"></i> Email</span>
          <span class="profile-info-value">${escapeHtml(currentStudent.email)}</span>
        </div>
        <div class="profile-info-item">
          <span class="profile-info-label"><i class="fas fa-phone"></i> Phone</span>
          <span class="profile-info-value">${currentStudent.phone ? escapeHtml(currentStudent.phone) : 'Not provided'}</span>
        </div>
        <div class="profile-info-item">
          <span class="profile-info-label"><i class="fas fa-graduation-cap"></i> Course</span>
          <span class="profile-info-value">${escapeHtml(currentStudent.course || 'Diploma in ICT')}</span>
        </div>
        <div class="profile-info-item">
          <span class="profile-info-label"><i class="fas fa-calendar"></i> Year Level</span>
          <span class="profile-info-value">Year ${currentStudent.year_level || '1'}</span>
        </div>
      </div>
      <button class="btn btn-outline-navy profile-edit-btn" onclick="editProfileInfo()">
        <i class="fas fa-edit"></i> Edit Profile Info
      </button>
    </div>
    
    <div id="tabBookings" class="tab-content">
      <div id="bookingsList"></div>
    </div>
    
    <div id="tabMessages" class="tab-content">
      <div id="messagesList"></div>
    </div>
  `;
  
  document.querySelectorAll('.profile-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).classList.add('active');
      
      if (tabName === 'bookings') loadBookingsList();
      if (tabName === 'messages') loadMessagesList();
    });
  });
  
  updateBookingCount();
  updateMessageCount();
  loadBookingsList();
  loadMessagesList();
  
  const fileInput = document.getElementById('profileImageUpload');
  if (fileInput) {
    fileInput.addEventListener('change', handleProfileImageUpload);
  }
}

function updateBookingCount() {
  const bookings = getStudentBookings();
  const countSpan = document.getElementById('bookingCount');
  if (countSpan) countSpan.textContent = bookings.length;
}

function updateMessageCount() {
  const messages = getStudentMessages();
  const unreadCount = messages.filter(m => !m.read).length;
  const countSpan = document.getElementById('messageCount');
  if (countSpan) countSpan.textContent = unreadCount > 0 ? `${unreadCount} new` : messages.length;
}

function loadBookingsList() {
  const container = document.getElementById('bookingsList');
  if (!container) return;
  
  const bookings = getStudentBookings();
  
  if (bookings.length === 0) {
    container.innerHTML = `<div class="empty-state">
      <i class="fas fa-calendar-alt" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
      <p>No bookings yet</p>
      <button class="btn btn-gold" style="margin-top: 0.5rem; padding: 0.3rem 1rem; font-size: 0.8rem;" onclick="closeModal('profileModal'); openModal('tourModal')">Book a Campus Tour</button>
    </div>`;
    return;
  }
  
  container.innerHTML = bookings.reverse().map(booking => `
    <div class="booking-item">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div>
          <strong><i class="fas fa-calendar-day"></i> ${new Date(booking.tour_date).toLocaleDateString()}</strong>
          <span style="margin-left: 0.5rem;">at ${new Date(booking.tour_date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
        </div>
        <div>
          <span class="booking-status status-${booking.status}">${booking.status}</span>
          <button class="delete-btn" onclick="deleteBookingItem(${booking.id})" title="Cancel Booking"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div style="font-size: 0.8rem; margin-top: 0.5rem; color: var(--muted);">
        <i class="fas fa-users"></i> ${booking.visitors} visitor(s)
      </div>
      ${booking.special_requests ? `<div style="font-size: 0.75rem; margin-top: 0.3rem; color: var(--muted);"><i class="fas fa-comment"></i> ${escapeHtml(booking.special_requests.substring(0, 100))}</div>` : ''}
      <div style="font-size: 0.7rem; margin-top: 0.5rem; color: var(--muted);">
        Booked on: ${new Date(booking.booking_date).toLocaleDateString()}
      </div>
    </div>
  `).join('');
}

function loadMessagesList() {
  const container = document.getElementById('messagesList');
  if (!container) return;
  
  const messages = getStudentMessages();
  
  if (messages.length === 0) {
    container.innerHTML = `<div class="empty-state">
      <i class="fas fa-envelope" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
      <p>No messages yet</p>
      <button class="btn btn-gold" style="margin-top: 0.5rem; padding: 0.3rem 1rem; font-size: 0.8rem;" onclick="closeModal('profileModal'); openModal('contactModal')">Send a Message</button>
    </div>`;
    return;
  }
  
  container.innerHTML = messages.reverse().map(msg => `
    <div class="message-item ${!msg.read ? 'message-unread' : ''}" onclick="markMessageRead(${msg.id})">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div>
          <strong>${escapeHtml(msg.subject)}</strong>
          ${!msg.read ? '<span style="background:var(--gold);color:var(--navy);padding:0 6px;border-radius:10px;font-size:0.65rem;margin-left:0.5rem;">NEW</span>' : ''}
        </div>
        <button class="delete-btn" onclick="event.stopPropagation(); deleteMessageItem(${msg.id})" title="Delete Message"><i class="fas fa-trash"></i></button>
      </div>
      <div style="font-size: 0.8rem; margin-top: 0.3rem; color: var(--text);">${escapeHtml(msg.message.substring(0, 150))}${msg.message.length > 150 ? '...' : ''}</div>
      <div style="font-size: 0.7rem; margin-top: 0.5rem; color: var(--muted);">
        Sent: ${new Date(msg.sent_date).toLocaleString()}
      </div>
    </div>
  `).join('');
}

function markMessageRead(messageId) {
  markMessageAsRead(messageId);
  updateMessageCount();
  loadMessagesList();
}

function deleteBookingItem(bookingId) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    deleteBooking(bookingId);
    updateBookingCount();
    loadBookingsList();
  }
}

function deleteMessageItem(messageId) {
  if (confirm('Are you sure you want to delete this message?')) {
    deleteMessage(messageId);
    updateMessageCount();
    loadMessagesList();
  }
}

async function handleProfileImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file (JPEG, PNG, or JPG)');
    return;
  }
  
  if (file.size > 2 * 1024 * 1024) {
    alert('Image too large! Maximum size is 2MB.');
    return;
  }
  
  const preview = document.getElementById('profileAvatarPreview');
  preview.style.opacity = '0.5';
  
  try {
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'save-success';
    loadingMsg.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing image...';
    document.querySelector('#profileModalBody .profile-avatar').appendChild(loadingMsg);
    
    const processedImage = await cropToSquare(file, 200);
    
    localStorage.setItem(`profile_img_${currentStudent.student_number}`, processedImage);
    localStorage.setItem(`profile_img_${currentStudent.id}`, processedImage);
    
    preview.src = processedImage;
    preview.style.opacity = '1';
    
    // Update navigation bar image
    updateNavProfileImage(processedImage);
    
    loadingMsg.remove();
    
    const successMsg = document.createElement('div');
    successMsg.className = 'save-success';
    successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Profile picture updated successfully!';
    document.querySelector('#profileModalBody .profile-avatar').appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 3000);
    
  } catch (error) {
    console.error('Image processing error:', error);
    alert('Failed to process image. Please try another image.');
    preview.style.opacity = '1';
  }
}

function editProfileInfo() {
  if (!currentStudent) return;
  
  const container = document.getElementById('profileModalBody');
  if (!container) return;
  
  container.innerHTML = `
    <style>
      .profile-edit-form .form-group { margin-bottom: 1rem; }
      .form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
    </style>
    
    <h3 style="margin-bottom: 1rem;"><i class="fas fa-edit"></i> Edit Profile</h3>
    
    <form id="profileEditForm" class="profile-edit-form">
      <div class="form-group">
        <label>First Name</label>
        <input type="text" class="form-control" id="editFirstName" value="${escapeHtml(currentStudent.first_name)}" required>
      </div>
      <div class="form-group">
        <label>Last Name</label>
        <input type="text" class="form-control" id="editLastName" value="${escapeHtml(currentStudent.last_name)}" required>
      </div>
      <div class="form-group">
        <label>Phone Number (10 digits)</label>
        <input type="tel" class="form-control" id="editPhone" value="${currentStudent.phone || ''}" placeholder="0712345678" required>
      </div>
      <div class="form-group">
        <label>Course</label>
        <select class="form-control" id="editCourse">
          <option value="Diploma in ICT" ${currentStudent.course === 'Diploma in ICT' ? 'selected' : ''}>Diploma in ICT (3 years)</option>
          <option value="Extended Curriculum Programme" ${currentStudent.course === 'Extended Curriculum Programme' ? 'selected' : ''}>Extended Curriculum Programme (4 years)</option>
          <option value="Advanced Diploma in ICT" ${currentStudent.course === 'Advanced Diploma in ICT' ? 'selected' : ''}>Advanced Diploma in ICT (1 year)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Year Level</label>
        <select class="form-control" id="editYearLevel">
          <option value="0" ${currentStudent.year_level == 0 ? 'selected' : ''}>Foundation Year</option>
          <option value="1" ${currentStudent.year_level == 1 ? 'selected' : ''}>Year 1</option>
          <option value="2" ${currentStudent.year_level == 2 ? 'selected' : ''}>Year 2</option>
          <option value="3" ${currentStudent.year_level == 3 ? 'selected' : ''}>Year 3</option>
          <option value="4" ${currentStudent.year_level == 4 ? 'selected' : ''}>Year 4</option>
        </select>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn btn-gold"><i class="fas fa-save"></i> Save Changes</button>
        <button type="button" class="btn btn-outline-navy" onclick="loadProfileContent()">Cancel</button>
      </div>
    </form>
  `;
  
  const editForm = document.getElementById('profileEditForm');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const newFirstName = document.getElementById('editFirstName').value.trim();
      const newLastName = document.getElementById('editLastName').value.trim();
      const newPhone = document.getElementById('editPhone').value.trim();
      const newCourse = document.getElementById('editCourse').value;
      const newYearLevel = document.getElementById('editYearLevel').value;
      
      if (!newFirstName || !newLastName) {
        alert('First name and last name are required');
        return;
      }
      
      if (newPhone && !/^\d{10}$/.test(newPhone)) {
        alert('Phone number must be exactly 10 digits');
        return;
      }
      
      currentStudent.first_name = newFirstName;
      currentStudent.last_name = newLastName;
      currentStudent.phone = newPhone;
      currentStudent.course = newCourse;
      currentStudent.year_level = parseInt(newYearLevel);
      
      localStorage.setItem('currentStudent', JSON.stringify(currentStudent));
      
      const profileNameSpan = document.querySelector('.profile-name');
      if (profileNameSpan) profileNameSpan.textContent = newFirstName;
      
      loadProfileContent();
      alert('Profile updated successfully!');
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// ══════════════════ SMART SEARCH WITH DEEP LINKS ═══════════════
// ═══════════════════════════════════════════════════════════════

const SEARCH_INDEX = [
  { title: "Diploma in ICT", description: "3 year programme, NQF Level 6. Covers programming, databases, web development.", type: "programme", url: "courses.html#programmes", section: "programmes", keywords: ["diploma", "3 year", "programming", "database", "web", "nqf6"] },
  { title: "Extended Curriculum Programme", description: "4 year programme with foundation year. Extra academic support.", type: "programme", url: "courses.html#programmes", section: "programmes", keywords: ["extended", "foundation", "4 year", "ecp"] },
  { title: "Advanced Diploma in ICT", description: "1 year postgraduate programme, NQF Level 7.", type: "programme", url: "courses.html#programmes", section: "programmes", keywords: ["advanced", "postgraduate", "1 year", "nqf7"] },
  { title: "Software Development", description: "Master Python, Java, JavaScript. Full-stack development.", type: "specialization", url: "courses.html#specializations", section: "specializations", keywords: ["software", "coding", "programming", "python", "java"] },
  { title: "Networking Specialization", description: "Cisco equipment, routing, switching, network security.", type: "specialization", url: "courses.html#specializations", section: "specializations", keywords: ["networking", "cisco", "routing", "security"] },
  { title: "Admission Requirements", description: "Maths 50% or Math Lit 60%, English 50% for Diploma.", type: "admission", url: "admissions.html", section: "admissions", keywords: ["requirements", "maths", "english", "matric"] },
  { title: "Tuition Fees", description: "Diploma ~R45k/year, Extended ~R40k/year, Advanced ~R55k/year", type: "fee", url: "admissions.html", section: "admissions", keywords: ["fees", "cost", "tuition", "price"] },
  { title: "NSFAS Funding", description: "Financial aid for eligible students. Apply at nsfas.org.za", type: "fee", url: "admissions.html", section: "admissions", keywords: ["nsfas", "funding", "bursary"] },
  { title: "Contact ICT Department", description: "ict@mut.ac.za | +27 31 123 4567 | Building 10, Umlazi", type: "contact", url: "contact.html", section: "contact", keywords: ["email", "phone", "address"] },
  { title: "Campus Facilities", description: "Programming labs, networking labs, 24/7 access, high-speed internet", type: "facility", url: "courses.html#facilities", section: "facilities", keywords: ["lab", "computer", "wifi", "internet"] },
  { title: "Career Opportunities", description: "Software Engineer, Network Engineer, Cybersecurity Analyst", type: "career", url: "courses.html#specializations", section: "specializations", keywords: ["job", "career", "employment", "salary"] },
  { title: "Campus Tours", description: "Schedule a guided tour. Monday-Friday 09:00-15:00", type: "tour", url: "contact.html", section: "contact", keywords: ["tour", "visit", "campus"] }
];

function navigateToSection(url, sectionId) {
  closeModal('globalSearchModal');
  const [baseUrl, anchor] = url.split('#');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const targetPage = baseUrl.split('/').pop() || 'index.html';
  
  if (currentPage === targetPage) {
    const element = document.getElementById(anchor) || document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.style.transition = 'background 0.3s';
      element.style.background = 'rgba(201,168,76,0.2)';
      setTimeout(() => { element.style.background = ''; }, 2000);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else {
    sessionStorage.setItem('scrollToSection', anchor || sectionId);
    window.location.href = url;
  }
}

if (sessionStorage.getItem('scrollToSection')) {
  const sectionId = sessionStorage.getItem('scrollToSection');
  sessionStorage.removeItem('scrollToSection');
  setTimeout(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.style.background = 'rgba(201,168,76,0.2)';
      setTimeout(() => { if (element) element.style.background = ''; }, 2000);
    }
  }, 500);
}

function smartSearch(query) {
  if (!query || query.length < 2) return [];
  const searchTerm = query.toLowerCase().trim();
  const searchWords = searchTerm.split(/\s+/);
  
  return SEARCH_INDEX.map(item => {
    let score = 0;
    const searchableText = `${item.title} ${item.description} ${item.keywords.join(' ')}`.toLowerCase();
    if (searchableText.includes(searchTerm)) score += 10;
    for (const word of searchWords) {
      if (word.length < 2) continue;
      if (item.title.toLowerCase().includes(word)) score += 5;
      if (item.keywords.some(k => k.includes(word))) score += 3;
      if (item.description.toLowerCase().includes(word)) score += 1;
    }
    return { ...item, score };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 10);
}

async function performSmartSearch(query) {
  if (!query || query.length < 2) {
    const container = document.getElementById('globalSearchResults');
    if (container) {
      container.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--muted);">
        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>Type at least 2 characters to search</p>
        <p style="font-size: 0.8rem;">🔍 Try: "diploma", "fees", "admission", "NSFAS"</p>
      </div>`;
    }
    return [];
  }
  
  const results = smartSearch(query);
  const container = document.getElementById('globalSearchResults');
  
  if (container) {
    if (results.length === 0) {
      container.innerHTML = `<div style="padding: 2rem; text-align: center;"><p>No results for "<strong>${escapeHtml(query)}</strong>"</p></div>`;
    } else {
      container.innerHTML = results.map(result => `
        <a href="javascript:void(0)" class="gs-result-item" style="display: flex; align-items: center; gap: 1rem; padding: 0.9rem 1.5rem; border-bottom: 1px solid var(--border); cursor: pointer;" onclick="navigateToSection('${result.url}', '${result.section}')">
          <div style="width: 40px; height: 40px; border-radius: 10px; background: var(--off); display: flex; align-items: center; justify-content: center;">
            <i class="fas fa-${getIconForType(result.type)}" style="color: var(--navy); font-size: 1rem;"></i>
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 0.9rem; color: var(--navy);">${escapeHtml(result.title)}</div>
            <div style="font-size: 0.78rem; color: var(--muted);">${escapeHtml(result.description.substring(0, 80))}...</div>
            <div style="font-size: 0.7rem; color: var(--gold2); margin-top: 0.2rem;">${result.type} • Click to go →</div>
          </div>
          <i class="fas fa-chevron-right" style="color: var(--gold);"></i>
        </a>
      `).join('');
    }
  }
  return results;
}

function getIconForType(type) {
  const icons = { programme: 'graduation-cap', admission: 'file-alt', contact: 'envelope', about: 'info-circle', facility: 'desktop', career: 'briefcase', fee: 'money-bill-wave', specialization: 'code', tour: 'calendar' };
  return icons[type] || 'file-alt';
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function initSearchPage() {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  if (!searchForm || !searchInput || !searchResults) return;
  
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query.length < 2) {
      searchResults.innerHTML = '<p style="text-align:center;padding:2rem;">Enter at least 2 characters</p>';
      return;
    }
    const results = smartSearch(query);
    if (results.length === 0) {
      searchResults.innerHTML = `<p style="text-align:center;padding:2rem;">No results for "${escapeHtml(query)}"</p>`;
    } else {
      searchResults.innerHTML = results.map(result => `
        <div class="result-item" style="background:var(--card);border:1px solid var(--border);border-radius:16px;padding:1.5rem;margin-bottom:1rem;">
          <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem;">
            <div style="width:36px;height:36px;border-radius:10px;background:var(--off);display:flex;align-items:center;justify-content:center;">
              <i class="fas fa-${getIconForType(result.type)}" style="color:var(--navy);"></i>
            </div>
            <span style="background:var(--off);padding:0.2rem 0.6rem;border-radius:20px;font-size:0.7rem;">${result.type}</span>
          </div>
          <h3 style="margin-bottom:0.5rem;">${escapeHtml(result.title)}</h3>
          <p style="color:var(--muted);margin-bottom:1rem;">${escapeHtml(result.description)}</p>
          <button onclick="navigateToSection('${result.url}', '${result.section}')" class="btn btn-gold" style="padding:0.5rem 1.2rem;font-size:0.8rem;">View Details →</button>
        </div>
      `).join('');
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// ══════════════════ CHATBOT PERSONA SYSTEM ═════════════════════
// ═══════════════════════════════════════════════════════════════

const CHATBOT_PERSONA = {
  name: "MUT ICT Assistant",
  greeting: "👋 Hi! I'm the **MUT ICT Department Assistant**. Ask me about programmes, admissions, fees, or how to apply! 🎓💻"
};

const KNOWLEDGE_BASE = {
  greetings: { keywords: ["hello", "hi", "hey"], response: "Hello! 👋 How can I help you today?" },
  programmes: { keywords: ["programme", "courses", "diploma", "extended", "advanced"], response: "📚 We offer: Diploma (3 years), Extended (4 years), Advanced Diploma (1 year). Use search for details!" },
  admissions: { keywords: ["admission", "requirements", "matric", "maths"], response: "📋 Diploma: Maths 50% or Math Lit 60%, English 50%. Extended: Maths 40% or Math Lit 50%, English 40%." },
  application: { keywords: ["apply", "cao"], response: "📝 Apply via CAO at cao.ac.za. Deadline: 30 September." },
  fees: { keywords: ["fee", "cost", "nsfas"], response: "💰 Fees: Diploma ~R45k/yr, Extended ~R40k/yr, Advanced ~R55k/yr. NSFAS available." },
  contact: { keywords: ["contact", "email", "phone"], response: "📞 Email: ict@mut.ac.za | Phone: +27 31 123 4567" }
};

function generateBotResponse(userMessage) {
  const message = userMessage.toLowerCase();
  for (const cat of Object.values(KNOWLEDGE_BASE)) {
    if (cat.keywords?.some(k => message.includes(k))) {
      return { answer: cat.response, suggestions: ["Tell me more", "Search for details"] };
    }
  }
  return { answer: CHATBOT_PERSONA.greeting, suggestions: ["What programmes?", "Admission requirements", "Fees"] };
}

// ═══════════════════════════════════════════════════════════════
// ══════════════════ BACKEND API CONNECTION ═════════════════════
// ═══════════════════════════════════════════════════════════════

const API_BASE_URL = 'http://localhost:3001/api';
let backendAvailable = false;

async function checkBackend() {
  try {
    const response = await fetch(`${API_BASE_URL}/hello`);
    const data = await response.json();
    console.log('✅ Backend connected:', data);
    backendAvailable = true;
    return true;
  } catch (error) {
    console.warn('⚠️ Backend not running. Using local mode.');
    backendAvailable = false;
    return false;
  }
}

async function apiSearch(query) { return smartSearch(query); }

// Calls the real Gemini AI backend. Falls back to local responses if backend is unavailable.
async function apiChat(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!response.ok) throw new Error('Backend error');
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('⚠️ Backend chat unavailable, using local fallback:', error.message);
    return generateBotResponse(message);
  }
}

// ============= VALIDATION FUNCTIONS =============
function validateStudentNumber(n) { return /^\d{8}$/.test(n); }
function validateEmail(email, sn) { return email === `${sn}@live.mut.ac.za`; }
function validatePhoneNumber(p) { return /^\d{10}$/.test(p); }
function validatePassword(p) { return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(p); }

function updateYearLevelOptions() {
  const courseSelect = document.getElementById('regCourse');
  const yearLevelSelect = document.getElementById('regYearLevel');
  if (!courseSelect || !yearLevelSelect) return;
  const selectedCourse = courseSelect.value;
  yearLevelSelect.innerHTML = '';
  if (selectedCourse === 'Diploma in ICT') yearLevelSelect.innerHTML = `<option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option>`;
  else if (selectedCourse === 'Extended Curriculum Programme') yearLevelSelect.innerHTML = `<option value="0">Foundation Year</option><option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option>`;
  else if (selectedCourse === 'Advanced Diploma in ICT') yearLevelSelect.innerHTML = `<option value="4">Year 4</option>`;
}

function setupAutoEmail() {
  const studentNumberInput = document.getElementById('regStudentNumber');
  const emailInput = document.getElementById('regEmail');
  if (studentNumberInput && emailInput) {
    studentNumberInput.addEventListener('input', function() {
      const sn = this.value.trim();
      if (sn.length === 8 && /^\d+$/.test(sn)) {
        emailInput.value = `${sn}@live.mut.ac.za`;
        emailInput.readOnly = true;
        emailInput.style.backgroundColor = '#f0f0f0';
      } else {
        emailInput.value = '';
        emailInput.readOnly = false;
        emailInput.style.backgroundColor = '';
      }
    });
  }
}

// ============= STUDENT REGISTRATION & LOGIN =============
let currentStudent = null;

function checkLoggedIn() {
  const saved = localStorage.getItem('currentStudent');
  if (saved) {
    currentStudent = JSON.parse(saved);
    console.log('Welcome back:', currentStudent.first_name);
    updateNavForLoggedInUser();
    const profileImg = getStoredProfileImage();
    if (profileImg) {
      updateNavProfileImage(profileImg);
    }
  }
}

function updateNavForLoggedInUser() {
  const registerBtn = document.querySelector('a[onclick*="registerModal"]');
  const loginBtn = document.querySelector('a[onclick*="loginModal"]');
  const applyBtn = document.querySelector('.nav-apply');
  if (registerBtn) registerBtn.style.display = 'none';
  if (loginBtn) loginBtn.style.display = 'none';
  if (applyBtn) applyBtn.style.display = 'none';
  
  const mobileRegister = document.querySelector('.mobile-menu a[onclick*="registerModal"]');
  const mobileLogin = document.querySelector('.mobile-menu a[onclick*="loginModal"]');
  const mobileApply = document.querySelector('.mobile-menu .mob-apply');
  if (mobileRegister) mobileRegister.style.display = 'none';
  if (mobileLogin) mobileLogin.style.display = 'none';
  if (mobileApply) mobileApply.style.display = 'none';
  
  if (!document.querySelector('.profile-section')) {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      const profileImage = getStoredProfileImage();
      
      const profileSection = document.createElement('div');
      profileSection.className = 'profile-section';
      profileSection.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; margin-left: 0.5rem; position: relative; cursor: pointer;';
      
      if (profileImage) {
        profileSection.innerHTML = `
          <img src="${profileImage}" class="profile-avatar-img-nav" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gold);">
          <i class="fas fa-user-circle" style="font-size: 1.3rem; color: var(--navy); display: none;"></i>
          <span class="profile-name" style="font-size: 0.85rem; font-weight: 600; color: var(--navy);">${currentStudent.first_name}</span>
          <i class="fas fa-chevron-down" style="font-size: 0.7rem; color: var(--muted);"></i>
          <div class="profile-dropdown" style="position: absolute; top: 40px; right: 0; background: var(--white); border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); padding: 0.5rem 0; min-width: 180px; z-index: 1000; display: none;">
            <a href="#" id="viewProfileBtn" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1.2rem; text-decoration: none; color: var(--text); font-size: 0.85rem;"><i class="fas fa-user"></i> My Profile</a>
            <a href="#" id="viewBookingsBtn" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1.2rem; text-decoration: none; color: var(--text); font-size: 0.85rem;"><i class="fas fa-calendar-alt"></i> My Bookings</a>
            <a href="#" id="viewMessagesBtn" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1.2rem; text-decoration: none; color: var(--text); font-size: 0.85rem;"><i class="fas fa-envelope"></i> My Messages</a>
            <hr style="margin: 0.3rem 0; border-color: var(--border);">
            <a href="#" id="logoutDropdownBtn" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1.2rem; text-decoration: none; color: #c00; font-size: 0.85rem;"><i class="fas fa-sign-out-alt"></i> Logout</a>
          </div>
        `;
      } else {
        profileSection.innerHTML = `
          <i class="fas fa-user-circle" style="font-size: 1.3rem; color: var(--navy);"></i>
          <span class="profile-name" style="font-size: 0.85rem; font-weight: 600; color: var(--navy);">${currentStudent.first_name}</span>
          <i class="fas fa-chevron-down" style="font-size: 0.7rem; color: var(--muted);"></i>
          <div class="profile-dropdown" style="position: absolute; top: 40px; right: 0; background: var(--white); border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); padding: 0.5rem 0; min-width: 180px; z-index: 1000; display: none;">
            <a href="#" id="viewProfileBtn" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1.2rem; text-decoration: none; color: var(--text); font-size: 0.85rem;"><i class="fas fa-user"></i> My Profile</a>
            <a href="#" id="viewBookingsBtn" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1.2rem; text-decoration: none; color: var(--text); font-size: 0.85rem;"><i class="fas fa-calendar-alt"></i> My Bookings</a>
            <a href="#" id="viewMessagesBtn" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1.2rem; text-decoration: none; color: var(--text); font-size: 0.85rem;"><i class="fas fa-envelope"></i> My Messages</a>
            <hr style="margin: 0.3rem 0; border-color: var(--border);">
            <a href="#" id="logoutDropdownBtn" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1.2rem; text-decoration: none; color: #c00; font-size: 0.85rem;"><i class="fas fa-sign-out-alt"></i> Logout</a>
          </div>
        `;
      }
      
      const profileImgElement = profileSection.querySelector('.profile-avatar-img-nav');
      const profileIcon = profileSection.querySelector('.fa-user-circle');
      const profileNameSpan = profileSection.querySelector('.profile-name');
      const dropdownArrow = profileSection.querySelector('.fa-chevron-down');
      const dropdownMenu = profileSection.querySelector('.profile-dropdown');
      
      const toggleDropdown = () => { dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block'; };
      if (profileImgElement) profileImgElement.onclick = toggleDropdown;
      if (profileIcon) profileIcon.onclick = toggleDropdown;
      if (profileNameSpan) profileNameSpan.onclick = toggleDropdown;
      dropdownArrow.onclick = (e) => { e.stopPropagation(); toggleDropdown(); };
      
      document.addEventListener('click', function(e) { if (!profileSection.contains(e.target)) dropdownMenu.style.display = 'none'; });
      
      profileSection.querySelector('#viewProfileBtn').addEventListener('click', (e) => {
        e.preventDefault();
        dropdownMenu.style.display = 'none';
        showProfileModal();
      });
      
      profileSection.querySelector('#viewBookingsBtn').addEventListener('click', (e) => {
        e.preventDefault();
        dropdownMenu.style.display = 'none';
        showProfileModal();
        setTimeout(() => {
          const bookingTab = document.querySelector('.profile-tab[data-tab="bookings"]');
          if (bookingTab) bookingTab.click();
        }, 200);
      });
      
      profileSection.querySelector('#viewMessagesBtn').addEventListener('click', (e) => {
        e.preventDefault();
        dropdownMenu.style.display = 'none';
        showProfileModal();
        setTimeout(() => {
          const messagesTab = document.querySelector('.profile-tab[data-tab="messages"]');
          if (messagesTab) messagesTab.click();
        }, 200);
      });
      
      profileSection.querySelector('#logoutDropdownBtn').addEventListener('click', (e) => { e.preventDefault(); logout(); });
      navLinks.appendChild(profileSection);
    }
  }
  
  const mobileMenu = document.querySelector('.mobile-menu');
  if (mobileMenu && !document.querySelector('.mobile-profile')) {
    const profileImage = getStoredProfileImage();
    const mobileProfile = document.createElement('div');
    mobileProfile.className = 'mobile-profile';
    mobileProfile.style.cssText = 'padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.75rem; cursor: pointer;';
    
    if (profileImage) {
      mobileProfile.innerHTML = `<img src="${profileImage}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"><div><div style="font-weight: 700;">${currentStudent.first_name} ${currentStudent.last_name}</div><div style="font-size: 0.7rem; color: var(--muted);">${currentStudent.student_number}</div></div>`;
    } else {
      mobileProfile.innerHTML = `<i class="fas fa-user-circle" style="font-size: 1.8rem; color: var(--navy);"></i><div><div style="font-weight: 700;">${currentStudent.first_name} ${currentStudent.last_name}</div><div style="font-size: 0.7rem; color: var(--muted);">${currentStudent.student_number}</div></div>`;
    }
    mobileProfile.onclick = () => showProfileModal();
    mobileMenu.insertBefore(mobileProfile, mobileMenu.firstChild);
    
    const mobileLogout = document.createElement('a');
    mobileLogout.href = '#';
    mobileLogout.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
    mobileLogout.onclick = (e) => { e.preventDefault(); logout(); };
    mobileMenu.appendChild(mobileLogout);
  }
}

function updateNavForLoggedOutUser() {
  const registerBtn = document.querySelector('a[onclick*="registerModal"]');
  const loginBtn = document.querySelector('a[onclick*="loginModal"]');
  const applyBtn = document.querySelector('.nav-apply');
  if (registerBtn) registerBtn.style.display = 'inline-block';
  if (loginBtn) loginBtn.style.display = 'inline-block';
  if (applyBtn) applyBtn.style.display = 'inline-block';
  
  const mobileRegister = document.querySelector('.mobile-menu a[onclick*="registerModal"]');
  const mobileLogin = document.querySelector('.mobile-menu a[onclick*="loginModal"]');
  const mobileApply = document.querySelector('.mobile-menu .mob-apply');
  if (mobileRegister) mobileRegister.style.display = 'flex';
  if (mobileLogin) mobileLogin.style.display = 'flex';
  if (mobileApply) mobileApply.style.display = 'flex';
  
  const profileSection = document.querySelector('.profile-section');
  if (profileSection) profileSection.remove();
  const mobileProfile = document.querySelector('.mobile-profile');
  if (mobileProfile) mobileProfile.remove();
}

function logout() {
  currentStudent = null;
  localStorage.removeItem('currentStudent');
  updateNavForLoggedOutUser();
  const errorDiv = document.getElementById('loginErrorMsg');
  if (errorDiv) {
    errorDiv.style.backgroundColor = '#d4edda';
    errorDiv.style.color = '#155724';
    errorDiv.innerHTML = '<i class="fas fa-check-circle"></i> You have been logged out successfully.';
    errorDiv.style.display = 'block';
    setTimeout(() => { errorDiv.style.display = 'none'; window.location.reload(); }, 1500);
  } else { window.location.reload(); }
}

async function registerStudent(studentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(studentData)
    });
    return await response.json();
  } catch (error) { return { error: 'Registration failed' }; }
}

async function loginStudent(studentNumber, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ student_number: studentNumber, password })
    });
    const data = await response.json();
    if (data.success) {
      currentStudent = data.student;
      localStorage.setItem('currentStudent', JSON.stringify(currentStudent));
      updateNavForLoggedInUser();
      const profileImg = getStoredProfileImage();
      if (profileImg) {
        updateNavProfileImage(profileImg);
      }
    }
    return data;
  } catch (error) { return { error: 'Login failed' }; }
}

// ── PROGRAMME DETAILS ──
const progData = {
  diploma: { title: 'Diploma in ICT', nqf: 'NQF Level 6', duration: '3 Years', fees: '~R45,000/year', desc: 'Comprehensive ICT foundation.', highlights: ['6-month internship', 'Cisco certs', '24/7 labs'], reqs: ['NSC diploma', 'Maths 50% or Math Lit 60%', 'English 50%'] },
  extended: { title: 'Extended Curriculum', nqf: 'NQF Level 5–6', duration: '4 Years', fees: '~R40,000/year', desc: 'With foundation year.', highlights: ['Smaller classes', 'Extra support'], reqs: ['NSC', 'Maths 40% or Math Lit 50%', 'English 40%'] },
  advanced: { title: 'Advanced Diploma', nqf: 'NQF Level 7', duration: '1 Year', fees: '~R55,000/year', desc: 'Postgraduate level.', highlights: ['Research project', 'Mentorship'], reqs: ['Diploma in ICT', '60% average', 'Motivation letter'] }
};

function openProgModal(key) {
  const p = progData[key];
  if (!p) return;
  const title = document.getElementById('progModalTitle');
  const body = document.getElementById('progModalBody');
  if (title) title.textContent = p.title;
  if (body) {
    body.innerHTML = `<div class="pdm-meta"><div><strong>${p.nqf}</strong></div><div><strong>${p.duration}</strong></div><div><strong>${p.fees}</strong></div></div>
      <div class="pdm-section"><h4>Overview</h4><p>${p.desc}</p></div>
      <div class="pdm-section"><h4>Highlights</h4><ul>${p.highlights.map(h => `<li>✓ ${h}</li>`).join('')}</ul></div>
      <div class="pdm-section"><h4>Requirements</h4><ul>${p.reqs.map(r => `<li>✓ ${r}</li>`).join('')}</ul></div>
      <button class="btn btn-gold" onclick="window.open('https://cao.ac.za','_blank')">Apply via CAO</button>`;
  }
  openModal('progModal');
}

// ═══════════════════════════════════════════════════════════════
// ══════════════════ CHATBOT UI FUNCTIONS ═══════════════════════
// ═══════════════════════════════════════════════════════════════

let chatOpen = false;
function toggleChat() {
  chatOpen = !chatOpen;
  const chatWin = document.getElementById('chatWin');
  if (chatWin) chatWin.classList.toggle('open', chatOpen);
}

function qSend(text) {
  const chatQuick = document.getElementById('chatQuick');
  if (chatQuick) chatQuick.style.display = 'none';
  appendMsg(text, 'user');
  callBotWithAPI(text);
}

function sendChat() {
  const chatInput = document.getElementById('chatInput');
  const msg = chatInput?.value.trim();
  if (!msg) return;
  const chatQuick = document.getElementById('chatQuick');
  if (chatQuick) chatQuick.style.display = 'none';
  appendMsg(msg, 'user');
  if (chatInput) chatInput.value = '';
  callBotWithAPI(msg);
}

function appendMsg(text, role) {
  const msgs = document.getElementById('chatMsgs');
  if (!msgs) return;
  const d = document.createElement('div');
  d.className = `cm ${role}`;
  d.innerHTML = `<div class="cm-av ${role === 'bot' ? 'bot' : 'usr'}">${role === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'}</div><div class="cm-bub">${text.replace(/\n/g, '<br>')}</div>`;
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
}

async function callBotWithAPI(message) {
  const msgs = document.getElementById('chatMsgs');
  if (!msgs) return;

  // Show typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'cm bot';
  typingDiv.innerHTML = '<div class="cm-av bot"><i class="fas fa-robot"></i></div><div class="cm-bub"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
  msgs.appendChild(typingDiv);
  msgs.scrollTop = msgs.scrollHeight;

  const response = await apiChat(message);
  typingDiv.remove();
  appendMsg(response.answer, 'bot');

  // Show follow-up suggestion chips if backend returned them
  if (response.suggestions && response.suggestions.length > 0) {
    const chipRow = document.createElement('div');
    chipRow.className = 'chat-suggestions';
    chipRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;padding:4px 12px 8px;';
    response.suggestions.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'qbtn';
      btn.textContent = s;
      btn.style.cssText = 'font-size:0.72rem;padding:4px 10px;';
      btn.onclick = () => { chipRow.remove(); qSend(s); };
      chipRow.appendChild(btn);
    });
    msgs.appendChild(chipRow);
    msgs.scrollTop = msgs.scrollHeight;
  }
}

const globalSearchInput = document.getElementById('globalSearchInput');
if (globalSearchInput) {
  globalSearchInput.addEventListener('input', (e) => performSmartSearch(e.target.value));
}

// ═══════════════════════════════════════════════════════════════
// ══════════════════ EMAILJS INTEGRATION ═════════════════════════
// ═══════════════════════════════════════════════════════════════
(function() { if (typeof emailjs !== 'undefined') emailjs.init("RuldD-2MdYJTib7bm"); })();
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  if (currentStudent) {
    const fields = ['contactFirstName', 'contactLastName', 'contactEmail', 'contactPhone'];
    const values = [currentStudent.first_name, currentStudent.last_name, currentStudent.email, currentStudent.phone];
    fields.forEach((id, i) => { const el = document.getElementById(id); if (el && values[i]) el.value = values[i]; });
  }
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentStudent) { alert('Please login first'); openModal('loginModal'); return; }
    const data = {
      first_name: document.getElementById('contactFirstName')?.value.trim() || currentStudent.first_name,
      last_name: document.getElementById('contactLastName')?.value.trim() || currentStudent.last_name,
      email: document.getElementById('contactEmail')?.value.trim() || currentStudent.email,
      phone: document.getElementById('contactPhone')?.value.trim() || '',
      subject: document.getElementById('contactSubject')?.value.trim(),
      message: document.getElementById('contactMessage')?.value.trim(),
      student_id: currentStudent.id
    };
    if (!data.subject || !data.message) { alert('Please fill subject and message'); return; }
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    try {
      saveMessage(data);
      const response = await fetch(`${API_BASE_URL}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (result.success) {
        emailjs.send('service_vgwfpza', 'template_p7uxa47', data);
        alert('Message sent! We will respond within 24 hours.');
        contactForm.reset();
        setTimeout(() => closeModal('contactModal'), 1500);
      } else { alert('Failed to send'); }
    } catch (err) { 
      alert('Message saved locally. Check your messages in profile.');
      contactForm.reset();
      setTimeout(() => closeModal('contactModal'), 1500);
    }
    finally { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i>Send Message'; }
  });
}

function initTourForm() {
  const tourForm = document.getElementById('tourForm');
  if (!tourForm) return;
  if (currentStudent) {
    document.getElementById('tourFirstName') && (document.getElementById('tourFirstName').value = currentStudent.first_name);
    document.getElementById('tourLastName') && (document.getElementById('tourLastName').value = currentStudent.last_name);
    document.getElementById('tourEmail') && (document.getElementById('tourEmail').value = currentStudent.email);
    document.getElementById('tourPhone') && currentStudent.phone && (document.getElementById('tourPhone').value = currentStudent.phone);
  }
  tourForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentStudent) { alert('Please login first'); openModal('loginModal'); return; }
    const data = {
      first_name: document.getElementById('tourFirstName')?.value.trim() || currentStudent.first_name,
      last_name: document.getElementById('tourLastName')?.value.trim() || currentStudent.last_name,
      email: document.getElementById('tourEmail')?.value.trim() || currentStudent.email,
      phone: document.getElementById('tourPhone')?.value.trim() || '',
      tour_date: document.getElementById('tourDateTime')?.value,
      visitors: document.getElementById('tourVisitors')?.value,
      special_requests: document.getElementById('tourMessage')?.value.trim() || '',
      student_id: currentStudent.id
    };
    if (!data.tour_date || !data.visitors) { alert('Please fill all required fields'); return; }
    const submitBtn = tourForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    try {
      saveBooking(data);
      const response = await fetch(`${API_BASE_URL}/tour-booking`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (result.success) {
        emailjs.send('service_vgwfpza', 'template_gmdp3bd', data);
        alert('Tour scheduled! Check your bookings in profile.');
        tourForm.reset();
        setTourMin();
        setTimeout(() => closeModal('tourModal'), 1500);
      } else { alert('Failed to schedule'); }
    } catch (err) { 
      alert('Booking saved locally. Check your bookings in profile.');
      tourForm.reset();
      setTourMin();
      setTimeout(() => closeModal('tourModal'), 1500);
    }
    finally { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fas fa-calendar-check"></i>Schedule My Tour'; }
  });
}

// ── VOICE RECOGNITION ──
let recognition = null, isListening = false;
const voiceBtn = document.getElementById('voiceBtn');
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRec && voiceBtn) {
  recognition = new SpeechRec();
  recognition.lang = 'en-ZA';
  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    const chatInput = document.getElementById('chatInput');
    if (chatInput) chatInput.value = transcript;
    sendChat();
  };
  voiceBtn.addEventListener('click', () => {
    if (isListening) recognition.stop();
    else recognition.start();
    isListening = !isListening;
  });
}

// ============= REGISTRATION HANDLER =============
const regCourse = document.getElementById('regCourse');
if (regCourse) regCourse.addEventListener('change', updateYearLevelOptions);
setupAutoEmail();

const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById('registerErrorMsg');
    if (errorDiv) { errorDiv.style.display = 'none'; errorDiv.innerHTML = ''; }
    
    const student_number = document.getElementById('regStudentNumber').value.trim();
    const first_name = document.getElementById('regFirstName').value.trim();
    const last_name = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const course = document.getElementById('regCourse').value;
    const year_level = document.getElementById('regYearLevel').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (!validateStudentNumber(student_number)) { errorDiv && (errorDiv.innerHTML = 'Student number must be 8 digits', errorDiv.style.display = 'block'); return; }
    if (!validateEmail(email, student_number)) { errorDiv && (errorDiv.innerHTML = `Email must be ${student_number}@live.mut.ac.za`, errorDiv.style.display = 'block'); return; }
    if (!phone) { errorDiv && (errorDiv.innerHTML = 'Phone number required', errorDiv.style.display = 'block'); return; }
    if (!validatePhoneNumber(phone)) { errorDiv && (errorDiv.innerHTML = 'Phone must be 10 digits', errorDiv.style.display = 'block'); return; }
    if (!validatePassword(password)) { errorDiv && (errorDiv.innerHTML = 'Password must have 8+ chars, uppercase, lowercase, number, special character', errorDiv.style.display = 'block'); return; }
    if (password !== confirmPassword) { errorDiv && (errorDiv.innerHTML = 'Passwords do not match', errorDiv.style.display = 'block'); return; }
    
    const result = await registerStudent({ student_number, first_name, last_name, email, phone, course, year_level, password });
    if (result.success) {
      errorDiv && (errorDiv.style.backgroundColor = '#d4edda', errorDiv.style.color = '#155724', errorDiv.innerHTML = 'Registration successful!', errorDiv.style.display = 'block');
      setTimeout(() => { closeModal('registerModal'); registerForm.reset(); openModal('loginModal'); }, 1500);
    } else { errorDiv && (errorDiv.innerHTML = result.error || 'Registration failed', errorDiv.style.display = 'block'); }
  });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById('loginErrorMsg');
    if (errorDiv) { errorDiv.style.display = 'none'; errorDiv.innerHTML = ''; }
    const studentNumber = document.getElementById('loginStudentNumber').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!studentNumber) { errorDiv && (errorDiv.innerHTML = 'Enter student number', errorDiv.style.display = 'block'); return; }
    if (!password) { errorDiv && (errorDiv.innerHTML = 'Enter password', errorDiv.style.display = 'block'); return; }
    const result = await loginStudent(studentNumber, password);
    if (result.success) {
      errorDiv && (errorDiv.style.backgroundColor = '#d4edda', errorDiv.style.color = '#155724', errorDiv.innerHTML = `Welcome back, ${result.student.first_name}!`, errorDiv.style.display = 'block');
      setTimeout(() => { closeModal('loginModal'); loginForm.reset(); if (errorDiv) errorDiv.style.display = 'none'; }, 1000);
    } else { errorDiv && (errorDiv.innerHTML = 'Invalid student number or password', errorDiv.style.display = 'block'); document.getElementById('loginPassword').value = ''; }
  });
}

// ── INITIALIZE EVERYTHING ──
document.addEventListener('DOMContentLoaded', async () => {
  await checkBackend();
  checkLoggedIn();
  initContactForm();
  initTourForm();
  initSearchPage();
  
  const sendBtn = document.getElementById('chatSend');
  if (sendBtn) sendBtn.addEventListener('click', sendChat);
  const chatInputField = document.getElementById('chatInput');
  if (chatInputField) chatInputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendChat(); } });
  const quickBtns = document.querySelectorAll('.qbtn');
  quickBtns.forEach(btn => { btn.addEventListener('click', () => { const msg = btn.getAttribute('data-msg'); if (msg) qSend(msg); }); });
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});