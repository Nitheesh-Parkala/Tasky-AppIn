var state={
    taskList:[]
};

//Dom Objects
var taskModal= document.querySelector(".task__modal__body");
var taskContents= document.querySelector(".task__contents")


var htmlTaskContent =({id,title,description,type,url})=>`
   <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
    <div class='card shadow-sm task__card'>
      <div class='card-header d-flex gap-2 justify-content-end task__card__header'>
        <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick="editTask.apply(this, arguments)">
          <i class='fas fa-pencil-alt' name=${id}></i>
        </button>
        <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick="deleteTask.apply(this, arguments)">
          <i class='fas fa-trash-alt' name=${id}></i>
        </button>
      </div>
      <div class='card-body'>
        ${
          url
            ? `<img width="100%" src=${url} alt="card image cap" class="card-img-top md-3 rounded-lg"/>`
            : `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src="https://tse3.mm.bing.net/th?id=OIP.LZsJaVHEsECjt_hv1KrtbAHaHa&pid=Api&P=0" alt='card image cap' class='card-image-top md-3 rounded-lg' />`
        }
          <h4 class='task__card__title'>${title}</h4>
        <p class='description trim-3-lines text-muted' data-gram_editor='false'>
          ${description}
        </p>
           <div class='tags text-white d-flex flex-wrap'>
          <span class='badge bg-primary m-1'>${type}</span>
        </div>
      </div>
   <div class='card-footer'>
        <button  type='button' class='btn btn-outline-primary float-right' data-bs-toggle='modal' data-bs-target='#showTask' id=${id}
         onclick='openTask.apply(this,arguments)'>
          Open Task</button>
      </div>
    </div>
  </div>
`;
//dynamic openTask modal content
var htmlModalContent =({id,title,description,url})=>{
  var date = new Date(parseInt(id));
  return `
<div id = ${id}>
${
            url ?
            `<img width="100%" src=${url} alt="card image cap" class="card-img-top md-3 rounded-lg"/>`
            : `<img width="100%" src="data:image/png;base64,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" alt="card image cap" class="card-img-top md-3 rounded-lg"/>`
          }
          <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>
          <h2 class='my-3'>${title}</h2>
          <p class='lead'>${description}</p>
 </div> `;
};

// here we will be updating our local storage (i.e., the modals/cards which we see on our ui)
var updateLocalStorage = () => {
  localStorage.setItem(
    "task",
    JSON.stringify({
      tasks: state.taskList,
    })
  );
};

const loadInitialData = () => {
  const localStorageCopy = JSON.parse(localStorage.task);

  if (localStorageCopy) state.taskList = localStorageCopy.tasks;

  state.taskList.map((cardDate) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
  });
};

var handleSubmit = ( event )=>{
  const id=`${Date.now()}`;
  const input ={
    url: document.getElementById("imageUrl").value,
    title: document.getElementById("taskTitle").value,
    type: document.getElementById("tags").value,
    description: document.getElementById("taskDescription").value,
  };
  if (input.title === "" || input.type === "" || input.description === "") {
    return alert("Please Fill All The Fields");
  }
   if ( input.type.length > 15) {
    return alert("Task type should be between 1 and 10 characters.");
  }
  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({
      ...input,
      id,
    })
  );

  // updated task list - for 1st go
  state.taskList.push({ ...input, id });

  // update the same on localStorage too
  updateLocalStorage();
};

// opens new modal on our ui when user clicks open task
var openTask = (e) => {
  // pop up the current one
  if (!e) e = window.event;

  var getTask = state.taskList.find(({id})=>id===e.target.id);
  taskModal.innerHTML=htmlModalContent(getTask);
};

var deleteTask =(e)=>{
  if(!e)e=window.event;

  var targetID = e.target.getAttribute("name");
  var type= e.target.tagName;
  // console.log(type);
  // console.log(targetID);
  var removeTask= state.taskList.filter(({id})=>id !== targetID)
  //console.log(removeTask);

  state.taskList=removeTask;
  updateLocalStorage();

  if(type=="BUTTON"){
    console.log(e.target.parentNode.parentNode.parentNode);
  return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode
  );
  }
   return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
);
};


var editTask =(e)=>{
  if(!e)e=window.event;

  var type= e.target.tagName;

  var parentNode;
  let taskTitle;
  var taskDescription;
  var taskType;
  let submitButton;

  if(type=="BUTTON"){
    parentNode = e.target.parentNode.parentNode
  }else{
    parentNode = e.target.parentNode.parentNode.parentNode
  }

  taskTitle = parentNode.childNodes[3].childNodes[3];
   taskDescription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    console.log(taskTitle,taskDescription,taskType);
    submitButton =parentNode.childNodes[5].childNodes[1];

    taskTitle.setAttribute("contenteditable","true");
    taskDescription.setAttribute("contenteditable","true");
    taskType.setAttribute("contenteditable","true");

  submitButton.setAttribute('onclick',"saveEdit.apply(this,arguments)");
  submitButton.removeAttribute("data-bs-toggle");
   submitButton.removeAttribute("data-bs-target");
   submitButton.innerHTML ="Save Changes";
}


var saveEdit =(e)=>{
  if(!e)e=window.event;

  var targetID = e.target.id;
  var parentNode = e.target.parentNode.parentNode;
  // console.log(parentNode)

var taskTitle= parentNode.childNodes[3].childNodes[3];
var taskDescription = parentNode.childNodes[3].childNodes[5];
var taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
var submitButton = parentNode.childNodes[5].childNodes[1];

// console.log(taskTitle,taskDescription);


 var updatedData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };


let stateCopy = state.taskList;
  stateCopy = stateCopy.map((task) =>
    task.id === targetID
      ? {
          id: task.id,
          title: updatedData.taskTitle,
          description: updatedData.taskDescription,
          type: updatedData.taskType,
          url: task.url,
        }
      : task
  );

    state.taskList = stateCopy;
    updateLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false")

   submitButton.setAttribute('onclick',"openTask.apply(this,arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
   submitButton.setAttribute("data-bs-target", "#showTask");
   submitButton.innerHTML ="Open Task";
  };

 const searchTask = (e) => {
  if (!e) e = window.event;

  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }

  const resultData = state.taskList.filter(({ title }) =>
    title.toLowerCase().includes(e.target.value.toLowerCase())
  );

  resultData.map((cardData) =>
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData))
  );
};