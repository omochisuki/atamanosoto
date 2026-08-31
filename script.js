// -------------------------
// 頭の外 v0.1
// -------------------------

const memoInput = document.getElementById("memo");
const saveButton = document.getElementById("saveButton");
const memoList = document.getElementById("memoList");
const emptyMessage = document.getElementById("emptyMessage");
const clearButton = document.getElementById("clearButton");


// -------------------------
// 保存されているメモを取得
// -------------------------

function getMemos() {
  const memos = localStorage.getItem("atamanosoto_memos");

  if (!memos) {
    return [];
  }

  return JSON.parse(memos);
}


// -------------------------
// メモを保存
// -------------------------

function saveMemos(memos) {
  localStorage.setItem(
    "atamanosoto_memos",
    JSON.stringify(memos)
  );
}


// -------------------------
// 日付を表示
// -------------------------

function formatDate(dateString) {

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hour}:${minute}`;
}


// -------------------------
// メモ一覧を表示
// -------------------------

function renderMemos() {

  const memos = getMemos();

  memoList.innerHTML = "";

  // メモがない場合
  if (memos.length === 0) {

    emptyMessage.style.display = "block";
    clearButton.style.display = "none";

    return;
  }

  emptyMessage.style.display = "none";
  clearButton.style.display = "block";


  // 新しいものから表示
  memos
    .sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .forEach((memo) => {

      const memoElement = document.createElement("article");

      memoElement.className = "memo";


      // 本文
      const textElement = document.createElement("p");

      textElement.className = "memo-text";

      textElement.textContent = memo.text;


      // 日付
      const dateElement = document.createElement("div");

      dateElement.className = "memo-date";

      dateElement.textContent =
        formatDate(memo.createdAt);


      // 削除ボタン
      const deleteButton =
        document.createElement("button");

      deleteButton.className = "delete-button";

      deleteButton.textContent = "×";

      deleteButton.setAttribute(
        "aria-label",
        "この記録を削除"
      );


      deleteButton.addEventListener(
        "click",
        () => {
          deleteMemo(memo.id);
        }
      );


      // メモを組み立てる
      memoElement.appendChild(textElement);
      memoElement.appendChild(dateElement);
      memoElement.appendChild(deleteButton);

      memoList.appendChild(memoElement);
    });
}


// -------------------------
// 新しいメモを追加
// -------------------------

function addMemo() {

  const text = memoInput.value.trim();


  // 空欄なら何もしない
  if (!text) {
    memoInput.focus();
    return;
  }


  const memos = getMemos();


  const newMemo = {

    id: Date.now(),

    text: text,

    createdAt: new Date().toISOString()

  };


  memos.push(newMemo);

  saveMemos(memos);


  // 入力欄を空にする
  memoInput.value = "";


  // 一覧を更新
  renderMemos();


  // 入力欄に戻る
  memoInput.focus();
}


// -------------------------
// メモを削除
// -------------------------

function deleteMemo(id) {

  const memos = getMemos();

  const newMemos =
    memos.filter((memo) => memo.id !== id);

  saveMemos(newMemos);

  renderMemos();
}


// -------------------------
// 全削除
// -------------------------

function clearAllMemos() {

  const memos = getMemos();

  if (memos.length === 0) {
    return;
  }


  const confirmed =
    confirm("すべての記録を削除しますか？");


  if (!confirmed) {
    return;
  }


  localStorage.removeItem("atamanosoto_memos");

  renderMemos();
}


// -------------------------
// イベント
// -------------------------

saveButton.addEventListener(
  "click",
  addMemo
);


clearButton.addEventListener(
  "click",
  clearAllMemos
);


// Ctrl + Enter / Command + Enter
// でも保存できるようにする

memoInput.addEventListener(
  "keydown",
  (event) => {

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === "Enter"
    ) {
      addMemo();
    }

  }
);


// -------------------------
// 起動時に表示
// -------------------------

renderMemos();