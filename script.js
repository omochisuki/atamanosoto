// ========================================
// 頭の外 v0.3
// タップ式カテゴリー版
// ========================================

const STORAGE_KEY = "atamanosoto_memos";

const CATEGORIES = [
  "生活TODO",
  "ハンドメイドメモ",
  "美容メモ",
  "その他"
];

const CATEGORY_ICONS = {
  "生活TODO": "📋",
  "ハンドメイドメモ": "🧵",
  "美容メモ": "💄",
  "その他": "📁"
};


// ========================================
// DOM
// ========================================

const memoInput =
  document.getElementById("memo");

const imageInput =
  document.getElementById("imageInput");

const imagePreview =
  document.getElementById("imagePreview");

const saveButton =
  document.getElementById("saveButton");

const memoList =
  document.getElementById("memoList");

const emptyMessage =
  document.getElementById("emptyMessage");

const clearButton =
  document.getElementById("clearButton");

const listTitle =
  document.getElementById("listTitle");

const categoryTabs =
  document.querySelectorAll(".category-tab");

const detailModal =
  document.getElementById("detailModal");

const detailContent =
  document.getElementById("detailContent");

const closeModal =
  document.getElementById("closeModal");


// ========================================
// State
// ========================================

let memos = loadMemos();

let selectedImage = null;

let currentCategory = "すべて";


// ========================================
// Load
// ========================================

function loadMemos() {

  try {

    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    return JSON.parse(saved);

  } catch (error) {

    console.error(error);

    return [];

  }

}


// ========================================
// Save
// ========================================

function saveMemos() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(memos)
    );

  } catch (error) {

    console.error(error);

    alert(
      "保存できませんでした。\n\n" +
      "画像が大きすぎる可能性があります。"
    );

  }

}


// ========================================
// Image
// ========================================

imageInput.addEventListener(
  "change",
  function () {

    const file = this.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {

      alert(
        "画像ファイルを選択してください。"
      );

      return;

    }

    const reader =
      new FileReader();

    reader.onload =
      function (event) {

        selectedImage =
          event.target.result;

        showImagePreview(
          selectedImage
        );

      };

    reader.readAsDataURL(file);

  }
);


// ========================================
// Image Preview
// ========================================

function showImagePreview(image) {

  imagePreview.innerHTML = "";

  const img =
    document.createElement("img");

  img.src = image;

  img.className =
    "preview-image";


  const removeButton =
    document.createElement("button");

  removeButton.textContent =
    "画像を外す";

  removeButton.className =
    "remove-preview";


  removeButton.addEventListener(
    "click",
    function () {

      selectedImage = null;

      imageInput.value = "";

      imagePreview.innerHTML = "";

    }
  );


  imagePreview.appendChild(img);

  imagePreview.appendChild(
    removeButton
  );

}


// ========================================
// Save Memo
// ========================================

saveButton.addEventListener(
  "click",
  function () {

    const text =
      memoInput.value.trim();


    if (!text && !selectedImage) {

      alert(
        "何かひとつ、外に出してみよう。"
      );

      return;

    }


    const memo = {

      id: Date.now(),

      text: text,

      image: selectedImage,

      category: "その他",

      completed: false,

      createdAt:
        new Date().toISOString()

    };


    memos.unshift(memo);

    saveMemos();


    memoInput.value = "";

    selectedImage = null;

    imageInput.value = "";

    imagePreview.innerHTML = "";


    renderMemos();

  }
);


// ========================================
// Category Tabs
// ========================================

categoryTabs.forEach(
  function (tab) {

    tab.addEventListener(
      "click",
      function () {

        currentCategory =
          this.dataset.category;


        categoryTabs.forEach(
          function (item) {

            item.classList.remove(
              "active"
            );

          }
        );


        this.classList.add("active");


        renderMemos();

      }
    );

  }
);


// ========================================
// Render
// ========================================

function renderMemos() {

  memoList.innerHTML = "";


  let visibleMemos;


  if (
    currentCategory ===
    "すべて"
  ) {

    visibleMemos = memos;

    listTitle.textContent =
      "すべての記録";

    renderAllGroups(
      visibleMemos
    );

  }

  else {

    visibleMemos =
      memos.filter(
        function (memo) {

          return (
            memo.category ===
            currentCategory
          );

        }
      );


    listTitle.textContent =
      currentCategory;


    renderSingleGroup(
      visibleMemos,
      currentCategory
    );

  }


  if (visibleMemos.length === 0) {

    emptyMessage.style.display =
      "block";

  }

  else {

    emptyMessage.style.display =
      "none";

  }

}


// ========================================
// All Groups
// ========================================

function renderAllGroups(memoArray) {

  CATEGORIES.forEach(
    function (category) {

      const categoryMemos =
        memoArray.filter(
          function (memo) {

            return (
              memo.category ===
              category
            );

          }
        );


      if (
        categoryMemos.length === 0
      ) {

        return;

      }


      createCategoryGroup(
        category,
        categoryMemos
      );

    }
  );

}


// ========================================
// Single Group
// ========================================

function renderSingleGroup(
  memoArray,
  category
) {

  if (memoArray.length === 0) {
    return;
  }


  createCategoryGroup(
    category,
    memoArray
  );

}


// ========================================
// Category Group
// ========================================

function createCategoryGroup(
  category,
  categoryMemos
) {

  const group =
    document.createElement("section");

  group.className =
    "category-group";


  const title =
    document.createElement("h3");

  title.className =
    "category-group-title";


  title.textContent =
    CATEGORY_ICONS[category] +
    " " +
    category;


  const count =
    document.createElement("span");

  count.className =
    "category-count";

  count.textContent =
    categoryMemos.length +
    "件";


  title.appendChild(count);


  group.appendChild(title);


  const list =
    document.createElement("div");

  list.className =
    "memo-list";


  categoryMemos.forEach(
    function (memo) {

      list.appendChild(
        createMemoCard(memo)
      );

    }
  );


  group.appendChild(list);

  memoList.appendChild(group);

}


// ========================================
// Memo Card
// ========================================

function createMemoCard(memo) {

  const card =
    document.createElement("article");

  card.className = "memo";


  if (memo.completed) {

    card.classList.add(
      "completed"
    );

  }


  const main =
    document.createElement("div");

  main.className =
    "memo-main";


  // Checkbox

  const checkbox =
    document.createElement("input");

  checkbox.type =
    "checkbox";

  checkbox.className =
    "memo-check";

  checkbox.checked =
    memo.completed;


  checkbox.addEventListener(
    "change",
    function () {

      memo.completed =
        checkbox.checked;

      saveMemos();

      renderMemos();

    }
  );


  // Body

  const body =
    document.createElement("div");

  body.className =
    "memo-body";


  // Text

  if (memo.text) {

    const text =
      document.createElement("p");

    text.className =
      "memo-text";

    text.textContent =
      memo.text;

    body.appendChild(text);

  }


  // Image

  if (memo.image) {

    const image =
      document.createElement("img");

    image.src =
      memo.image;

    image.className =
      "memo-image";


    image.addEventListener(
      "click",
      function () {

        showDetail(memo);

      }
    );


    body.appendChild(image);

  }


  // Date

  const date =
    document.createElement("div");

  date.className =
    "memo-date";

  date.textContent =
    formatDate(
      memo.createdAt
    );

  body.appendChild(date);


  // Category

  const category =
    document.createElement("div");

  category.className =
    "memo-category";

  category.textContent =
    CATEGORY_ICONS[memo.category] +
    " " +
    memo.category;

  body.appendChild(category);


  main.appendChild(checkbox);

  main.appendChild(body);

  card.appendChild(main);


  // Actions

  const actions =
    document.createElement("div");

  actions.className =
    "memo-actions";


  const detailButton =
    document.createElement("button");

  detailButton.textContent =
    "元のメモを見る";

  detailButton.className =
    "action-button";


  detailButton.addEventListener(
    "click",
    function () {

      showDetail(memo);

    }
  );


  const categoryButton =
    document.createElement("button");

  categoryButton.textContent =
    "分類を変更";

  categoryButton.className =
    "action-button";


  categoryButton.addEventListener(
    "click",
    function () {

      showCategorySelector(memo);

    }
  );


  actions.appendChild(
    detailButton
  );

  actions.appendChild(
    categoryButton
  );

  card.appendChild(actions);


  // Delete

  const deleteButton =
    document.createElement("button");

  deleteButton.textContent =
    "×";

  deleteButton.className =
    "delete-button";


  deleteButton.addEventListener(
    "click",
    function () {

      const confirmed =
        confirm(
          "この記録を削除しますか？"
        );


      if (!confirmed) {
        return;
      }


      memos =
        memos.filter(
          function (item) {

            return (
              item.id !== memo.id
            );

          }
        );


      saveMemos();

      renderMemos();

    }
  );


  card.appendChild(
    deleteButton
  );


  return card;

}


// ========================================
// ★ タップ式カテゴリー選択
// ========================================

function showCategorySelector(memo) {

  // モーダルの中身を作り直す

  detailContent.innerHTML = "";


  const title =
    document.createElement("h3");

  title.textContent =
    "カテゴリーを選ぶ";

  title.style.marginTop = "0";

  detailContent.appendChild(title);


  const description =
    document.createElement("p");

  description.textContent =
    "このメモをどこに入れる？";

  description.style.color =
    "#888";

  description.style.fontSize =
    "13px";

  detailContent.appendChild(
    description
  );


  // カテゴリーボタン

  const selector =
    document.createElement("div");

  selector.className =
    "category-selector";


  CATEGORIES.forEach(
    function (category) {

      const button =
        document.createElement("button");

      button.className =
        "category-select-button";


      button.textContent =
        CATEGORY_ICONS[category] +
        " " +
        category;


      // 現在のカテゴリー

      if (
        memo.category === category
      ) {

        button.classList.add(
          "selected"
        );

      }


      button.addEventListener(
        "click",
        function () {

          memo.category =
            category;

          saveMemos();

          detailModal.classList.remove(
            "show"
          );

          renderMemos();

        }
      );


      selector.appendChild(button);

    }
  );


  detailContent.appendChild(
    selector
  );


  detailModal.classList.add(
    "show"
  );

}


// ========================================
// Detail
// ========================================

function showDetail(memo) {

  detailContent.innerHTML = "";


  if (memo.text) {

    const text =
      document.createElement("p");

    text.className =
      "detail-text";

    text.textContent =
      memo.text;

    detailContent.appendChild(
      text
    );

  }


  if (memo.image) {

    const image =
      document.createElement("img");

    image.src =
      memo.image;

    image.className =
      "detail-image";

    detailContent.appendChild(
      image
    );

  }


  const info =
    document.createElement("div");

  info.className =
    "detail-info";


  info.textContent =
    CATEGORY_ICONS[memo.category] +
    " " +
    memo.category +
    "\n" +
    (
      memo.completed
        ? "☑ 完了"
        : "☐ 未完了"
    ) +
    "\n" +
    formatDate(
      memo.createdAt
    );


  detailContent.appendChild(info);


  detailModal.classList.add(
    "show"
  );

}


// ========================================
// Close Modal
// ========================================

closeModal.addEventListener(
  "click",
  function () {

    detailModal.classList.remove(
      "show"
    );

  }
);


detailModal.addEventListener(
  "click",
  function (event) {

    if (
      event.target ===
      detailModal
    ) {

      detailModal.classList.remove(
        "show"
      );

    }

  }
);


// ========================================
// Clear All
// ========================================

clearButton.addEventListener(
  "click",
  function () {

    if (memos.length === 0) {
      return;
    }


    const confirmed =
      confirm(
        "すべての記録を削除しますか？\n\n" +
        "この操作は元に戻せません。"
      );


    if (!confirmed) {
      return;
    }


    memos = [];

    saveMemos();

    renderMemos();

  }
);


// ========================================
// Date
// ========================================

function formatDate(
  dateString
) {

  const date =
    new Date(dateString);


  return date.toLocaleString(
    "ja-JP",
    {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );

}


// ========================================
// Start
// ========================================

renderMemos();