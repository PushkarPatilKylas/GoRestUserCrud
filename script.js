const API_URL = "https://gorest.co.in/public/v2/users";

function getUsers() {
  fetch(API_URL)
    .then(res => res.json())
    .then(users => {
      const tableBody = document.getElementById("userTableBody");
      tableBody.innerHTML = "";

      users.forEach(user => {
        tableBody.innerHTML += `
          <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.gender}</td>
            <td>${user.status}</td>
            <td class="action-icons">
              <i class="fa-solid fa-pen edit"></i>
              <i class="fa-solid fa-trash delete"></i>
            </td>
          </tr>
        `;
      });
    })
    .catch(err => console.log(err));
}

getUsers();
