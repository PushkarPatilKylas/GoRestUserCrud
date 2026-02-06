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
              <button class="btn-edit" onclick="editUser(${user.id})">Edit</button>
              <button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>
            </td>
          </tr>
        `;
      });
    })
    .catch(err => console.log(err));
}

function editUser(userId) {
  const row = document.getElementById(`user-${userId}`);
  const name = row.querySelector('.user-name').textContent;
  const email = row.querySelector('.user-email').textContent;

  const newName = prompt('New name:', name);
  if (newName === null) return;

  const newEmail = prompt('New email:', email);
  if (newEmail === null) return;

  fetch(`${API_URL}/${userId}`, {
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify({
      name: newName,
      email: newEmail
    })
  })
    .then(res => res.json())
    .then(data => {
      alert('User updated!');
      getUsers();
    })
    .catch(err => alert('Error updating user'));
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
    console.log(err);
    alert('Error deleting user');
  });
}

getUsers();
