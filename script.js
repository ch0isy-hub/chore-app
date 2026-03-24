let chores = JSON.parse(localStorage.getItem("chores")) || [];

function save() {
  localStorage.setItem("chores", JSON.stringify(chores));
}

function addChore() {
  const title = document.getElementById("title").value.trim();
  const user = document.getElementById("user").value;
  const points = Number(document.getElementById("points").value);

  if (!title || !points) {
    alert("내용과 점수를 입력해줘!");
    return;
  }

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

function toggle(id) {
  const chore = chores.find(c => c.id === id);
  chore.done = !chore.done;
  save();
  render();
}

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
    leader.innerText = "🔥 사용자 A가 앞서고 있어!";
  } else if (scoreB > scoreA) {
    leader.innerText = "🔥 사용자 B가 앞서고 있어!";
  } else {
    leader.innerText = "🤝 지금은 동점!";
  }
}

function resetDay() {
  if (confirm("오늘 기록을 초기화할까?")) {
    chores = [];
    save();
    render();
  }
}

render();
