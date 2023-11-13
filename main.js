const form = document.querySelector('.todo-list-form');
const input = document.querySelector('#todo-list-input');
const submitBtn = document.querySelector('.submit-btn');
const todoList = document.querySelector('.todo-list');
const clearBtn = document.querySelector('.clear-btn');
let editElement;
let editFlag = false;

// event listeners
form.addEventListener('submit', addItem);
// clear list
clearBtn.addEventListener('click', clearItems);
document.addEventListener('DOMContentLoaded',initList)

function initList(){
    const getListFromStorage = localStorage.getItem('todoList')
    const taskArray = getLocalStorage()
    taskArray.forEach(item =>{
        createListItem(item.id,item.value,item.createdAt)
    })
    console.log(taskArray)
}
// Input Add
function addItem(e) {
    e.preventDefault();
    const value = input.value.trim();
    const createdAt = getCurrentTime();
    const id = new Date().getTime().toString()

    if (value && !editFlag) {
        createListItem(id, value, createdAt)
        const currentTaskItem = {
            id: id,
            value: value,
            createdAt: createdAt
        }
        const taskArray = getLocalStorage()
        taskArray.push(currentTaskItem)
        localStorage.setItem('todoList', JSON.stringify(taskArray))
        defaultSetting()
    } else if (value && editFlag) {
        editElement.textContent = value;
        defaultSetting()
    } else {
        alert('please inter value')
    }
}
function getLocalStorage(){
    return  localStorage.getItem('todoList')
    ? JSON.parse(localStorage.getItem('todoList'))
    : []
}
// Time
function getCurrentTime() {
    const currenDate = new Date();
    return currenDate.toLocaleTimeString();
}
//Remove
function removeItem(e) {
    const targetElToDelete = e.currentTarget.parentElement.parentElement;
    const items = getLocalStorage();
    const updatedList = items.filter(item => item.id !== targetElToDelete.dataset.id);
    localStorage.setItem('todoList',JSON.stringify(updatedList));
    targetElToDelete.remove();
}
//Edit
function editItem(e) {
    const elemEdit = e.currentTarget.parentElement.previousElementSibling.querySelector('span');
    editElement = elemEdit;
    input.value = editElement.textContent;
    submitBtn.textContent = 'edit';
    editFlag = true;
}
function defaultSetting() {
    input.value = '';
    editFlag = false;
    submitBtn.textContent = 'Add';

}
//inner HTML
function createListItem(id,value, createdAt) {
    const taskElement = document.createElement('li');
    taskElement.setAttribute('data-id', id)
    taskElement.classList.add('todo-list__item');
    taskElement.innerHTML = `
           <span class="title">  
                <span>${value} </span> 
               / ${createdAt}
          </span>
                <div class="btn-container">
                    <input type="checkbox" class="crossed-element"/>
                    <button class="edit-btn"></button>
                    <button class="delete-btn"></button>
                </div>
          `;
    // add event listeners to both buttons
    const deleteBtn = taskElement.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', removeItem);
    const editBtn = taskElement.querySelector('.edit-btn');
    editBtn.addEventListener('click', editItem);
    todoList.append(taskElement);

    const crossedElement = taskElement.querySelector('.crossed-element');
    crossedElement.addEventListener('change', crossedOut);
    crossedElement.type = 'checkbox';
}
//default value
function crossedOut(e) {
    const crossed = e.target;
    const elementContent = e.target.parentElement.previousElementSibling;
    if (crossed.checked) {
        elementContent.style.textDecoration = 'line-through';
    } else {
        elementContent.style.textDecoration = 'none';
    }

}
//check-box
function clearItems(e) {
    const clearElements = todoList.querySelectorAll('.todo-list__item');
    clearElements.forEach(item => {
        item.remove();
    })
}
