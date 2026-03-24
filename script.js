let chores = JSON.parse(localStorage.getItem("chores")) || [];

// 템플릿
const templates = {
  "주방": ["설거지", "음식물 쓰레기", "냉장고 정리"],
  "청소": ["바닥 청소", "먼지 닦기", "쓰레기 버리기"],
  "세탁": ["빨래 돌리기", "빨래 널기", "빨래 개기"],
  "욕실": ["변기 청소", "세면대 청소", "샤워부스 청소"]
};

function save() {
  localStorage.setItem("chores", JSON.stringify(chores));
}

// 카테고리 선택
function selectCategory(category) {
  const list = document.getElementById("templateList");
  list.innerHTML = "";

  templates[category].forEach(item => {
    const btn = document.createElement("button");
    btn.innerText = item;
    btn.onclick = () => {
      document.getElementById("title").value = item;
    };
    list.appendChild(btn);
  });
}

// 추가
function addChore() {
  const title = document.getElementById("title").value.trim();
  const user = document.getElementById("user").value;
  const points = Number(document.getElementById("points").value);

  if (!title || !points) return;

  chores.push({
    id: Date.now(),
    title,
    user,
    points,
    done: false
  });

  save();
  render();

  document.getElementById("title").value = "";
  document.getElementById("points").value = "";
}

// 완료
function toggle(id) {
  const chore = chores.find(c => c.id === id);
  chore.done = !chore.done;
  save();
  render();
}

// 화면
function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  let scoreA = 0;
  let scoreB = 0;

  chores.forEach(c => {
    if (c.done) {
      if (c.user === "A") scoreA += c.points;
      else scoreB += c.points;
    }

    const div = document.createElement("div");
    div.className = "card " + (c.done ? "done" : "");

    div.innerHTML = `
      <div>
        <b>${c.title}</b><br/>
        (${c.user}) ${c.points}점
      </div>
      <button class="complete-btn" onclick="toggle(${c.id})">
        ${c.done ? "취소" : "완료"}
      </button>
    `;

    list.appendChild(div);
  });

  document.getElementById("scoreA").innerText = scoreA;
  document.getElementById("scoreB").innerText = scoreB;

  const leader = document.getElementById("leader");

  if (scoreA > scoreB) {
    leader.innerText = "🔥 A가 이기는 중!";
  } else if (scoreB > scoreA) {
    leader.innerText = "🔥 B가 이기는 중!";
  } else {
    leader.innerText = "🤝 동점!";
  }
}

function resetDay() {
  chores = [];
  save();
  render();
}

render();
