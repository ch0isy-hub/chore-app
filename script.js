let chores = JSON.parse(localStorage.getItem("chores")) || [];

let currentDate = new Date();
let selectedDate = formatDate(new Date());

function save() {
  localStorage.setItem("chores", JSON.stringify(chores));
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// 캘린더
function renderCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById("monthLabel").innerText =
    `${year}년 ${month + 1}월`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendar.innerHTML += "<div></div>";
  }

  for (let d = 1; d <= lastDate; d++) {
    const dateStr = formatDate(new Date(year, month, d));

    const div = document.createElement("div");
    div.className = "day";

    if (dateStr === formatDate(new Date())) div.classList.add("today");
    if (dateStr === selectedDate) div.classList.add("selected");

    div.innerText = d;

    div.onclick = () => {
      selectedDate = dateStr;
      renderCalendar();
      renderList();
    };

    calendar.appendChild(div);
  }

  document.getElementById("selectedDate").innerText = selectedDate;
}

// 반복 체크
function isMatch(chore, dateStr) {
  if (chore.date === dateStr) return true;

  if (chore.repeat === "daily") return true;

  if (chore.repeat === "weekly") {
    return new Date(chore.date).getDay() === new Date(dateStr).getDay();
  }

  if (chore.repeat === "monthly") {
    return new Date(chore.date).getDate() === new Date(dateStr).getDate();
  }

  return false;
}

// 리스트
function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  chores
    .filter(c => isMatch(c, selectedDate))
    .forEach(c => {
      const div = document.createElement("div");
      div.className = "card " + (c.done ? "done" : "");

      div.innerHTML = `
        <span>${c.title} (${c.user})</span>
        <div>
          <button onclick="toggle(${c.id})">완료</button>
          <button class="thanks-btn" onclick="thanks('${c.user}')">❤️</button>
        </div>
      `;

      list.appendChild(div);
    });

  updateStats();
}

// 완료
function toggle(id) {
  const chore = chores.find(c => c.id === id);
  chore.done = !chore.done;
  save();
  renderList();
}

// ❤️ 고마워
function thanks(user) {
  alert(user + "에게 고마워!");
}

// 추가
function addChore() {
  const title = document.getElementById("title").value;
  const user = document.getElementById("user").value;
  const points = Number(document.getElementById("points").value);
  const repeat = document.getElementById("repeat").value;

  if (!title) return;

  chores.push({
    id: Date.now(),
    title,
    user,
    points,
    date: selectedDate,
    repeat,
    done: false
  });

  save();
  renderList();
}

// 📊 통계 + 🏆 주간 승자
function updateStats() {
  let a = 0, b = 0;

  chores.forEach(c => {
    if (c.done) {
      if (c.user === "A") a += c.points;
      else b += c.points;
    }
  });

  document.getElementById("stats").innerText =
    `A: ${a}점 | B: ${b}점`;

  const winner = document.getElementById("weeklyWinner");

  if (a > b) winner.innerText = "🏆 이번 주 승자: A";
  else if (b > a) winner.innerText = "🏆 이번 주 승자: B";
  else winner.innerText = "🤝 동점";
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

renderCalendar();
renderList();
