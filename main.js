document.addEventListener('DOMContentLoaded', function () {
  const inputItem = document.getElementById('inputItem');
  const itemList = [];
  const RENDER_EVENT = 'render-list'

  inputAlat.addEventListener('submit', function (event) {
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
    console.log(itemObject)
    itemList.push(itemObject)
    document.dispatchEvent(new Event(RENDER_EVENT))
  }

  function makeItem(itemObject) {
    const nameContainer = document.createElement('div')
    const textName = document.createElement('h3')
    textName.innerText = itemObject.name;
    nameContainer.append(textName)

    const goodContainer = document.createElement('div');
    const goodLabel = document.createElement('label');
    const goodText = document.createElement('div');
    goodLabel.innerText = 'Keadaan Baik:';
    goodText.innerText = itemObject.good;
    goodContainer.append(goodLabel,goodText);

    const badContainer = document.createElement('div')
    const badLabel = document.createElement('label');
    const badText = document.createElement('div');
    badLabel.innerText = 'Keadaan Tidak Baik:';
    badText.innerText = itemObject.bad;
    badContainer.append(badLabel,badText);

    const container = document.createElement('article');
    container.classList.add('item');
    container.append(nameContainer,goodContainer,badContainer);
    container.setAttribute('id', `item${itemObject.id}`)

    return container
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
})