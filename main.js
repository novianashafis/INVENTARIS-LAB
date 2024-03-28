document.addEventListener('DOMContentLoaded', function () {
  const inputItem = document.getElementById('inputItem');
  const itemList = [];
  const RENDER_EVENT = 'render-list'

  inputItem.addEventListener('submit', function (event) {
    event.preventDefault()
    addItem()
  })

  function addItem() {
    const itemCategory = document.getElementById('inputItemCategory').value
    const itemName = document.getElementById('inputItemName').value
    const itemGood = document.getElementById('inputItemGood').value
    const itemBad = document.getElementById('inputItemBad').value
    const itemId = +new Date()

    const itemObject = {
      id: itemId,
      name: itemName,
      good: parseInt(itemGood),
      bad: parseInt(itemBad),
      category: itemCategory
    }
    itemList.push(itemObject)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
  }

  function makeItem(itemObject) {
    const nameContainer = document.createElement('div');
    const nameValue = document.createElement('input');
    nameValue.disabled = true;
    nameValue.type = 'text';
    nameValue.value = itemObject.name;
    nameContainer.append(nameValue)

    const goodContainer = document.createElement('div');
    const goodLabel = document.createElement('label');
    const goodValue = document.createElement('input');
    goodLabel.innerText = 'Baik';
    goodValue.disabled = true;
    goodValue.type = 'number'
    goodValue.value = itemObject.good;
    goodContainer.append(goodLabel,goodValue)

    const badContainer = document.createElement('div');
    const badLabel = document.createElement('label');
    const badValue = document.createElement('input');
    badLabel.innerText = 'Rusak';
    badValue.disabled = true;
    badValue.type = 'number'
    badValue.value = itemObject.bad;
    badContainer.append(badLabel,badValue)

    const categoryContainer = document.createElement('div');
    const categoryLabel = document.createElement('label');
    const categoryValue = document.createElement('select');
    categoryLabel.innerText = 'Kategori';
    const categories = {
      fisikadasar: 'FISIKA DASAR',
      instrumentasi: 'INSTRUMENTASI',
      lingkungan: 'LINGKUNGAN',
      material: 'MATERIAL'
    }

    for (category in categories) {
      option = document.createElement('option')
      option.value = category;
      option.text = categories[category]
      categoryValue.appendChild(option)
    }

    categoryValue.disabled = true;
    categoryValue.value = itemObject.category;
    categoryContainer.append(categoryLabel, categoryValue)

    const openEdit = document.createElement('button');
    openEdit.innerText = 'edit';
    openEdit.addEventListener('click', function () {
      editItem(itemObject.id)
    })

    const container = document.createElement('div');
    container.classList.add('item');
    container.append(nameContainer,goodContainer,badContainer,categoryContainer,openEdit);
    container.setAttribute('id', `item${itemObject.id}`)

    return container
  }

  function editItem (itemId) {
    document.dispatchEvent(new Event(RENDER_EVENT));

    const container = document.getElementById(`item${itemId}`);

    const name = container.querySelectorAll('input')[0];
    const good = container.querySelectorAll('input')[1];
    const bad = container.querySelectorAll('input')[2];
    const category = container.querySelectorAll('select')[0];
    name.disabled = false;
    good.disabled = false;
    bad.disabled = false;
    category.disabled = false;

    const saveEdit = container.querySelector('button');
    saveEdit.innerText = 'save';
    saveEdit.addEventListener('click', function () {
      name.disabled = true;
      good.disabled = true;
      bad.disabled = true;
      category.disabled = true;
      const item = findBook(itemId)
      if (item === null) return;
      item.name = name.value;
      item.good = good.value;
      item.bad = bad.value;
      item.category = category.value;

      document.dispatchEvent(new Event(RENDER_EVENT));
    })
  }

  function findBook(itemId) {
    for (const item of itemList) {
      if (item.id === itemId) {
        return item;
      }
    }
    return null;
  }

  document.addEventListener(RENDER_EVENT, function() {
    const fisdasList = document.getElementById('fisdas')
    const instrumentasiList = document.getElementById('instrumentasi')
    const lingkunganList = document.getElementById('lingkungan')
    const materialList = document.getElementById('material')

    fisdasList.innerHTML = ''
    instrumentasiList.innerHTML = ''
    lingkunganList.innerHTML = ''
    materialList.innerHTML = ''

    for (item of itemList) {
      const itemElement = makeItem(item)
      if (item.category === 'fisikadasar') {
        fisdasList.append(itemElement)
      }else if (item.category === 'instrumentasi') {
        instrumentasiList.append(itemElement)
      }else if (item.category === 'lingkungan') {
        lingkunganList.append(itemElement)
      }else if (item.category === 'material') {
        materialList.append(itemElement)
      }
    }
  })

  const STORAGE_KEY = "inventaris-app";

  function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('browser tidak mendukung local storage');
      return false;
    }
    return true;
  }

  function saveData () {
    if (isStorageExist()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itemList))
    }
  }

  function loadDataFromStorage() {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data !== null) {
      for (const item of data) {
        itemList.push(item);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  if (isStorageExist()) {
    loadDataFromStorage();
  }
})