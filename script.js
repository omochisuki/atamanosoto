// ========================================
// 頭の外 v0.4
// 自由カテゴリー版
// ========================================


const MEMO_STORAGE_KEY =
  "atamanosoto_memos";

const CATEGORY_STORAGE_KEY =
  "atamanosoto_categories";


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
  document.querySelectorAll(
    ".category-tab"
  );

const categoryTabsContainer =
  document.getElementById(
    "categoryTabs"
  );

const addCategoryButton =
  document.getElementById(
    "addCategoryButton"
  );

const detailModal =
  document.getElementById(
    "detailModal"
  );

const detailContent =
  document.getElementById(
    "detailContent"
  );

const closeModal =
  document.getElementById(
    "closeModal"
  );


// ========================================
// State
// ========================================

let memos = loadMemos();

let categories = loadCategories();

let selectedImage = null;

let currentCategory = "すべて";


// ========================================
// Load Memos
// ========================================

function loadMemos() {

  try {

    const saved =
      localStorage.getItem(
        MEMO_STORAGE_KEY
      );

    if (!saved) {
      return [];
    }

    const loaded =
      JSON.parse(saved);


    // 古いバージョンのカテゴリーにも対応

    return loaded.map(
      function (memo) {

        if (!memo.category) {

          memo.category =
            "分類なし";

        }

        return memo;

      }
    );

  } catch (error) {

    console.error(error);

    return [];

  }

}


// ========================================
// Load Categories
// ========================================

function loadCategories() {

  try {

    const saved =
      localStorage.getItem(
        CATEGORY_STORAGE_KEY
      );

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
      MEMO_STORAGE_KEY,
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


function saveCategories() {

  localStorage.setItem(
    CATEGORY_STORAGE_KEY,
    JSON.stringify(categories)
  );

}


// ========================================
// Image
// ========================================

imageInput.addEventListener(
  "change",
  function () {

    const file =
      this.files[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

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

      category: "分類なし",

      completed: false,

      createdAt:
        new Date().toISOString()

    };


    memos.unshift(memo);

    saveMemos();


    // Reset

    memoInput.value = "";

    selectedImage = null;

    imageInput.value = "";

    imagePreview.innerHTML = "";


    renderAll();

  }
);


// ========================================
// Render Category Tabs
// ========================================

function renderCategoryTabs() {

  categoryTabsContainer.innerHTML = "";


  categories.forEach(
    function (category) {

      const button =
        document.createElement("button");

      button.className =
        "category-tab";


      button.dataset.category =
        category;


      button.textContent =
        category;


      if (
        currentCategory ===
        category
      ) {

        button.classList.add(
          "active"
        );

      }


      button.addEventListener(
        "click",
        function () {

          selectCategory(
            category
          );

        }
      );


      categoryTabsContainer.appendChild(
        button
      );

    }
  );

}


// ========================================
// Category Select
// ========================================

categoryTabs.forEach(
  function (tab) {

    tab.addEventListener(
      "click",
      function () {

        selectCategory(
          this.dataset.category
        );

      }
    );

  }
);


function selectCategory(
  category
) {

  currentCategory =
    category;


  document
    .querySelectorAll(
      ".category-tab"
    )
    .forEach(
      function (button) {

        button.classList.remove(
          "active"
        );

      }
    );


  document
    .querySelectorAll(
      ".category-tab"
    )
    .forEach(
      function (button) {

        if (
          button.dataset.category ===
          category
        ) {

          button.classList.add(
            "active"
          );

        }

      }
    );


  renderAll();

}


// ========================================
// Add Category
// ========================================

addCategoryButton.addEventListener(
  "click",
  function () {

    showNewCategoryForm();

  }
);


// ========================================
// New Category Form
// ========================================

function showNewCategoryForm(
  memo = null
) {

  detailContent.innerHTML = "";


  const title =
    document.createElement("h3");

  title.textContent =
    memo
      ? "カテゴリーを変更"
      : "新しいカテゴリー";


  title.style.marginTop =
    "0";


  detailContent.appendChild(
    title
  );


  const description =
    document.createElement("p");

  description.textContent =
    memo
      ? "このメモをどこに入れる？"
      : "好きな名前をつけてください。";


  description.style.color =
    "#888";


  description.style.fontSize =
    "13px";


  detailContent.appendChild(
    description
  );


  // Existing categories

  if (memo) {

    const selector =
      document.createElement(
        "div"
      );

    selector.className =
      "category-selector";


    // 分類なし

    selector.appendChild(
      createCategorySelectButton(
        "分類なし",
        memo
      )
    );


    categories.forEach(
      function (category) {

        selector.appendChild(
          createCategorySelectButton(
            category,
            memo
          )
        );

      }
    );


    // 新規カテゴリー

    const newButton =
      document.createElement("button");

    newButton.className =
      "category-select-button";

    newButton.textContent =
      "＋ 新しいカテゴリー";


    newButton.addEventListener(
      "click",
      function () {

        showNewCategoryForm(
          memo
        );

      }
    );


    selector.appendChild(
      newButton
    );


    detailContent.appendChild(
      selector
    );

  }


  // New category input

  const form =
    document.createElement("div");

  form.className =
    "new-category-form";


  const input =
    document.createElement("input");

  input.type =
    "text";

  input.placeholder =
    "例：旅行、買い物、仕事";

  input.className =
    "new-category-input";


  const buttons =
    document.createElement("div");

  buttons.className =
    "new-category-buttons";


  const cancel =
    document.createElement("button");

  cancel.textContent =
    "キャンセル";


  cancel.addEventListener(
    "click",
    function () {

      if (memo) {

        showCategorySelector(
          memo
        );

      }

      else {

        closeModal();

      }

    }
  );


  const create =
    document.createElement("button");

  create.textContent =
    "作成";

  create.className =
    "primary";


  create.addEventListener(
    "click",
    function () {

      const name =
        input.value.trim();


      if (!name) {

        alert(
          "カテゴリー名を入力してください。"
        );

        return;

      }


      if (
        name === "すべて" ||
        name === "分類なし"
      ) {

        alert(
          "その名前は使えません。"
        );

        return;

      }


      if (
        categories.includes(name)
      ) {

        alert(
          "そのカテゴリーはすでにあります。"
        );

        return;

      }


      categories.push(name);

      saveCategories();


      // メモから作った場合
      // そのままそのカテゴリーへ移動

      if (memo) {

        memo.category =
          name;

        saveMemos();

      }


      detailModal.classList.remove(
        "show"
      );


      currentCategory =
        name;


      renderAll();

    }
  );


  buttons.appendChild(cancel);

  buttons.appendChild(create);


  form.appendChild(input);

  form.appendChild(buttons);


  detailContent.appendChild(
    form
  );


  detailModal.classList.add(
    "show"
  );


  setTimeout(
    function () {

      input.focus();

    },
    50
  );

}


// ========================================
// Category Select Button
// ========================================

function createCategorySelectButton(
  category,
  memo
) {

  const button =
    document.createElement("button");

  button.className =
    "category-select-button";


  button.textContent =
    category;


  if (
    memo.category ===
    category
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


      renderAll();

    }
  );


  return button;

}


// ========================================
// Render
// ========================================

function renderAll() {

  renderCategoryTabs();

  renderMemos();

}


// ========================================
// Render Memos
// ========================================

function renderMemos() {

  memoList.innerHTML = "";


  let visibleMemos;


  // ALL

  if (
    currentCategory ===
    "すべて"
  ) {

    visibleMemos =
      memos;


    listTitle.textContent =
      "すべての記録";


    renderAllGroups(
      visibleMemos
    );

  }


  // OTHER CATEGORY

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


    if (
      currentCategory ===
      "分類なし"
    ) {

      listTitle.textContent =
        "未分類";

    }

    else {

      listTitle.textContent =
        currentCategory;

    }


    renderSingleGroup(
      visibleMemos,
      currentCategory
    );

  }


  if (
    visibleMemos.length ===
    0
  ) {

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

function renderAllGroups(
  memoArray
) {

  // 分類なし

  const uncategorized =
    memoArray.filter(
      function (memo) {

        return (
          !memo.category ||
          memo.category ===
          "分類なし"
        );

      }
    );


  if (
    uncategorized.length > 0
  ) {

    createCategoryGroup(
      "分類なし",
      uncategorized
    );

  }


  // User Categories

  categories.forEach(
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
        categoryMemos.length ===
        0
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

  if (
    memoArray.length ===
    0
  ) {

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

  card.className =
    "memo";


  if (memo.completed) {

    card.classList.add(
      "completed"
    );

  }


  // Main

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
    memo.category ||
    "分類なし";


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

      showCategorySelector(
        memo
      );

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
              item.id !==
              memo.id
            );

          }
        );


      saveMemos();

      renderAll();

    }
  );


  card.appendChild(
    deleteButton
  );


  return card;

}


// ========================================
// Category Selector
// ========================================

function showCategorySelector(
  memo
) {

  detailContent.innerHTML = "";


  const title =
    document.createElement("h3");

  title.textContent =
    "カテゴリーを選ぶ";

  title.style.marginTop =
    "0";


  detailContent.appendChild(
    title
  );


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


  const selector =
    document.createElement(
      "div"
    );

  selector.className =
    "category-selector";


  // Uncategorized

  selector.appendChild(
    createCategorySelectButton(
      "分類なし",
      memo
    )
  );


  // Existing

  categories.forEach(
    function (category) {

      selector.appendChild(
        createCategorySelectButton(
          category,
          memo
        )
      );

    }
  );


  // New

  const newButton =
    document.createElement("button");

  newButton.className =
    "category-select-button";

  newButton.textContent =
    "＋ 新しいカテゴリー";


  newButton.addEventListener(
    "click",
    function () {

      showNewCategoryForm(
        memo
      );

    }
  );


  selector.appendChild(
    newButton
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
    "カテゴリー： " +
    (
      memo.category ||
      "分類なし"
    ) +
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


  detailContent.appendChild(
    info
  );


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

    closeModalWindow();

  }
);


detailModal.addEventListener(
  "click",
  function (event) {

    if (
      event.target ===
      detailModal
    ) {

      closeModalWindow();

    }

  }
);


function closeModalWindow() {

  detailModal.classList.remove(
    "show"
  );

}


// ========================================
// Clear
// ========================================

clearButton.addEventListener(
  "click",
  function () {

    if (
      memos.length ===
      0
    ) {

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

    renderAll();

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

renderAll();