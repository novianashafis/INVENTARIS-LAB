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
    const nameValue = document.createElement('input');
    nameValue.disabled = true;
    nameValue.type = 'text';
    nameValue.value = itemObject.name;

    const goodContainer = document.createElement('div');
    const goodLabel = document.createElement('label');
    const goodValue = document.createElement('input');
    const goodIncrease = document.createElement('button');
    const goodDecrease = document.createElement('button');
    goodLabel.innerText = 'Baik';
    goodValue.disabled = true;
    goodValue.type = 'number'
    goodValue.value = itemObject.good;
    goodIncrease.innerText = "+"
    goodIncrease.addEventListener('click', function () {
      goodValue.value = parseInt(goodValue.value) + 1;
    })
    goodDecrease.innerText = "-"
    goodDecrease.addEventListener('click', function () {
      current = parseInt(goodValue.value)
      if (current > 0){
        goodValue.value = parseInt(goodValue.value) - 1;
      }
    })
    goodContainer.append(goodLabel,goodDecrease,goodValue,goodIncrease)

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
    categoryContainer.style.display = 'none'
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
    categoryValue.value = itemObject.category;
    categoryContainer.append(categoryLabel, categoryValue)

    const openEdit = document.createElement('button');
    openEdit.innerText = 'edit';
    openEdit.addEventListener('click', function () {
      editItem(itemObject.id)
    })

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'delete';
    deleteButton.addEventListener('click', function () {
      confirmDelete(itemObject.id)
    })

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');
    buttonContainer.append(openEdit,deleteButton)

    const container = document.createElement('div');
    container.classList.add('item');
    container.append(nameValue,goodContainer,badContainer,categoryContainer,buttonContainer);
    container.setAttribute('id', `item${itemObject.id}`)

    return container
  }

  function editItem (itemId) {
    document.dispatchEvent(new Event(RENDER_EVENT));

    const container = document.getElementById(`item${itemId}`);

    const name = container.querySelectorAll('input')[0];
    const good = container.querySelectorAll('input')[1];
    const bad = container.querySelectorAll('input')[2];
    const category = container.querySelector('select');
    const categoryContainer = container.querySelectorAll('div')[2];
    name.disabled = false;
    good.disabled = false;
    bad.disabled = false;
    categoryContainer.style.display = 'grid';

    const saveEdit = container.querySelectorAll('button')[2];
    saveEdit.innerText = 'save';
    saveEdit.addEventListener('click', function () {
      const item = findBook(itemId)
      if (item === null) return;
      item.name = name.value;
      item.good = good.value;
      item.bad = bad.value;
      item.category = category.value;
      
      name.disabled = true;
      good.disabled = true;
      bad.disabled = true;
      categoryContainer.style.display = 'none';

      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    })
  }

  function deleteItem(itemId) {
    const itemIndex = findIndexItem(itemId)
    if (itemIndex === -1) return;

    itemList.splice(itemIndex,1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function confirmDelete(itemId) {
    if (confirm('Yakin ingin menghapus item ini?')) {
      deleteItem(itemId)
    } else {
      alert('Batal menghapus.');
    }
  }

  const searchingItem = document.getElementById('searchAlat')
  searchingItem.addEventListener('submit', function (event) {
    event.preventDefault()
    searchItem()
  })

  function searchItem() {
    const keyword = document.getElementById('searchNamaAlat').value.toLowerCase()
    for (const item of itemList) {
      const itemContainer = document.getElementById(`item${item.id}`)
      if (item.name.toLowerCase().includes(keyword) || keyword === '') {
        itemContainer.style.display = 'block';
      } else {
        itemContainer.style.display = 'none';
      }
    }
  }

  function findBook(itemId) {
    for (const item of itemList) {
      if (item.id === itemId) {
        return item;
      }
    }
    return null;
  }

  function findIndexItem(itemId) {
    for (const i in itemList) {
      if (itemList[i].id === itemId) {
        return i;
      }
    }
    return -1;
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
    searchItem()
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