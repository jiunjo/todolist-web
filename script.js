// DOM 요소 선택
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

// 페이지 로드 시 저장된 할 일 목록 불러오기
document.addEventListener("DOMContentLoaded", () => {
  loadTodos();
});

// 할 일 추가 함수
function addTodo() {
  const todoText = todoInput.value.trim();

  if (todoText === "") {
    alert("할 일을 입력해주세요!");
    return;
  }

  // 새로운 할 일 아이템 생성
  const li = document.createElement("li");
  li.textContent = todoText;

  // 목록에 추가
  todoList.appendChild(li);

  // 입력창 초기화
  todoInput.value = "";

  // localStorage에 저장
  saveTodos();
}

// Enter 키로도 할 일 추가 가능하도록 설정
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

// localStorage에 할 일 목록 저장
function saveTodos() {
  const todos = [];
  document.querySelectorAll("#todoList li").forEach((li) => {
    todos.push(li.textContent);
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

// localStorage에서 할 일 목록 불러오기
function loadTodos() {
  const savedTodos = localStorage.getItem("todos");
  if (savedTodos) {
    const todos = JSON.parse(savedTodos);
    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.textContent = todo;
      todoList.appendChild(li);
    });
  }
}
