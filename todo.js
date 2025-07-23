// 로컬 스토리지에서 할 일 목록 불러오기
let todos = [];

// DOM 요소 가져오기
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const emptyState = document.getElementById("emptyState");

// 로컬 스토리지에서 데이터 로드
function loadTodos() {
  const savedTodos = localStorage.getItem("todos");
  if (savedTodos) {
    try {
      todos = JSON.parse(savedTodos);
      console.log("로컬 스토리지에서 불러온 할 일 목록:", todos);
    } catch (e) {
      console.error("로컬 스토리지 데이터 파싱 오류:", e);
      todos = [];
    }
  } else {
    console.log("로컬 스토리지에 저장된 할 일이 없습니다.");
    todos = [];
  }
}

// 할 일 목록 화면에 표시하기
function renderTodos() {
  // 목록 초기화
  todoList.innerHTML = "";

  // 할 일 개수 업데이트
  updateTodoCount();

  // 빈 상태 표시 여부 결정
  if (todos.length === 0) {
    emptyState.style.display = "flex";
  } else {
    emptyState.style.display = "none";
  }

  // 각 할 일 항목에 대해 리스트 아이템 생성
  todos.forEach((todo, index) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");

    // 할 일 텍스트 요소 생성
    const todoText = document.createElement("span");
    todoText.classList.add("todo-text");
    todoText.textContent = todo.text;

    // 완료된 할 일은 클래스 추가
    if (todo.completed) {
      todoText.classList.add("completed");
    }

    // 버튼 컨테이너 생성
    const actionBtns = document.createElement("div");
    actionBtns.classList.add("todo-actions");

    // 완료 버튼 생성
    const completeBtn = document.createElement("button");
    completeBtn.classList.add("btn", "complete-btn");
    completeBtn.innerHTML = todo.completed
      ? '<i class="fas fa-undo"></i> 취소'
      : '<i class="fas fa-check"></i> 완료';
    completeBtn.addEventListener("click", () => toggleComplete(index));

    // 삭제 버튼 생성
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "delete-btn");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i> 삭제';
    deleteBtn.addEventListener("click", () => deleteTodo(index));

    // 요소들을 조립
    actionBtns.appendChild(completeBtn);
    actionBtns.appendChild(deleteBtn);

    todoItem.appendChild(todoText);
    todoItem.appendChild(actionBtns);

    todoList.appendChild(todoItem);
  });
}

// 할 일 개수 업데이트
function updateTodoCount() {
  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  todoCount.textContent = `${totalCount}개의 할 일 (${completedCount}개 완료)`;
}

// 새로운 할 일 추가
function addTodo() {
  const text = todoInput.value.trim();

  if (text !== "") {
    todos.push({
      text: text,
      completed: false,
      createdAt: new Date().toISOString(),
    });

    todoInput.value = "";
    renderTodos();
    saveTodos();
  }
}

// 할 일 삭제
function deleteTodo(index) {
  todos.splice(index, 1);
  renderTodos();
  saveTodos();
}

// 할 일 완료 상태 토글
function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  renderTodos();
  saveTodos();
}

// 완료된 할 일 모두 삭제
function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  renderTodos();
  saveTodos();
}

// 로컬 스토리지에 할 일 목록 저장
function saveTodos() {
  try {
    localStorage.setItem("todos", JSON.stringify(todos));
    console.log("할 일 목록이 로컬 스토리지에 저장되었습니다:", todos);
  } catch (e) {
    console.error("로컬 스토리지 저장 오류:", e);
  }
}

// 이벤트 리스너 등록
addBtn.addEventListener("click", addTodo);

// Enter 키로 할 일 추가
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

// 완료된 항목 삭제 버튼
clearCompletedBtn.addEventListener("click", clearCompleted);

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  renderTodos();
  console.log("페이지 로드 완료, 할 일 목록 렌더링됨");
});
