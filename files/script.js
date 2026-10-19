// Common Thread WIP: 여러 정적 페이지가 브라우저 데이터를 공유합니다.
// 현재는 설명 가능한 키워드 규칙을 사용하며, 이후 AI API로 교체할 수 있습니다.

const BOOKS_KEY = "common-thread-books-v2";
const QUESTIONS_KEY = "common-thread-questions-v2";
const seedQuestions = [
  { id: "seed-1", contributor: "민아", work: { title: "나를 보내지 마", type: "book", rating: 5 }, question: "다른 대안을 상상할 수 없다면 부당한 체제에 저항할 수 있을까?", createdAt: "2026-10-12T10:00:00+09:00" },
  { id: "seed-2", contributor: "준", work: { title: "국가", type: "book", rating: 4 }, question: "개인의 자유를 제한하는 것이 정의로운 사회를 만들 수 있을까?", createdAt: "2026-10-13T14:00:00+09:00" },
  { id: "seed-3", contributor: "아샤", work: { title: "기생충", type: "film", rating: 5 }, question: "불공정한 체제 안에서 내린 해로운 선택에 개인은 얼마나 책임이 있을까?", createdAt: "2026-10-16T20:00:00+09:00" },
  { id: "seed-4", contributor: "솔", work: { title: "패스트 라이브즈", type: "film", rating: 4 }, question: "선택하지 않은 삶도 여전히 나의 일부로 남아 있을까?", createdAt: "2026-10-14T18:00:00+09:00" },
  { id: "seed-5", contributor: "노아", work: { title: "채식주의자", type: "book", rating: 4 }, question: "타인의 기대를 거부하는 행동은 언제 자유가 될까?", createdAt: "2026-10-18T09:00:00+09:00" },
  { id: "seed-6", contributor: "유나", work: { title: "문어의 영혼", type: "book", rating: 5 }, question: "문어는 의식과 해양 생명에 대한 우리의 책임을 어떻게 다시 생각하게 할까?", createdAt: "2026-10-17T16:00:00+09:00" },
  { id: "seed-7", contributor: "테오", work: { title: "토성의 고리", type: "book", rating: 4 }, question: "여행은 낯선 장소를 어떻게 나의 기억과 연결할까?", createdAt: "2026-10-15T11:00:00+09:00" }
];

const themeLexicon = {
  "해양 생물학": ["marine", "ocean", "sea", "fish", "octopus", "coral", "whale", "reef", "해양", "바다", "물고기", "문어", "산호", "고래"],
  "여행": ["travel", "journey", "place", "country", "foreign", "border", "abroad", "migration", "여행", "장소", "낯선", "국가", "국경", "이주"],
  "정의": ["justice", "just", "fair", "unfair", "unjust", "equality", "rights", "정의", "공정", "부당", "불공정", "평등", "권리"],
  "정치와 사회": ["system", "society", "structure", "institution", "rule", "class", "power", "government", "체제", "사회", "구조", "제도", "계급", "권력", "정부"],
  "자유": ["free", "freedom", "choice", "choose", "control", "escape", "resist", "자유", "선택", "통제", "탈출", "저항", "거부"],
  "책임": ["responsible", "responsibility", "fault", "blame", "moral", "forgive", "guilt", "책임", "잘못", "도덕", "용서", "죄책감", "해로운"],
  "정체성": ["identity", "self", "person", "myself", "same", "become", "who", "정체성", "자아", "사람", "자신", "나의 일부"],
  "기억": ["memory", "memories", "remember", "forget", "past", "history", "기억", "과거", "역사", "잊"],
  "관계": ["love", "care", "relationship", "family", "intimacy", "belong", "community", "사랑", "관계", "가족", "돌봄", "소속", "공동체"],
  "자연": ["nature", "animal", "environment", "earth", "forest", "climate", "species", "life", "자연", "동물", "환경", "지구", "숲", "기후", "생명"],
  "기술": ["technology", "digital", "computer", "internet", "robot", "ai", "machine", "data", "기술", "디지털", "컴퓨터", "인터넷", "로봇", "인공지능", "데이터"],
  "예술과 창작": ["art", "artist", "creative", "music", "dance", "film", "story", "writing", "예술", "창작", "음악", "춤", "영화", "이야기", "글쓰기"],
  "진실": ["truth", "true", "real", "reality", "lie", "knowledge", "진실", "현실", "거짓", "지식"],
  "죽음과 상실": ["loss", "lose", "death", "ending", "grief", "mortal", "상실", "죽음", "끝", "슬픔"],
  "변화": ["change", "transform", "future", "alternative", "possibility", "변화", "미래", "대안", "가능성"],
  "의미": ["meaning", "meaningful", "purpose", "matter", "value", "의미", "목적", "가치"]
};

const portraitLanguage = {
  "자유": { title: "나는 한계에 부딪힌 삶에 끌리는 독자다.", phrase: "자유와 제약 사이의 위태로운 공간", symbol: "◇" },
  "정치와 사회": { title: "나는 체제 안의 사람을 바라보는 독자다.", phrase: "사회 구조가 평범한 선택 안으로 들어오는 방식", symbol: "⌗" },
  "책임": { title: "나는 쉽게 결백을 선언하지 않는 독자다.", phrase: "모든 선택이 불완전할 때 서로에게 지는 책임", symbol: "△" },
  "정체성": { title: "나는 움직이는 자아를 바라보는 독자다.", phrase: "과거의 나와 되어가는 나 사이의 거리", symbol: "◐" },
  "기억": { title: "나는 기억이 남긴 흔적을 따라가는 독자다.", phrase: "기억과 망각이 한 사람의 삶을 다시 만드는 방식", symbol: "⌁" },
  "관계": { title: "나는 관계를 어려운 질문으로 읽는 독자다.", phrase: "돌봄 안에 숨은 의무와 거절, 희생", symbol: "♡" },
  "정의": { title: "나는 질서의 비용을 계속 묻는 독자다.", phrase: "안정된 세계 아래 충돌하는 공정함의 기준", symbol: "⚖" },
  "진실": { title: "나는 완전한 설명을 의심하는 독자다.", phrase: "확신이 편안해질 때 생겨나는 의심", symbol: "◉" },
  "죽음과 상실": { title: "나는 상실 뒤에 남은 것을 듣는 독자다.", phrase: "바꿀 수 없는 끝에서 사람들이 만드는 의미", symbol: "◌" },
  "여행": { title: "나는 이동을 통해 장소를 이해하는 독자다.", phrase: "여정이 집의 의미를 바꾸는 방식", symbol: "↗" },
  "해양 생물학": { title: "나는 인간 너머의 세계를 바라보는 독자다.", phrase: "해양 생명의 낯선 지능과 취약함", symbol: "≈" },
  "자연": { title: "나는 인간 너머의 세계에 귀 기울이는 독자다.", phrase: "인간의 삶이 자연과 얽혀 있는 방식", symbol: "❋" },
  "기술": { title: "나는 도구가 환경이 되는 순간을 보는 독자다.", phrase: "기술이 선택과 주의를 바꾸는 방식", symbol: "⌘" },
  "예술과 창작": { title: "나는 무언가를 만들어내는 행위를 따라가는 독자다.", phrase: "상상이 경험을 다른 형태로 바꾸는 방식", symbol: "✺" },
  "변화": { title: "나는 변화가 가능해지는 순간을 찾는 독자다.", phrase: "반복과 변화 사이를 가르는 선택", symbol: "↝" },
  "의미": { title: "나는 확신 없이도 의미를 찾는 독자다.", phrase: "최종 답이 없어도 삶과 행동이 중요한 이유", symbol: "✦" },
  default: { title: "나는 아직 독자가 되어가는 중이다.", phrase: "이야기가 끝난 뒤에도 계속되는 질문", symbol: "◌" }
};

const workKnowledgeBase = [
  { aliases: ["나를 보내지 마", "never let me go"], genres: ["디스토피아", "SF", "문학소설"], themes: ["정체성", "자유", "기술", "죽음과 상실"], prompt: "인간답게 산다는 것은 선택할 수 있다는 뜻일까?" },
  { aliases: ["국가", "the republic", "plato republic"], genres: ["철학", "정치사상"], themes: ["정의", "정치와 사회", "자유"], prompt: "좋은 사회를 위해 개인의 자유는 어디까지 제한될 수 있을까?" },
  { aliases: ["기생충", "parasite"], genres: ["사회극", "스릴러"], themes: ["정치와 사회", "정의", "책임"], prompt: "불평등한 구조 안에서 개인의 선택은 어디까지 개인의 책임일까?" },
  { aliases: ["패스트 라이브즈", "past lives"], genres: ["로맨스", "드라마"], themes: ["관계", "기억", "정체성"], prompt: "선택하지 않은 삶도 현재의 나를 이루고 있을까?" },
  { aliases: ["채식주의자", "the vegetarian"], genres: ["문학소설", "심리"], themes: ["자유", "정체성", "관계"], prompt: "타인의 기대를 거부하는 행동은 언제 자기 자신을 지키는 일이 될까?" },
  { aliases: ["문어의 영혼", "the soul of an octopus"], genres: ["논픽션", "자연과학"], themes: ["해양 생물학", "자연", "책임"], prompt: "인간과 다른 방식의 지능을 우리는 어떻게 이해해야 할까?" },
  { aliases: ["토성의 고리", "the rings of saturn"], genres: ["여행문학", "에세이"], themes: ["여행", "기억", "죽음과 상실"], prompt: "장소를 여행하는 일은 과거를 다시 읽는 일이 될 수 있을까?" }
];

const naturalPortraitTitles = {
  "정의": "내 질문은 ‘무엇이 공정한가’로 자주 돌아온다.",
  "정치와 사회": "내 질문은 개인의 선택 뒤에 있는 사회 구조로 향한다.",
  "자유": "내 질문은 주어진 조건 안에서 가능한 자유를 향한다.",
  "책임": "내 질문은 어려운 선택의 책임이 누구에게 있는지 묻는다.",
  "정체성": "내 질문은 달라지고도 같은 사람으로 남을 수 있는지 묻는다.",
  "기억": "내 질문은 기억이 현재의 나를 어떻게 바꾸는지 살핀다.",
  "관계": "내 질문은 애정과 거리, 돌봄의 책임 사이를 오간다.",
  "여행": "내 질문은 낯선 장소가 익숙한 삶을 바꾸는 순간으로 향한다.",
  "해양 생물학": "내 질문은 인간과 다른 생명의 감각을 상상하는 데 머문다.",
  "자연": "내 질문은 인간의 삶과 자연이 얽힌 지점을 향한다.",
  "기술": "내 질문은 기술이 선택과 관계를 어떻게 바꾸는지 묻는다.",
  "예술과 창작": "내 질문은 경험이 이야기와 이미지가 되는 순간으로 향한다.",
  "진실": "내 질문은 하나의 설명보다 충돌하는 관점 사이에 머문다.",
  "죽음과 상실": "내 질문은 사라진 뒤에도 남는 것을 향한다.",
  "변화": "내 질문은 사람이 달라질 수 있는 순간을 찾는다.",
  "의미": "내 질문은 답이 없어도 무엇이 삶을 중요하게 만드는지 묻는다."
};

const themeQuestionPatterns = {
  "정의": "무엇이 공정한가, 그리고 그 기준은 누구에게 유리한가?",
  "정치와 사회": "개인의 선택은 사회 구조로부터 얼마나 자유로울 수 있을까?",
  "자유": "타인의 기대를 거부하는 것은 언제 진정한 자유가 될까?",
  "책임": "좋은 선택지가 없을 때에도 우리는 결과를 책임져야 할까?",
  "정체성": "변화한 뒤에도 나는 여전히 같은 사람이라고 할 수 있을까?",
  "기억": "기억이 달라지면 과거와 현재의 나도 달라질까?",
  "관계": "사랑과 돌봄은 어디까지 서로에 대한 의무가 될까?",
  "여행": "낯선 장소는 내가 살던 곳을 어떻게 다르게 보게 할까?",
  "해양 생물학": "인간과 다른 지능을 이해하려면 어떤 관점이 필요할까?",
  "자연": "인간의 필요는 다른 생명의 권리보다 언제 우선할 수 있을까?",
  "기술": "기술이 대신 내린 선택을 나의 선택이라고 할 수 있을까?",
  "예술과 창작": "경험을 이야기로 바꾸는 순간 무엇이 새롭게 만들어질까?",
  "진실": "하나의 사건을 서로 다르게 기억한다면 무엇을 진실이라 부를까?",
  "죽음과 상실": "되돌릴 수 없는 끝 이후에도 의미는 새로 만들어질 수 있을까?",
  "변화": "사람을 실제로 변화시키는 것은 이해일까, 행동일까?",
  "의미": "명확한 답이 없어도 어떤 선택은 왜 중요하게 남을까?"
};

let books = loadData(BOOKS_KEY);
let userQuestions = loadData(QUESTIONS_KEY);
let activeConnection = null;

initializePage();

function initializePage() {
  bindBookForm();
  bindQuickQuestionForm();
  bindReset();

  if (document.querySelector("#personal-shelf")) renderShelf();
  if (document.querySelector("#community-shelf")) renderCommunityShelf();
  if (document.querySelector("#constellation-svg")) renderConstellation([...seedQuestions, ...userQuestions]);
}

function bindBookForm() {
  const form = document.querySelector("#book-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.querySelector("#book-title").value.trim();
    if (!title) return;
    const book = {
      id: `book-${Date.now()}`,
      title,
      creator: document.querySelector("#book-creator").value.trim(),
      type: document.querySelector("#book-type").value,
      rating: Number(document.querySelector("#book-rating").value)
    };
    books.unshift(book);
    saveData(BOOKS_KEY, books);
    const optionalQuestion = document.querySelector("#book-question").value.trim();
    if (optionalQuestion) {
      userQuestions.unshift(makeQuestion(optionalQuestion, "나", book));
      saveData(QUESTIONS_KEY, userQuestions);
    }
    form.reset();
    document.querySelector("#book-rating").value = "5";
    flashMessage("#book-form-message", optionalQuestion ? "작품과 질문을 추가했습니다." : "작품을 추가했습니다. 질문은 언제든 남길 수 있습니다.");
    renderShelf();
  });

}

function bindQuickQuestionForm() {
  const form = document.querySelector("#quick-question-form");
  if (!form) return;
  const input = document.querySelector("#map-question-input");
  input.addEventListener("input", () => { document.querySelector("#map-question-count").textContent = `${input.value.length} / 240`; });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    const entry = makeQuestion(question, "나", null);
    userQuestions.unshift(entry);
    saveData(QUESTIONS_KEY, userQuestions);
    const targetId = new URLSearchParams(window.location.search).get("connect");
    const targetQuery = targetId ? `&connect=${encodeURIComponent(targetId)}` : "";
    window.location.href = `constellation.html?question=${encodeURIComponent(entry.id)}${targetQuery}`;
  });
}

function bindReset() {
  document.querySelector("#reset-data")?.addEventListener("click", () => {
    if (!window.confirm("이 브라우저에 추가한 작품과 질문을 삭제할까요? 다른 독자의 예시 기록은 남아 있습니다.")) return;
    books = [];
    userQuestions = [];
    localStorage.removeItem(BOOKS_KEY);
    localStorage.removeItem(QUESTIONS_KEY);
    renderShelf();
  });
}

function renderShelf() {
  const shelf = document.querySelector("#personal-shelf");
  if (!shelf) return;
  renderShelfThemes();
  const count = document.querySelector("#shelf-count");
  if (count) count.textContent = `작품 ${books.length}개`;
  shelf.replaceChildren();
  if (!books.length) {
    const empty = document.createElement("p");
    empty.className = "shelf-empty";
    empty.textContent = "저장한 작품이 여기에 표시됩니다.";
    shelf.appendChild(empty);
    return;
  }
  books.forEach((book) => {
    const linkedQuestion = findQuestionForBook(book);
    const item = document.createElement("article");
    item.className = "shelf-item";
    const icon = makeElement("span", "shelf-icon", book.type === "film" ? "▶" : book.type === "series" ? "▦" : "▤");
    const copy = document.createElement("div"); copy.className = "shelf-copy";
    copy.append(makeElement("strong", "", book.title), makeElement("span", "", book.creator || typeLabel(book.type)));
    const actions = document.createElement("div"); actions.className = "shelf-actions";
    const rating = makeElement("span", "shelf-rating", `${book.rating}/5`);
    const editButton = makeElement("button", "shelf-question-button", "작품 수정"); editButton.type = "button";
    actions.append(rating, editButton); item.append(icon, copy, actions);

    const questionArea = document.createElement("div"); questionArea.className = "shelf-question-area";
    if (linkedQuestion) {
      questionArea.appendChild(makeElement("blockquote", "shelf-question-preview", `“${linkedQuestion.question}”`));
      const findLink = makeElement("a", "shelf-find-link", "이 질문으로 연결 찾기 →");
      findLink.href = `constellation.html?question=${encodeURIComponent(linkedQuestion.id)}`;
      questionArea.appendChild(findLink);
    } else {
      questionArea.appendChild(makeElement("p", "shelf-question-placeholder", "아직 이 작품에 연결된 질문이 없습니다."));
    }

    const editor = document.createElement("form"); editor.className = "shelf-question-editor shelf-book-editor"; editor.hidden = true;
    const fields = document.createElement("div"); fields.className = "shelf-edit-fields";
    const titleLabel = makeEditorLabel("제목");
    const titleInput = document.createElement("input"); titleInput.type = "text"; titleInput.required = true; titleInput.value = book.title; titleLabel.appendChild(titleInput);
    const creatorLabel = makeEditorLabel("창작자");
    const creatorInput = document.createElement("input"); creatorInput.type = "text"; creatorInput.value = book.creator || ""; creatorLabel.appendChild(creatorInput);
    const typeLabelElement = makeEditorLabel("형식");
    const typeSelect = document.createElement("select");
    [["book", "책"], ["film", "영화"], ["series", "시리즈"]].forEach(([value, label]) => typeSelect.appendChild(new Option(label, value)));
    typeSelect.value = book.type; typeLabelElement.appendChild(typeSelect);
    const ratingLabel = makeEditorLabel("평점");
    const ratingSelect = document.createElement("select");
    [5, 4, 3, 2, 1].forEach((value) => ratingSelect.appendChild(new Option(`${value} / 5`, String(value))));
    ratingSelect.value = String(book.rating); ratingLabel.appendChild(ratingSelect);
    fields.append(titleLabel, creatorLabel, typeLabelElement, ratingLabel);
    const questionLabel = makeEditorLabel("이 작품이 내게 남긴 질문 · 비워두면 질문이 삭제됩니다"); questionLabel.className = "shelf-edit-question";
    const textarea = document.createElement("textarea"); textarea.rows = 3; textarea.maxLength = 240;
    textarea.placeholder = "이 작품은 무엇을 다시 생각하게 했나요?"; textarea.value = linkedQuestion?.question || ""; questionLabel.appendChild(textarea);
    const editorActions = document.createElement("div"); editorActions.className = "shelf-editor-actions";
    const cancel = makeElement("button", "text-button", "취소"); cancel.type = "button";
    const save = makeElement("button", "shelf-question-button primary-small", "변경사항 저장"); save.type = "submit";
    editorActions.append(cancel, save); editor.append(fields, questionLabel, editorActions);

    editButton.addEventListener("click", () => { editor.hidden = false; questionArea.hidden = true; titleInput.focus(); });
    cancel.addEventListener("click", () => { editor.hidden = true; questionArea.hidden = false; });
    editor.addEventListener("submit", (event) => {
      event.preventDefault();
      const oldTitle = book.title;
      book.title = titleInput.value.trim();
      if (!book.title) return;
      book.creator = creatorInput.value.trim();
      book.type = typeSelect.value;
      book.rating = Number(ratingSelect.value);
      const updatedWork = { id: book.id, title: book.title, type: book.type, rating: book.rating };
      userQuestions.forEach((entry) => {
        if (entry.work?.id === book.id || (!entry.work?.id && entry.work?.title === oldTitle)) entry.work = { ...updatedWork };
      });
      const text = textarea.value.trim();
      if (linkedQuestion && text) {
        linkedQuestion.question = text;
        linkedQuestion.work = { ...updatedWork };
        linkedQuestion.updatedAt = new Date().toISOString();
      } else if (linkedQuestion && !text) {
        userQuestions = userQuestions.filter((entry) => entry.id !== linkedQuestion.id);
      } else if (text) {
        userQuestions.unshift(makeQuestion(text, "나", book));
      }
      saveData(BOOKS_KEY, books);
      saveData(QUESTIONS_KEY, userQuestions);
      renderShelf();
      flashMessage("#book-form-message", "작품과 질문의 변경사항을 저장했습니다.");
    });

    item.append(questionArea, editor); shelf.appendChild(item);
  });
}

function renderShelfThemes() {
  const container = document.querySelector("#shelf-theme-summary");
  const note = document.querySelector("#shelf-theme-note");
  if (!container || !note) return;
  container.replaceChildren();

  if (!userQuestions.length) {
    container.appendChild(makeElement("p", "shelf-theme-empty", "질문을 하나 남기면 이곳에 큰 주제가 나타납니다."));
    note.textContent = "작품의 제목이나 평점이 아니라, 내가 직접 쓴 질문만 살펴봅니다.";
    return;
  }

  const counts = {};
  userQuestions.forEach((entry) => {
    analyzeQuestion(entry.question).forEach((theme) => {
      counts[theme] = (counts[theme] || 0) + 1;
    });
  });
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 6);
  const maximum = Math.max(...ranked.map(([, count]) => count), 1);

  ranked.forEach(([theme, count], index) => {
    const item = document.createElement("div");
    item.className = `shelf-theme-item${index === 0 ? " primary" : ""}`;
    const heading = document.createElement("div");
    heading.append(makeElement("strong", "", theme), makeElement("span", "", `질문 ${count}개`));
    const meter = document.createElement("div");
    meter.className = "shelf-theme-meter";
    const fill = document.createElement("span");
    fill.style.width = `${Math.max(22, count / maximum * 100)}%`;
    meter.appendChild(fill);
    item.append(heading, meter);
    container.appendChild(item);
  });

  note.textContent = `내 질문 ${userQuestions.length}개에서 발견한 주제입니다. 질문을 추가하거나 수정하면 함께 바뀝니다.`;
}

function makeEditorLabel(text) {
  const label = document.createElement("label");
  label.appendChild(makeElement("span", "", text));
  return label;
}

function findQuestionForBook(book) {
  return userQuestions.find((entry) => entry.work?.id === book.id)
    || userQuestions.find((entry) => entry.work?.title === book.title);
}

function renderCommunityShelf() {
  const shelf = document.querySelector("#community-shelf");
  if (!shelf) return;
  shelf.replaceChildren();
  seedQuestions.forEach((entry) => {
    const card = document.createElement("article"); card.className = "community-work-card";
    const profile = document.createElement("div"); profile.className = "community-profile";
    const avatar = makeElement("div", "profile-avatar", avatarInitial(entry.contributor));
    const identity = document.createElement("div");
    identity.append(makeElement("strong", "", entry.contributor), makeElement("span", "", `${typeLabel(entry.work.type)} · ${entry.work.rating}/5`));
    profile.append(avatar, identity);
    const work = makeElement("h3", "", entry.work.title);
    const question = makeElement("blockquote", "", `“${entry.question}”`);
    const questionLink = document.createElement("a"); questionLink.className = "community-question-link";
    questionLink.href = `constellation.html?connect=${encodeURIComponent(entry.id)}`;
    questionLink.setAttribute("aria-label", `${entry.contributor}님의 질문과 연결되기`);
    questionLink.append(question, makeElement("span", "", "이 질문과 이야기하기 →"));
    const themes = document.createElement("div"); themes.className = "archive-themes";
    analyzeQuestion(entry.question).slice(0, 3).forEach((theme) => themes.appendChild(makeElement("span", "", `#${theme}`)));
    card.append(profile, work, questionLink, themes);
    shelf.appendChild(card);
  });
}

function renderPortrait() {
  const title = document.querySelector("#portrait-title");
  const narrative = document.querySelector("#portrait-narrative");
  const themeWrap = document.querySelector("#portrait-themes");
  const genreWrap = document.querySelector("#portrait-genres");
  const questionWrap = document.querySelector("#portrait-question-patterns");
  const sources = document.querySelector("#portrait-sources");
  themeWrap.replaceChildren(); genreWrap.replaceChildren(); questionWrap.replaceChildren(); sources.replaceChildren();

  if (!books.length && !userQuestions.length) {
    title.textContent = "아직 반복되는 질문을 찾는 중입니다.";
    narrative.textContent = "작품 두세 개와 그 작품이 남긴 질문을 추가하면, 연결에 사용할 관심 주제와 장르, 반복되는 생각을 함께 정리할 수 있습니다.";
    document.querySelector("#portrait-symbol").textContent = portraitLanguage.default.symbol;
    themeWrap.appendChild(makeEmptyInsight("작품과 질문을 추가하면 관심 주제가 나타납니다."));
    genreWrap.appendChild(makeEmptyInsight("작품을 추가하면 장르 분포가 나타납니다."));
    questionWrap.appendChild(makeEmptyInsight("질문을 남기면 반복되는 생각을 찾아드립니다."));
    sources.appendChild(makeSource("여기서 시작", "작품 두세 개를 추가해보세요", "작은 기록만으로도 첫 분석을 만들 수 있습니다."));
    return;
  }

  const topBooks = [...books].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const analyzed = userQuestions.map((entry) => ({ ...entry, themes: analyzeQuestion(entry.question) }));
  const enrichedBooks = books.map((book) => ({ ...book, knowledge: findWorkKnowledge(book.title) }));
  const themeScores = {};
  const genreScores = {};

  enrichedBooks.forEach((book) => {
    const genres = book.knowledge?.genres || [typeLabel(book.type)];
    const themes = book.knowledge?.themes || [];
    genres.forEach((genre) => { genreScores[genre] = (genreScores[genre] || 0) + book.rating; });
    themes.forEach((theme) => { themeScores[theme] = (themeScores[theme] || 0) + book.rating; });
  });
  analyzed.forEach((entry) => entry.themes.forEach((theme) => { themeScores[theme] = (themeScores[theme] || 0) + 4; }));

  const rankedThemes = Object.entries(themeScores).sort((a, b) => b[1] - a[1]);
  const rankedGenres = Object.entries(genreScores).sort((a, b) => b[1] - a[1]);
  const primary = rankedThemes[0]?.[0] || "default";
  const secondary = rankedThemes[1]?.[0];
  const language = portraitLanguage[primary] || portraitLanguage.default;
  const titles = naturalList(topBooks.map((book) => book.title));
  const evidenceLead = topBooks.length ? `${titles}과 연결된 기록에서는` : "내가 직접 남긴 질문에서는";

  title.textContent = naturalPortraitTitles[primary] || "내 질문은 아직 한곳에 머물지 않는다.";
  document.querySelector("#portrait-symbol").textContent = language.symbol;
  const secondaryCopy = secondary ? ` 그 곁에는 ${secondary}이 반복됩니다.` : " 다른 주제는 기록이 더 쌓이면 선명해집니다.";
  narrative.textContent = `${evidenceLead} ${language.phrase}이 자주 나타납니다. 가장 강한 주제는 ${primary}입니다.${secondaryCopy} 이 분석은 나를 단정하기 위한 결과가 아니라, 어떤 질문으로 다른 독자와 연결될 수 있는지 보여주는 현재의 지도입니다.`;

  if (rankedThemes.length) renderRankedInsights(themeWrap, rankedThemes.slice(0, 5));
  else themeWrap.appendChild(makeEmptyInsight("질문을 더하거나 데이터베이스에 등록된 작품을 입력하면 관심 주제가 나타납니다."));
  if (rankedGenres.length) renderRankedInsights(genreWrap, rankedGenres.slice(0, 5));
  else genreWrap.appendChild(makeEmptyInsight("작품을 기록하면 자주 선택한 장르가 나타납니다."));

  if (userQuestions[0]) questionWrap.appendChild(makeQuestionPattern("내가 직접 남긴 질문", userQuestions[0].question));
  if (themeQuestionPatterns[primary]) questionWrap.appendChild(makeQuestionPattern("반복되는 관심에서", themeQuestionPatterns[primary]));
  const databaseBook = [...enrichedBooks].sort((a, b) => b.rating - a.rating).find((book) => book.knowledge?.prompt);
  const databasePrompt = databaseBook?.knowledge?.prompt;
  if (databasePrompt) questionWrap.appendChild(makeQuestionPattern("작품 데이터베이스에서", databasePrompt));
  if (!questionWrap.children.length) questionWrap.appendChild(makeEmptyInsight("작품에 질문을 연결하면 생각의 패턴을 더 정확히 볼 수 있습니다."));

  topBooks.forEach((book, index) => {
    const knowledge = findWorkKnowledge(book.title);
    const metadata = knowledge?.genres.join(" · ") || typeLabel(book.type);
    sources.appendChild(makeSource(index === 0 ? "가장 높은 평점" : "분석에 포함된 작품", book.title, `${metadata} · ${book.rating}/5${book.creator ? ` · ${book.creator}` : ""}`));
  });
  if (!topBooks.length) sources.appendChild(makeSource("질문에서 시작", `저장한 질문 ${userQuestions.length}개`, "작품을 추가하면 장르와 작품 데이터도 함께 분석합니다."));
}

function findWorkKnowledge(title) {
  const normalized = normalizeTitle(title);
  return workKnowledgeBase.find((item) => item.aliases.some((alias) => normalizeTitle(alias) === normalized)) || null;
}

function normalizeTitle(title) {
  return String(title || "").toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
}

function renderRankedInsights(container, entries) {
  const max = Math.max(...entries.map(([, score]) => score), 1);
  entries.forEach(([label, score], index) => {
    const row = document.createElement("div"); row.className = "ranked-insight";
    const heading = document.createElement("div"); heading.className = "ranked-insight-heading";
    heading.append(makeElement("strong", "", label), makeElement("span", "", index === 0 ? "가장 강함" : `관심도 ${score}`));
    const track = document.createElement("div"); track.className = "insight-track";
    const fill = document.createElement("span"); fill.style.width = `${Math.max(18, score / max * 100)}%`; track.appendChild(fill);
    row.append(heading, track); container.appendChild(row);
  });
}

function makeQuestionPattern(label, question) {
  const item = document.createElement("div"); item.className = "question-pattern";
  item.append(makeElement("span", "", label), makeElement("p", "", question)); return item;
}

function makeEmptyInsight(text) { return makeElement("p", "insight-empty", text); }

function renderConstellation(questions) {
  const analyzed = questions.map((entry) => ({ ...entry, themes: analyzeQuestion(entry.question) }));
  const categories = calculateCategoryStrength(analyzed).slice(0, 9);
  document.querySelector("#question-total").textContent = questions.length;
  document.querySelector("#work-total").textContent = new Set(questions.filter((q) => q.work).map((q) => q.work.title.toLowerCase())).size;
  document.querySelector("#theme-total").textContent = categories.length;
  renderThemeChips(categories.map((category) => [category.name, category.count]));
  drawInterestMap(analyzed, categories);
  bindConnectionControls(analyzed);
  const connectId = new URLSearchParams(window.location.search).get("connect");
  const target = analyzed.find((entry) => entry.id === connectId && entry.contributor !== "나");
  if (target) {
    connectToSelectedPerson(target, analyzed);
    return;
  }
  const requestedId = new URLSearchParams(window.location.search).get("question");
  const requested = analyzed.find((entry) => entry.id === requestedId);
  if (requested) selectConnectionSource(requested, analyzed);
}

function analyzeQuestion(text) {
  const normalized = text.toLowerCase().replace(/[^a-z0-9가-힣\s'-]/g, " ");
  const words = normalized.split(/\s+/).filter(Boolean);
  const matched = Object.entries(themeLexicon).map(([theme, vocabulary]) => ({
    theme,
    score: vocabulary.reduce((n, keyword) => n + ((/[가-힣]/.test(keyword) ? normalized.includes(keyword) : words.includes(keyword)) ? 1 : 0), 0)
  })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).map((item) => item.theme);
  return matched.length ? matched.slice(0, 4) : ["그 밖의 질문"];
}

function countThemes(entries) {
  const counts = {};
  entries.forEach((entry) => entry.themes.forEach((theme) => { counts[theme] = (counts[theme] || 0) + 1; }));
  return counts;
}

function renderThemeChips(themes) {
  const container = document.querySelector("#keyword-list"); container.replaceChildren();
  themes.forEach(([theme, count], index) => container.appendChild(makeElement("span", `keyword-chip ${index < 2 ? "primary" : ""}`, `${theme} · ${count}`)));
}

function calculateCategoryStrength(entries) {
  const categories = {};
  entries.forEach((entry) => {
    const rating = Number(entry.work?.rating || 3);
    const activity = freshnessScore(entry.createdAt || entry.updatedAt);
    entry.themes.forEach((name) => {
      if (!categories[name]) categories[name] = { name, count: 0, strength: 0, ratingTotal: 0, activityTotal: 0 };
      categories[name].count += 1;
      categories[name].strength += rating;
      categories[name].ratingTotal += rating;
      categories[name].activityTotal += activity;
    });
  });
  return Object.values(categories)
    .map((category) => ({ ...category, averageRating: category.ratingTotal / category.count, activity: category.activityTotal / category.count }))
    .sort((a, b) => b.count - a.count || b.activity - a.activity);
}

function freshnessScore(dateValue) {
  if (!dateValue) return .42;
  const days = Math.max(0, (Date.now() - new Date(dateValue).getTime()) / 86400000);
  return Math.max(.2, 1 - days / 30);
}

function drawInterestMap(entries, categories) {
  const svg = document.querySelector("#constellation-svg");
  const tooltip = document.querySelector("#node-tooltip");
  svg.replaceChildren();
  const positions = [[500,350],[245,205],[755,205],[245,500],[755,500],[500,105],[500,600],[95,350],[905,350]];
  const colors = ["#9887ff", "#55d6be", "#ff967a", "#f4cf77", "#70a7ff", "#db7cff", "#62d3ff", "#ff79ad", "#a5e875"];
  const maxCount = Math.max(...categories.map((category) => category.count), 1);

  categories.forEach((category, index) => {
    const [x, y] = positions[index];
    const normalized = Math.sqrt(category.count / maxCount);
    const radius = 38 + normalized * 58;
    const color = colors[index % colors.length];
    const group = createSvg("g", { class: `category-group${index === 0 ? " selected" : ""}`, tabindex: "0", role: "button", "aria-label": `${category.name}, 질문 ${category.count}개` });
    group.dataset.category = category.name;
    group.style.setProperty("--category-color", color);
    group.appendChild(createSvg("circle", { cx: x, cy: y, r: radius + 18, class: "category-halo", style: `opacity:${.16 + category.activity * .5}` }));
    group.appendChild(createSvg("circle", { cx: x, cy: y, r: radius, class: "category-node" }));
    const label = createSvg("text", { x, y: y - 3, class: "category-label", "text-anchor": "middle" }); label.textContent = category.name; group.appendChild(label);
    const detail = createSvg("text", { x, y: y + 20, class: "category-count", "text-anchor": "middle" }); detail.textContent = `질문 ${category.count}개`; group.appendChild(detail);
    const select = () => {
      document.querySelectorAll(".category-group").forEach((node) => node.classList.remove("selected"));
      group.classList.add("selected");
      renderCategoryDetails(category, entries);
    };
    group.addEventListener("click", select);
    group.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(); } });
    group.addEventListener("pointerenter", (event) => showCategoryTooltip(event, category, tooltip));
    group.addEventListener("pointermove", (event) => positionTooltip(event, tooltip));
    group.addEventListener("pointerleave", () => { tooltip.hidden = true; });
    svg.appendChild(group);
  });
  if (categories[0]) renderCategoryDetails(categories[0], entries);
}

function renderCategoryDetails(category, entries) {
  const panel = document.querySelector("#category-detail");
  const list = document.querySelector("#category-question-list");
  const related = entries.filter((entry) => entry.themes.includes(category.name));
  const ownIds = new Set(userQuestions.map((entry) => entry.id));
  related.sort((a, b) => Number(ownIds.has(b.id)) - Number(ownIds.has(a.id)));
  document.querySelector("#selected-category-name").textContent = category.name;
  document.querySelector("#selected-category-strength").textContent = `질문 ${category.count}개 · 최근 활동 ${activityLabel(category.activity)}`;
  list.replaceChildren();
  related.forEach((entry) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "category-question-card";
    button.append(makeElement("span", "", ownIds.has(entry.id) ? "나의 질문" : displayName(entry.contributor)), makeElement("strong", "", entry.question), makeElement("small", "", entry.work?.title || "연결된 작품 없음"));
    button.addEventListener("click", () => {
      document.querySelectorAll(".category-question-card").forEach((card) => card.classList.remove("selected"));
      button.classList.add("selected");
      selectConversationPair(entry, entries);
    });
    list.appendChild(button);
  });
  panel.hidden = false;
  const ownQuestion = related.find((entry) => ownIds.has(entry.id));
  if (ownQuestion) selectConversationPair(ownQuestion, entries, false);
}

function showCategoryTooltip(event, category, tooltip) {
  tooltip.replaceChildren(makeElement("strong", "", category.name), document.createTextNode(`질문 ${category.count}개 · 최근 활동 ${activityLabel(category.activity)}`), makeElement("span", "", "크기 = 질문 수 · 빛 = 최근 질문 활동"));
  tooltip.hidden = false; positionTooltip(event, tooltip);
}

function activityLabel(activity) {
  if (activity > .72) return "활발함";
  if (activity > .45) return "이어지는 중";
  return "기록됨";
}

function bindConnectionControls(entries) {
  const sampleButton = document.querySelector("#try-sample-connection");
  const chatButton = document.querySelector("#start-chat");
  if (!sampleButton || sampleButton.dataset.bound) return;
  sampleButton.dataset.bound = "true";

  sampleButton.addEventListener("click", () => {
    if (sampleButton.dataset.action === "write-question") {
      document.querySelector("#map-question-input")?.focus();
      document.querySelector(".quick-question-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    selectConversationPair(entries.find((entry) => entry.id === userQuestions[0]?.id) || entries[0], entries);
  });
  chatButton.addEventListener("click", () => {
    if (!activeConnection) return;
    const match = activeConnection.matches[activeConnection.matchIndex];
    chatButton.disabled = true;
    chatButton.textContent = "채팅 요청 완료";
    document.querySelector("#chat-message").textContent = `${displayName(match.contributor)}님과의 채팅 화면이 여기에 연결될 예정입니다.`;
  });
}

function connectToSelectedPerson(target, entries) {
  const ownIds = new Set(userQuestions.map((entry) => entry.id));
  const ownQuestion = entries
    .filter((entry) => ownIds.has(entry.id))
    .map((entry) => ({ ...entry, connectionScore: scoreConnection(entry, target) }))
    .sort((a, b) => b.connectionScore - a.connectionScore)[0];

  if (!ownQuestion) {
    const empty = document.querySelector("#connection-empty");
    document.querySelector("#connection-result").hidden = true;
    empty.hidden = false;
    empty.querySelector("p").textContent = `${displayName(target.contributor)}님의 질문과 연결하려면 먼저 나의 질문을 하나 남겨주세요.`;
    const button = document.querySelector("#try-sample-connection");
    button.textContent = "내 질문 입력하기";
    button.dataset.action = "write-question";
    document.querySelector("#connection-lab").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  activeConnection = { source: ownQuestion, matches: [target], matchIndex: 0 };
  showConnection(ownQuestion, target);
  document.querySelector("#connection-lab").scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectConversationPair(selected, entries, shouldScroll = true) {
  if (!selected) return;
  const ownIds = new Set(userQuestions.map((entry) => entry.id));
  const isOwnQuestion = ownIds.has(selected.id);

  if (isOwnQuestion) {
    selectConnectionSource(selected, entries, shouldScroll);
    return;
  }

  const bestOwnQuestion = entries
    .filter((entry) => ownIds.has(entry.id) && entry.contributor !== selected.contributor)
    .map((entry) => ({ ...entry, connectionScore: scoreConnection(entry, selected) }))
    .sort((a, b) => b.connectionScore - a.connectionScore || hashString(a.id + selected.id) - hashString(b.id + selected.id))[0];

  if (bestOwnQuestion) {
    activeConnection = { source: bestOwnQuestion, matches: [selected], matchIndex: 0 };
    showConnection(bestOwnQuestion, selected);
  } else {
    selectConnectionSource(selected, entries, false);
  }

  if (shouldScroll) document.querySelector("#connection-lab").scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectConnectionSource(source, entries, shouldScroll = true) {
  if (!source) return;
  const candidates = entries
    .filter((entry) => entry.id !== source.id && entry.contributor !== source.contributor)
    .map((entry) => ({ ...entry, connectionScore: scoreConnection(source, entry) }))
    .sort((a, b) => b.connectionScore - a.connectionScore || hashString(source.id + a.id) - hashString(source.id + b.id));
  if (!candidates.length) return;
  activeConnection = { source, matches: candidates, matchIndex: 0 };
  showConnection(source, candidates[0]);
  if (shouldScroll) document.querySelector("#connection-lab").scrollIntoView({ behavior: "smooth", block: "start" });
}

function scoreConnection(source, candidate) {
  const shared = source.themes.filter((theme) => candidate.themes.includes(theme));
  const distinct = candidate.themes.filter((theme) => !source.themes.includes(theme));
  const mutualInterest = shared.length ? shared.length * 20 : -100;
  const conversationPotential = shared.length && distinct.length ? Math.min(distinct.length, 2) * 3 : 0;
  return mutualInterest + conversationPotential + Number(candidate.work?.rating || 3) / 10;
}

function showConnection(source, match) {
  const shared = source.themes.filter((theme) => match.themes.includes(theme));
  const sourceDistinct = source.themes.find((theme) => !match.themes.includes(theme));
  const matchDistinct = match.themes.find((theme) => !source.themes.includes(theme));
  const common = shared[0] || source.themes[0] || "서로 다른 관점";
  const contrast = matchDistinct || match.themes[1];

  document.querySelector("#connection-empty").hidden = true;
  document.querySelector("#connection-result").hidden = false;
  document.querySelector("#source-person").textContent = displayName(source.contributor);
  document.querySelector("#source-avatar").textContent = avatarInitial(displayName(source.contributor));
  document.querySelector("#source-question").textContent = `“${source.question}”`;
  document.querySelector("#source-work").textContent = formatWork(source);
  document.querySelector("#match-person").textContent = displayName(match.contributor);
  document.querySelector("#match-avatar").textContent = avatarInitial(displayName(match.contributor));
  document.querySelector("#match-question").textContent = `“${match.question}”`;
  document.querySelector("#match-work").textContent = formatWork(match);
  const reason = document.querySelector("#connection-reason-copy");
  if (shared.length && sourceDistinct && matchDistinct) {
    reason.textContent = `${displayName(source.contributor)}님과 ${displayName(match.contributor)}님은 모두 ${common}에 관심이 있습니다. 첫 질문은 ${sourceDistinct}에서, 두 번째 질문은 ${matchDistinct}에서 출발하기 때문에 같은 관심사를 반복하기보다 서로의 관점을 넓힐 수 있는 조합입니다.`;
  } else if (shared.length) {
    reason.textContent = `${displayName(source.contributor)}님과 ${displayName(match.contributor)}님의 질문은 ${shared.join(", ")}이라는 관심사를 공유합니다. 서로 다른 작품과 상황에서 출발하므로 같은 결론을 확인하기보다 각자의 기준이 어디에서 갈리는지 이야기해볼 수 있습니다.`;
  } else {
    reason.textContent = `두 질문의 표면적인 주제는 다르지만, 모두 사람이 주어진 조건 안에서 어떤 선택을 할 수 있는지 묻습니다. 서로 다른 맥락을 비교하면서 질문의 범위를 넓힐 수 있습니다.`;
  }
  const themes = document.querySelector("#connection-themes");
  themes.replaceChildren();
  shared.slice(0, 2).forEach((theme) => themes.appendChild(makeElement("span", "shared", `공통 · ${theme}`)));
  if (sourceDistinct) themes.appendChild(makeElement("span", "contrast", `첫 질문 · ${sourceDistinct}`));
  if (matchDistinct) themes.appendChild(makeElement("span", "contrast", `두 번째 질문 · ${matchDistinct}`));
  document.querySelector("#opening-question").textContent = contrast
    ? `“두 질문 모두 ${common}을 이야기하고 있는데요. ${contrast}의 관점에서 보면 서로의 생각은 어디까지 같고, 어느 지점부터 달라질까요?”`
    : `“두 분 모두 ${common}에 관심이 있는 것 같아요. 각자의 작품에서 이 문제를 가장 선명하게 느낀 장면은 무엇이었나요?”`;
  const chatButton = document.querySelector("#start-chat");
  chatButton.disabled = false;
  chatButton.innerHTML = "대화 시작하기 <span aria-hidden=\"true\">→</span>";
  document.querySelector("#chat-message").textContent = "";
}

function formatWork(entry) {
  return entry.work ? `${entry.work.title} · ${typeLabel(entry.work.type)} · ${entry.work.rating || "–"}/5` : "연결된 작품 없음";
}

function positionTooltip(event, tooltip) {
  const container = document.querySelector("#constellation").getBoundingClientRect();
  tooltip.style.left = `${Math.max(12, Math.min(event.clientX - container.left + 14, container.width - 295))}px`;
  tooltip.style.top = `${Math.max(12, Math.min(event.clientY - container.top + 14, container.height - 145))}px`;
}

function preferredMedium(items) {
  const scores = { book: 0, film: 0, series: 0 };
  items.forEach((item) => { scores[item.type] = (scores[item.type] || 0) + item.rating; });
  const type = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return type === "film" ? "영화" : type === "series" ? "시리즈" : "책";
}

function makeSource(label, heading, copy) {
  const group = document.createElement("div"); group.className = "source-group";
  group.append(makeElement("span", "", label), makeElement("strong", "", heading), makeElement("p", "", copy)); return group;
}

function makeQuestion(question, contributor, book) { return { id: `question-${Date.now()}-${Math.floor(Math.random() * 1000)}`, contributor, work: book ? { id: book.id, title: book.title, type: book.type, rating: book.rating } : null, question, createdAt: new Date().toISOString() }; }
function loadData(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } }
function saveData(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function flashMessage(selector, text) { const element = document.querySelector(selector); if (!element) return; element.textContent = text; window.setTimeout(() => { element.textContent = ""; }, 4000); }
function makeElement(tag, className, text) { const element = document.createElement(tag); if (className) element.className = className; element.textContent = text; return element; }
function createSvg(tag, attributes) { const element = document.createElementNS("http://www.w3.org/2000/svg", tag); Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value)); return element; }
function hashString(text) { let hash = 2166136261; for (let index = 0; index < text.length; index += 1) { hash ^= text.charCodeAt(index); hash = Math.imul(hash, 16777619); } return hash >>> 0; }
function seededNumber(seed) { const value = Math.sin(seed) * 10000; return value - Math.floor(value); }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function shorten(text, length) { return text.length > length ? `${text.slice(0, length - 1)}…` : text; }
function capitalize(text) { return text.charAt(0).toUpperCase() + text.slice(1); }
function naturalList(items) { if (items.length <= 1) return items[0] || "나의 서재에 있는 작품"; return items.join(", "); }
function typeLabel(type) { return type === "film" ? "영화" : type === "series" ? "시리즈" : "책"; }
function displayName(name) { return name === "You" ? "나" : name === "Anonymous reader" ? "익명의 독자" : name; }
function avatarInitial(name) { return (name || "?").trim().charAt(0).toUpperCase(); }
