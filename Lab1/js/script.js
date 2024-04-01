const addButton = document.querySelector('.main-button-add');
const modal = document.getElementById('myModal');
const closeButton = document.querySelector('.close');
const addStudentForm = document.getElementById('addStudentForm');
const editButtons = document.querySelectorAll('.edit-button');
const removeButtons = document.querySelectorAll('.remove-button');
const removeStudentModal = document.getElementById('removeStudentModal');
const closeRemoveButton = document.querySelector('.close-remove');
const confirmRemoveButton = document.getElementById('confirmRemove');
const cancelRemoveButton = document.getElementById('cancelRemove');

let rowToRemove = null;





addButton.addEventListener('click', () => {
    document.getElementById('modal-content-title').textContent = 'Add Student';
    document.querySelector('#addStudentForm button[type="submit"]').textContent = 'Submit';
    
    modal.style.display = 'block';
});

closeButton.addEventListener('click', () => {
    const inputdate = document.getElementById('birthday');
const inputname = document.getElementById('name');
const inputsurname = document.getElementById('surname');
document.getElementById('birthday-warning').textContent = "";
    inputdate.style.border = '1px solid #ccc';
    inputname.style.border = '1px solid #ccc';
    inputsurname.style.border = '1px solid #ccc';
    resetModalAndForm();
});

editButtons.forEach(button => {
    button.addEventListener('click', handleEdit);
    
});

removeButtons.forEach(button => {
    button.addEventListener('click', handleRemove);
});


confirmRemoveButton.addEventListener('click', () => {
    if (rowToRemove !== null) {
        rowToRemove.remove(); 
        rowToRemove = null; 
        removeStudentModal.style.display = 'none'; 
    }
});

cancelRemoveButton.addEventListener('click', () => {
    rowToRemove = null; 
    removeStudentModal.style.display = 'none'; 
});


function validateForm() {
    var name = document.getElementById('name').value;
    var surname = document.getElementById('surname').value;
    var birthday = document.getElementById('birthday').value;

    var regex = /^[A-Za-zА-Яа-яЁё]+$/;

    if (!regex.test(name)) {
        document.getElementById('name').style.border = '1px solid red';
        return false;
    }

    if (!regex.test(surname)) {
        document.getElementById('surname').style.border = '1px solid red';
        return false;
    }

    var currentDate = new Date();
    var inputBirthday = new Date(birthday);
    var age = currentDate.getFullYear() - inputBirthday.getFullYear();
    
    if (currentDate < inputBirthday.setFullYear(currentDate.getFullYear() - age)) {
        age--;
    }

    if (age < 16) {
        document.getElementById('birthday-warning').textContent = "The person should be more than 16 yearssdgsdg old.";
        return false;
    }

    return true;
}

addStudentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const group = document.getElementById('group').value;
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const gender = document.getElementById('gender').value;
    const birthday = document.getElementById('birthday').value;
    const id = document.getElementById('id').value;

    if (name !== "" && surname !== "" && validateForm()) {
        const editingRow = document.querySelector('.editing');
        if (editingRow) {
            editingRow.cells[1].textContent = group;
            editingRow.cells[2].textContent = `${name} ${surname}`;
            editingRow.cells[3].textContent = gender;
            editingRow.cells[4].textContent = formatBirthday(birthday);
            editingRow.classList.remove('editing');
        } else {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="checkbox" class="table-checkbox"/></td>
                <td>${group}</td>
                <td>${name} ${surname}</td>
                <td>${gender}</td>
                <td>${formatBirthday(birthday)}</td> 
                <td class="table-status" ><i class="fa-solid fa-circle"></i></td>
                <td>
                    <button class="edit-button"><i class="fa-solid fa-pen"></i></button>
                    <button class="remove-button"><i class="fa-solid fa-user-xmark"></i></button>
                </td>
            `;
            const tableBody = document.querySelector('.main-table tbody');
            tableBody.appendChild(newRow);

            newRow.querySelector('.edit-button').addEventListener('click', handleEdit);
            newRow.querySelector('.remove-button').addEventListener('click', handleRemove);

            sendAddEditStudentFormDataToServer('/api/students', id, group, name, surname, gender, birthday);
        }

        addStudentForm.reset();
        modal.style.display = 'none';
        setupCheckboxEventListeners();
    } else {
        document.getElementById('name').style.border = '1px solid red';
        document.getElementById('surname').style.border = '1px solid red';
    }
});



// Function to send form data to the server for validation
function sendAddEditStudentFormDataToServer(serverPath, id, groupField, firstNameField, lastNameField, genderField, birthdayField) {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log("Response from server:", xhr.responseText);
        }
    };

    let queryString = 'idValue=' + id + '&groupFieldValue=' + groupField + '&firstNameFieldValue=' + firstNameField +
        '&lastNameFieldValue=' + lastNameField + '&genderFieldValue=' + genderField + '&birthdayFieldValue=' +
        birthdayField;
    let requestURL = serverPath + '?' + queryString;

    xhr.open('GET', requestURL);
    xhr.send();

    console.log("GET request sent to:", requestURL, xhr);
}

function handleEdit(event) {
    const row = event.target.closest('tr');
    const cells = row.querySelectorAll('td');

    document.getElementById('group').value = cells[1].textContent;
    const nameSurname = cells[2].textContent.split(' ');
    document.getElementById('name').value = nameSurname[0];
    document.getElementById('surname').value = nameSurname[1];
    document.getElementById('gender').value = cells[3].textContent;
    document.getElementById('birthday').value = unformatBirthday(cells[4].textContent);
    
    
    document.getElementById('modal-content-title').textContent = 'Edit Student';
    document.querySelector('#addStudentForm button[type="submit"]').textContent = 'Save';

    row.classList.add('editing');
    modal.style.display = 'block';
}

function handleRemove(event) {
    const row = event.target.closest('tr');
    row.remove();
}

function formatBirthday(birthday) {
    const [year, month, day] = birthday.split('-');
    return `${day}.${month}.${year}`;
}

function unformatBirthday(birthday) {
    const [day, month, year] = birthday.split('.');
    return `${year}-${month}-${day}`;
}

function setupCheckboxEventListeners() {
    const checkboxes = document.querySelectorAll('.table-checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const statusCell = this.parentNode.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;
            statusCell.style.color = this.checked ? 'green' : '#aaa';
        });
    });
}

setupCheckboxEventListeners();


function resetModalAndForm() {
    
    document.getElementById('group').value = ""; 
    document.getElementById('name').value = "";
    document.getElementById('surname').value = "";
    document.getElementById('gender').value = ""; 
    document.getElementById('birthday').value = "";


    document.getElementById('group').selectedIndex = 0;
    document.getElementById('gender').selectedIndex = 0;
    
   
    const editingRow = document.querySelector('.editing');
    if (editingRow) {
        editingRow.classList.remove('editing');
    }

    
    modal.style.display = 'none';
}
function handleRemove(event) {
    rowToRemove = event.target.closest('tr'); 
    removeStudentModal.style.display = 'block'; 
}








