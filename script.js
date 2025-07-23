// DOM 요소 선택
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const totalTasks = document.getElementById("total-tasks");
const editModal = document.getElementById("editModal");
const closeModal = document.querySelector(".close");
const editInput = document.getElementById("editInput");
const saveEditBtn = document.getElementById("saveEditBtn");
const filterButtons = document.querySelectorAll(".tab-btn");
const progressFill = document.getElementById("progressFill");
const completedCount = document.getElementById("completedCount");
const activeCount = document.getElementById("activeCount");
const currentDateElement = document.getElementById("currentDate");
const currentTimeElement = document.getElementById("currentTime");
const randomQuoteElement = document.getElementById("randomQuote");

// 추가 DOM 요소 선택
const darkModeToggle = document.getElementById("darkModeToggle");
const miniCalendarContainer = document.getElementById("miniCalendar");
const todoDetailsContainer = document.getElementById("todoDetails");
const categoryItems = document.querySelectorAll(".category-item");

// 현재 수정 중인 할 일의 ID를 저장
let currentEditId = null;

// 고유한 ID를 생성하는 함수
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 페이지 로드 시 저장된 할 일 목록 불러오기 (기존 함수 확장)
document.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  updateTotalTasks();
  updateDateTime();
  updateStatistics();
  displayRandomQuote();
  createMiniCalendar();

  // 1초마다 시간 업데이트
  setInterval(updateDateTime, 1000);

  // 필터 버튼 이벤트 리스너 설정
  setupFilterListeners();

  // 다크 모드 이벤트 리스너 설정
  setupDarkMode();

  // 카테고리 클릭 이벤트 리스너 설정
  setupCategoryListeners();
});

// 날짜와 시간 업데이트
function updateDateTime() {
  const now = new Date();

  // 날짜 형식: 2023년 10월 25일 (수요일)
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };
  currentDateElement.textContent = now.toLocaleDateString("ko-KR", dateOptions);

  // 시간 형식: 오후 3:45:23
  const timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
  currentTimeElement.textContent = now.toLocaleTimeString("ko-KR", timeOptions);
}

// 필터 버튼 이벤트 리스너 설정
function setupFilterListeners() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 활성화된 버튼 클래스 변경
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // 필터 적용
      const filter = button.getAttribute("data-filter");
      filterTodos(filter);
    });
  });
}

// 할일 필터링 함수
function filterTodos(filter) {
  const todos = document.querySelectorAll(".todo-item");

  todos.forEach((todo) => {
    const isCompleted = todo.classList.contains("completed");

    todo.classList.remove("hidden");

    if (filter === "active" && isCompleted) {
      todo.classList.add("hidden");
    } else if (filter === "completed" && !isCompleted) {
      todo.classList.add("hidden");
    }
  });
}

// 랜덤 명언 표시
function displayRandomQuote() {
  const quotes = [
    "오늘 할 일을 내일로 미루지 마세요.",
    "실패는 성공의 어머니입니다.",
    "끝날 때까지 끝난 게 아니다.",
    "성공은 1% 영감과 99% 노력으로 이루어진다.",
    "지금 당신의 모습은 과거에 당신이 원했던 모습입니다.",
    "행동이 말보다 더 큰 소리로 말한다.",
    "계획 없는 목표는 한낱 꿈에 불과하다.",
    "할 수 있다고 믿는 사람은 결국 할 수 있게 된다.",
    "작은 일을 큰 사랑으로 행하라.",
    "오늘 걷지 않으면 내일은 뛰어야 한다.",
  ];

  const randomIndex = Math.floor(Math.random() * quotes.length);
  randomQuoteElement.textContent = quotes[randomIndex];
}

// 통계 업데이트
function updateStatistics() {
  const todos = getTodosFromStorage();
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const active = total - completed;

  // 카운트 업데이트
  completedCount.textContent = completed;
  activeCount.textContent = active;

  // 진행 바 업데이트
  const percentComplete = total > 0 ? (completed / total) * 100 : 0;
  progressFill.style.width = `${percentComplete}%`;
}

// 할 일 추가 함수
function addTodo() {
  const todoText = todoInput.value.trim();

  if (todoText === "") {
    showMessage("할 일을 입력해주세요!");
    return;
  }

  // 새로운 할 일 객체 생성
  const todo = {
    id: generateUniqueId(),
    text: todoText,
    date: new Date().toISOString(),
    completed: false,
  };

  // 로컬 스토리지에서 기존 할 일 목록 불러오기
  const todos = getTodosFromStorage();

  // 새 할 일 추가
  todos.push(todo);

  // 로컬 스토리지에 저장
  saveTodosToStorage(todos);

  // UI에 할 일 표시
  renderTodo(todo);

  // 입력창 초기화
  todoInput.value = "";

  // 총 개수 업데이트
  updateTotalTasks();

  // 입력창에 포커스
  todoInput.focus();

  // 통계 업데이트
  updateStatistics();
}

// 할 일 삭제 함수
function deleteTodo(id) {
  // 확인 메시지
  if (confirm("정말로 이 할 일을 삭제하시겠습니까?")) {
    // 로컬 스토리지에서 기존 할 일 목록 불러오기
    const todos = getTodosFromStorage();

    // 해당 ID를 가진 할 일 제외
    const updatedTodos = todos.filter((todo) => todo.id !== id);

    // 로컬 스토리지에 저장
    saveTodosToStorage(updatedTodos);

    // UI에서 할 일 삭제
    const todoElement = document.getElementById(id);
    if (todoElement) {
      todoElement.classList.add("fade-out");
      setTimeout(() => {
        todoElement.remove();
        updateTotalTasks();
        updateStatistics();
      }, 300);
    }
  }
}

// 할 일 수정 모달 열기
function openEditModal(id, text) {
  currentEditId = id;
  editInput.value = text;
  editModal.style.display = "block";
  editInput.focus();
}

// 할 일 수정 저장
function saveEdit() {
  const newText = editInput.value.trim();

  if (newText === "") {
    showMessage("내용을 입력해주세요!");
    return;
  }

  if (currentEditId) {
    // 로컬 스토리지에서 기존 할 일 목록 불러오기
    const todos = getTodosFromStorage();

    // 해당 ID를 가진 할 일 찾기 및 수정
    const updatedTodos = todos.map((todo) => {
      if (todo.id === currentEditId) {
        return { ...todo, text: newText };
      }
      return todo;
    });

    // 로컬 스토리지에 저장
    saveTodosToStorage(updatedTodos);

    // UI 업데이트
    const todoTextElement = document.querySelector(
      `#${currentEditId} .todo-text`
    );
    if (todoTextElement) {
      todoTextElement.textContent = newText;
      // 애니메이션 효과
      const todoElement = document.getElementById(currentEditId);
      todoElement.classList.add("highlight");
      setTimeout(() => {
        todoElement.classList.remove("highlight");
      }, 1000);
    }

    // 모달 닫기
    closeEditModal();
  }
}

// 모달 닫기
function closeEditModal() {
  editModal.style.display = "none";
  currentEditId = null;
}

// 메시지 표시 함수
function showMessage(message) {
  alert(message);
}

// 로컬 스토리지에서 할 일 목록 불러오기
function getTodosFromStorage() {
  const savedTodos = localStorage.getItem("todos");
  return savedTodos ? JSON.parse(savedTodos) : [];
}

// 로컬 스토리지에 할 일 목록 저장 (기존 함수 수정)
function saveTodosToStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
  updateStatistics();
  updateTotalTasks();
}

// 할 일 목록 불러오기 및 표시
function loadTodos() {
  const todos = getTodosFromStorage();
  todos.forEach((todo) => renderTodo(todo));
}

// 할 일 완료 상태 토글 함수
function toggleComplete(id) {
  // 로컬 스토리지에서 기존 할 일 목록 불러오기
  const todos = getTodosFromStorage();

  // 해당 ID를 가진 할 일 찾기 및 완료 상태 토글
  const updatedTodos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });

  // 로컬 스토리지에 저장
  saveTodosToStorage(updatedTodos);

  // UI 업데이트
  const todoElement = document.getElementById(id);
  if (todoElement) {
    const isCompleted = updatedTodos.find((todo) => todo.id === id).completed;
    if (isCompleted) {
      todoElement.classList.add("completed");
    } else {
      todoElement.classList.remove("completed");
    }
  }

  // 통계 업데이트
  updateStatistics();
}

// 미니 캘린더 생성
function createMiniCalendar() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  // 캘린더 헤더 생성
  const calendarHeader = document.createElement("div");
  calendarHeader.className = "calendar-header";
  calendarHeader.innerHTML = `${year}년 ${month + 1}월`;

  // 요일 헤더 생성
  const weekdaysHeader = document.createElement("div");
  weekdaysHeader.className = "weekdays-header";
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  weekdays.forEach((day) => {
    const dayElem = document.createElement("div");
    dayElem.className = "weekday";
    dayElem.textContent = day;
    weekdaysHeader.appendChild(dayElem);
  });

  // 날짜 그리드 생성
  const daysGrid = document.createElement("div");
  daysGrid.className = "days-grid";

  // 해당 월의 첫 날과 마지막 날 구하기
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // 첫 날의 요일 (0: 일요일, 6: 토요일)
  const firstDayOfWeek = firstDay.getDay();

  // 이전 달의 마지막 날짜 구하기
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  // 이전 달의 날짜 추가 (빈 칸 채우기)
  for (let i = 0; i < firstDayOfWeek; i++) {
    const dayElem = document.createElement("div");
    dayElem.className = "day prev-month";
    dayElem.textContent = prevMonthLastDay - firstDayOfWeek + i + 1;
    daysGrid.appendChild(dayElem);
  }

  // 현재 달의 날짜 추가
  const today = new Date().getDate();
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dayElem = document.createElement("div");
    dayElem.className = "day";
    if (
      i === today &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
    ) {
      dayElem.classList.add("today");
    }
    dayElem.textContent = i;
    daysGrid.appendChild(dayElem);
  }

  // 다음 달의 날짜 추가 (빈 칸 채우기)
  const daysFromNextMonth = 42 - (firstDayOfWeek + lastDay.getDate()); // 6주 * 7일 = 42
  for (let i = 1; i <= daysFromNextMonth; i++) {
    const dayElem = document.createElement("div");
    dayElem.className = "day next-month";
    dayElem.textContent = i;
    daysGrid.appendChild(dayElem);
  }

  // 미니 캘린더에 모든 요소 추가
  miniCalendarContainer.innerHTML = "";
  miniCalendarContainer.appendChild(calendarHeader);
  miniCalendarContainer.appendChild(weekdaysHeader);
  miniCalendarContainer.appendChild(daysGrid);

  // 캘린더에 스타일 추가
  const calendarStyles = document.createElement("style");
  calendarStyles.textContent = `
    .calendar-header {
      text-align: center;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .weekdays-header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      font-weight: 500;
      color: var(--light-text);
      margin-bottom: 5px;
    }
    .weekday {
      padding: 5px 0;
    }
    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
    }
    .day {
      text-align: center;
      padding: 5px 0;
      border-radius: 4px;
      cursor: pointer;
    }
    .day:hover {
      background: rgba(99, 102, 241, 0.1);
    }
    .day.today {
      background: var(--primary-color);
      color: white;
      font-weight: 600;
    }
    .prev-month, .next-month {
      color: var(--light-text);
      opacity: 0.5;
    }
  `;
  document.head.appendChild(calendarStyles);
}

// 할일 상세 정보 표시
function showTodoDetails(todo) {
  if (!todo) {
    todoDetailsContainer.innerHTML =
      '<p class="empty-state">할일을 선택하면 상세 정보가 표시됩니다</p>';
    return;
  }

  const createdDate = new Date(todo.date);
  const formattedDate = createdDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  todoDetailsContainer.innerHTML = `
    <div class="todo-detail-item">
      <h4>${todo.text}</h4>
      <div class="detail-status ${
        todo.completed ? "completed-status" : "active-status"
      }">
        ${todo.completed ? "완료됨" : "진행중"}
      </div>
      <div class="detail-date">
        <i class="far fa-calendar-alt"></i> 생성일: ${formattedDate}
      </div>
      <div class="detail-notes">
        <h5>메모</h5>
        <p>${todo.notes || "메모가 없습니다."}</p>
      </div>
    </div>
  `;

  // 상세 정보 스타일 추가
  const detailStyles = document.createElement("style");
  detailStyles.textContent = `
    .todo-detail-item {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .todo-detail-item h4 {
      font-size: 18px;
      color: var(--primary-dark);
      margin-bottom: 5px;
    }
    .detail-status {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      width: fit-content;
    }
    .completed-status {
      background: rgba(16, 185, 129, 0.1);
      color: var(--edit-color);
    }
    .active-status {
      background: rgba(99, 102, 241, 0.1);
      color: var(--primary-color);
    }
    .detail-date {
      color: var(--light-text);
      font-size: 14px;
    }
    .detail-notes {
      margin-top: 10px;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      padding-top: 10px;
    }
    .detail-notes h5 {
      font-size: 16px;
      margin-bottom: 5px;
      color: var(--text-color);
    }
    .detail-notes p {
      font-size: 14px;
      color: var(--light-text);
    }
  `;
  document.head.appendChild(detailStyles);
}

// 다크 모드 설정
function setupDarkMode() {
  // 저장된 설정 불러오기
  const savedMode = localStorage.getItem("darkMode");
  if (savedMode === "true") {
    darkModeToggle.checked = true;
    enableDarkMode();
  }

  darkModeToggle.addEventListener("change", () => {
    if (darkModeToggle.checked) {
      enableDarkMode();
      localStorage.setItem("darkMode", "true");
    } else {
      disableDarkMode();
      localStorage.setItem("darkMode", "false");
    }
  });
}

function enableDarkMode() {
  const darkModeStyles = document.createElement("style");
  darkModeStyles.id = "darkModeStyles";
  darkModeStyles.textContent = `
    :root {
      --primary-color: #818cf8;
      --primary-light: #93c5fd;
      --primary-dark: #6366f1;
      --secondary-color: #c084fc;
      --text-color: #f9fafb;
      --light-text: #d1d5db;
      --background-color: #111827;
      --card-background: #1f2937;
      --complete-color: #292524;
    }
    
    body {
      background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #111827 100%);
    }
    
    .container, .left-panel, .right-panel, .todo-input-container, .todo-item,
    .calendar-container, .category-item, .settings-option, .details-placeholder, .chart-container {
      background: #1f2937;
    }
    
    .date-time-display, .filter-tabs button, .stats-section, .quote-section {
      background: rgba(31, 41, 55, 0.8);
    }
    
    .todo-item:hover {
      background: #374151;
    }
    
    .completed {
      background: linear-gradient(to right, #292524, #1f2937);
    }
  `;
  document.head.appendChild(darkModeStyles);
  document.body.classList.add("dark-mode");
}

function disableDarkMode() {
  const darkModeStyles = document.getElementById("darkModeStyles");
  if (darkModeStyles) {
    darkModeStyles.remove();
  }
  document.body.classList.remove("dark-mode");
}

// 카테고리 리스너 설정
function setupCategoryListeners() {
  categoryItems.forEach((item) => {
    if (!item.classList.contains("add-category")) {
      item.addEventListener("click", () => {
        // 모든 카테고리에서 active 클래스 제거
        categoryItems.forEach((cat) => cat.classList.remove("active"));

        // 선택한 카테고리에 active 클래스 추가
        item.classList.add("active");

        // 카테고리에 따른 할일 필터링
        const category = item.getAttribute("data-category");
        filterTodosByCategory(category);
      });
    } else {
      item.addEventListener("click", () => {
        alert("카테고리 추가 기능은 구현 예정입니다.");
      });
    }
  });
}

// 카테고리별 할일 필터링 (데모용 - 실제로는 할일에 카테고리 속성 추가 필요)
function filterTodosByCategory(category) {
  alert(`${category} 카테고리 필터링 기능은 구현 예정입니다.`);
}

// 할 일 UI에 표시 (기존 함수 수정)
function renderTodo(todo) {
  const li = document.createElement("li");
  li.className = "todo-item";
  if (todo.completed) {
    li.classList.add("completed");
  }
  li.id = todo.id;

  const todoText = document.createElement("span");
  todoText.className = "todo-text";
  todoText.textContent = todo.text;

  // 할일 클릭 시 완료 상태 토글 및 상세 정보 표시
  li.addEventListener("click", (e) => {
    // 버튼 클릭은 무시 (버튼에는 각자 이벤트가 있음)
    if (!e.target.closest("button")) {
      toggleComplete(todo.id);

      // 상세 정보 표시 - 해당 할일 정보 가져오기
      const todos = getTodosFromStorage();
      const selectedTodo = todos.find((t) => t.id === todo.id);
      if (selectedTodo) {
        showTodoDetails(selectedTodo);
      }
    }
  });

  const todoActions = document.createElement("div");
  todoActions.className = "todo-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    openEditModal(todo.id, todo.text);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    deleteTodo(todo.id);
  });

  todoActions.appendChild(editBtn);
  todoActions.appendChild(deleteBtn);

  li.appendChild(todoText);
  li.appendChild(todoActions);

  todoList.appendChild(li);
}

// 총 할 일 개수 업데이트
function updateTotalTasks() {
  const todos = getTodosFromStorage();
  totalTasks.textContent = todos.length;
}

// 이벤트 리스너
addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});
closeModal.addEventListener("click", closeEditModal);
saveEditBtn.addEventListener("click", saveEdit);
editInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    saveEdit();
  }
});

// 모달 외부 클릭 시 닫기
window.addEventListener("click", (e) => {
  if (e.target === editModal) {
    closeEditModal();
  }
});
