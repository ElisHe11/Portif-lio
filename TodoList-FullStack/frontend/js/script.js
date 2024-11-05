const tbody = document.querySelector('tbody')
const addForm = document.querySelector('.add-form')
const inputTask = document.querySelector('.input-task')

const fecthTask = async() => {
   const response = await fetch('http://localhost:3030/tasks');
    const tasks = await response.json()
   return tasks;
}

const addTask = async (event) =>{
    event.preventDefault();

    const task = {title: inputTask.value};
    
    await fetch('http://localhost:3030/tasks', {
        method: 'post',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(task),
    });

    loadTask();
    inputTask.value = "";
}

const deleteTask = async(id)=>{
    await fetch(`http://localhost:3030/tasks/${id}`,{
        method: 'delete',
    });

    loadTask()
}

const updateTask = async({id, title, status})=>{
    await fetch(`http://localhost:3030/tasks/${id}`,{
        method: 'put',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({title,status})
    })

    loadTask()
}

const formatDate = (dateUTC)=>{
    const options = {dateStyle: 'long', timeStyle:'short'}
    const date = new Date(dateUTC).toLocaleString('pt-br',options);
    return date;

}

const createElement = (tag, innerText = '', innerHTML = '') =>{
    const element = document.createElement(tag);
    
    if(innerText){
        element.innerText = innerText;
     }

     if(innerHTML){
        element.innerHTML = innerHTML;
     }
    
     return element;
}

const createSelect = (value) =>{
    const options = `
    <option value="pendente">pendente</option>
    <option value="em andamento">em andamento</option>
    <option value="concluído">concluído</option>`;

    const select = createElement('select','',options);
    select.value = value ;
    return select;
}

const createRow =(task) =>{
    const {id, title, status, created_at} = task
    
    const tr = createElement('tr')
    const tdTitle = createElement('td', title)
    const tdCreatedAt = createElement('td', formatDate(created_at))
    const tdStatus = createElement('td')
    const tdAction = createElement('td')
    const select = createSelect(status);
    select.addEventListener('change', ({target}) => updateTask({...task, status:target.value}))
    const editButtton = createElement('button','',' <span><i class="bi bi-pencil"></i></span>')
    const deleteButton = createElement('button', '', '<span> <i class="bi bi-trash3"></i></span>')
    const editForm = createElement('form');
    const editInput = createElement('input')
    editForm.appendChild(editInput)
    editInput.value= title
    editForm.addEventListener('submit', (event)=>{
        event.preventDefault();
        updateTask({id, title:editInput.value,status})
    })
    editButtton.addEventListener('click', () =>{
        tdTitle.innerText= ''
        tdTitle.appendChild(editForm);
    })
    editButtton.classList.add('btn-action')
    deleteButton.classList.add('btn-action')
    deleteButton.addEventListener('click', () =>deleteTask(id))
    tdStatus.appendChild(select)
    tdAction.appendChild(editButtton)
    tdAction.appendChild(deleteButton)
    
    tr.appendChild(tdTitle)
    tr.appendChild(tdCreatedAt)
    tr.appendChild(tdStatus)
    tr.appendChild(tdAction)
    
    return tr;
}

const loadTask = async () => {
    const tasks = await fecthTask();

    tbody.innerHTML = ""

    tasks.forEach((task) => {
        const tr = createRow(task);
        tbody.appendChild(tr);
    });
}

addForm.addEventListener('submit', addTask)

loadTask();
