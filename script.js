const API_URL = "https://gorest.co.in/public/v2/users";
const ACCESS_TOKEN = "dba7fa8420aaf0eed2c7a9ec18bb27f85e99711e8dbf252decd1365646d4345a";
let allUsers = [];
let editingUserId = null;

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${ACCESS_TOKEN}`
};

function showLoader() {
  document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
  document.getElementById('loader').classList.add('hidden');
}

function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

function getUsers() {
  showLoader();
  fetch(API_URL, {
    headers: defaultHeaders
  })
    .then(res => res.json())
    .then(users => {
      allUsers = users;
      const tableBody = document.getElementById("userTableBody");
      tableBody.innerHTML = "";

      let html = '';

      users.forEach(user => {
        html += `
          <tr id="user-${user.id}">
            <td>${user.id}</td>
            <td class="user-name">${user.name}</td>
            <td class="user-email">${user.email}</td>
            <td class="user-gender">${user.gender.charAt(0).toUpperCase()}${user.gender.slice(1)}</td>
            <td class="user-status">${user.status.charAt(0).toUpperCase()}${user.status.slice(1)}</td>
            <td class="action-buttons">
              <button class="btn-edit edit-user" onclick="editUser(${user.id})">Edit</button>
              <button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>
            </td>
          </tr>
        `;
      });
      tableBody.innerHTML = html;
      hideLoader();
      showNotification('Users loaded successfully!', 'success');
    })
    .catch(err => {
      hideLoader();
      showNotification('Failed to load users. Please try again.', 'error');
    });
}

function editUser(userId) {
  const row = document.getElementById(`user-${userId}`);
  const name = row.querySelector('.user-name').textContent;
  const email = row.querySelector('.user-email').textContent;
  const gender = row.querySelector('.user-gender').textContent.toLowerCase();
  const status = row.querySelector('.user-status').textContent.toLowerCase();

  editingUserId = userId;
  document.getElementById('editName').value = name;
  document.getElementById('editEmail').value = email;
  document.getElementById('editGender').value = gender;
  document.getElementById('editStatus').value = status;
  document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
  editingUserId = null;
  clearErrors();
}

function clearErrors() {
  document.getElementById('nameError').textContent = '';
  document.getElementById('emailError').textContent = '';
}

function saveUser(event) {
  event.preventDefault();
  clearErrors();

  const name = document.getElementById('editName').value.trim();
  const email = document.getElementById('editEmail').value.trim();
  const gender = document.getElementById('editGender').value;
  const status = document.getElementById('editStatus').value;
  let isValid = true;

  if (name.length < 3) {
    document.getElementById('nameError').textContent = 'Name must be at least 3 characters';
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    document.getElementById('emailError').textContent = 'Invalid email format';
    isValid = false;
  }

  if (!gender) {
    document.getElementById('editGender').focus();
    isValid = false;
  }

  if (!status) {
    document.getElementById('editStatus').focus();
    isValid = false;
  }

  if (!isValid) return;

  showLoader();
  fetch(`${API_URL}/${editingUserId}`, {
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify({
      name: name,
      email: email,
      gender: gender,
      status: status
    })
  })
    .then(res => res.json())
    .then(data => {
      hideLoader();
      showNotification('User updated successfully!', 'success');
      closeEditModal();
      getUsers();
    })
    .catch(err => {
      hideLoader();
      showNotification('Failed to update user. Please try again.', 'error');
    });
}

function deleteUser(userId) {

  if (!confirm('Are you sure you want to delete this user?')) return;

  fetch(`${API_URL}/${userId}`, {
    method: 'DELETE',
    headers: defaultHeaders
  })
    .then(res => {
      if (res.ok) {
        alert('User deleted successfully!');
        getUsers();
      }
    })
    .catch(err => {
      alert('Error deleting user');
    });
}

getUsers();

