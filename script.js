const API_URL = "https://gorest.co.in/public/v2/users";
const ACCESS_TOKEN = "dba7fa8420aaf0eed2c7a9ec18bb27f85e99711e8dbf252decd1365646d4345a"; // Replace with your actual token
let allUsers = [];

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${ACCESS_TOKEN}`
};

function getUsers() {
  fetch(API_URL, {
    headers: defaultHeaders
  })
    .then(res => res.json())
    .then(users => {
      allUsers = users;
      const tableBody = document.getElementById("userTableBody");
      tableBody.innerHTML = "";

      users.forEach(user => {
        tableBody.innerHTML += `
          <tr id="user-${user.id}">
            <td>${user.id}</td>
            <td class="user-name">${user.name}</td>
            <td class="user-email">${user.email}</td>
            <td class="user-gender">${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}</td>
            <td class="user-status">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</td>
            <td class="action-buttons">
              <button class="btn-edit" data-id="${user.id}">Edit</button>
              <button class="btn-delete" data-id="${user.id}">Delete</button>
            </td>
          </tr>
        `;
      });

      attachEventListeners();
    })
    .catch(err => console.log(err));
}

function attachEventListeners() {
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', editUser);
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', deleteUser);
  });
}

function editUser(e) {
  const userId = e.target.dataset.id;
  const row = document.getElementById(`user-${userId}`);
  
  const name = row.querySelector('.user-name').textContent;
  const email = row.querySelector('.user-email').textContent;
  const gender = row.querySelector('.user-gender').textContent.toLowerCase();
  const status = row.querySelector('.user-status').textContent.toLowerCase();

  const newName = prompt('Enter new name:', name);
  if (newName === null) return;

  const newEmail = prompt('Enter new email:', email);
  if (newEmail === null) return;

  const newGender = prompt('Enter gender (male/female):', gender);
  if (newGender === null) return;

  const newStatus = prompt('Enter status (active/inactive):', status);
  if (newStatus === null) return;

  fetch(`${API_URL}/${userId}`, {
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify({
      name: newName,
      email: newEmail,
      gender: newGender.toLowerCase(),
      status: newStatus.toLowerCase()
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.id) {
      alert('User updated successfully!');
      getUsers();
    }
  })
  .catch(err => {
    console.log(err);
    alert('Error updating user');
  });
}

function deleteUser(e) {
  const userId = e.target.dataset.id;
  
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
    console.log(err);
    alert('Error deleting user');
  });
}

getUsers();
