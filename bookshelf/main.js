document.addEventListener('DOMContentLoaded', function () {
    const inputBook = document.getElementById('inputBook');
    const books = [];
    const RENDER_EVENT = 'render-library';

    inputBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    })

    function addBook() {
        const bookTitle = document.getElementById('inputBookTitle').value;
        const bookAuthor = document.getElementById('inputBookAuthor').value;
        const bookYear = parseInt(document.getElementById('inputBookYear').value);
        const bookComplete = document.getElementById('inputBookIsComplete').checked;
        const bookId = +new Date();
        const bookObject = {
            id:bookId,
            title:bookTitle,
            author:bookAuthor,
            year:bookYear,
            isComplete:bookComplete
        }
        books.push(bookObject);
        
        document.dispatchEvent(new Event(RENDER_EVENT))
        saveData();
    }

    function makeBook(bookObject) {
        const textTitle = document.createElement('h3');
        textTitle.innerText = bookObject.title;
        const titleContainer = document.createElement('div')
        titleContainer.append(textTitle)

        const labelAuthor = document.createElement('label');
        labelAuthor.innerText = 'Penulis: ';
        const textAuthor = document.createElement('div');
        textAuthor.innerText = bookObject.author;
        const authorContainer = document.createElement('div')
        authorContainer.append(labelAuthor,textAuthor)

        const labelYear = document.createElement('label');
        labelYear.innerText = 'Tahun: ';
        const textYear = document.createElement('div');
        textYear.innerText = bookObject.year;
        const yearContainer = document.createElement('div')
        yearContainer.append(labelYear,textYear)

        const completeButton = document.createElement('button');
        completeButton.classList.add('green');
        if (bookObject.isComplete) {
            completeButton.innerText = 'Belum selesai di Baca';
        } else {
            completeButton.innerText = 'Selesai dibaca';
        }
        completeButton.addEventListener('click', function () {
            moveBook(bookObject.id);
        })

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus buku';
        deleteButton.addEventListener('click', function () {
            deleteBook(bookObject.id);
        })

        const editButton = document.createElement('button');
        editButton.classList.add('blue');
        editButton.innerText = 'Edit buku';
        editButton.addEventListener('click', function () {
            editBook(bookObject.id);
        })

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('action');
        buttonContainer.append(completeButton,deleteButton,editButton);

        const container = document.createElement('article');
        container.classList.add('book_item');
        container.append(titleContainer,authorContainer,yearContainer,buttonContainer);
        container.setAttribute('id', `book${bookObject.id}`)

        return container;
    }

    function moveBook(bookId) {
        const bookTarget = findBook(bookId)
        if (bookTarget == null) return;

        if (bookTarget.isComplete) {
            bookTarget.isComplete = false;
        } else {
            bookTarget.isComplete = true;
        }
        document.dispatchEvent(new Event(RENDER_EVENT));

        saveData();
    }

    function deleteBook(bookId) {
        const bookTarget = findIndexBook(bookId);
        if (bookTarget === -1) return;

        books.splice(bookTarget,1);
        document.dispatchEvent(new Event(RENDER_EVENT));

        saveData();
    }

    function editBook(bookId) {
        document.dispatchEvent(new Event(RENDER_EVENT));

        const container = document.getElementById(`book${bookId}`)
        const title = container.querySelector('h3')
        const author = container.querySelectorAll(`#book${bookId} div`)[2];
        const year = container.querySelectorAll(`#book${bookId} div`)[4];
        const buttonContainer = container.querySelector(`#book${bookId} .action`);
        for (const container of buttonContainer.querySelectorAll('button')) {
            container.style.display = 'none';
        }

        const editTitle = document.createElement('input')
        editTitle.type = 'text';
        editTitle.setAttribute('required','true')
        editTitle.value = title.innerText;
        title.parentNode.replaceChild(editTitle,title)

        const editAuthor = document.createElement('input')
        editAuthor.type = 'text';
        editAuthor.setAttribute('required','true')
        editAuthor.value = author.innerText;
        author.parentNode.replaceChild(editAuthor,author)

        const editYear = document.createElement('input')
        editYear.type = 'number';
        editYear.setAttribute('required','true')
        editYear.value = year.innerText;
        year.parentNode.replaceChild(editYear,year)

        const editSaveButton = document.createElement('button');
        editSaveButton.classList.add('blue');
        editSaveButton.innerText = 'Simpan Perubahan';
        editSaveButton.addEventListener('click', function () {
            const bookTarget = findBook(bookId)
            if (bookTarget == null) return;
            bookTarget.title = editTitle.value;
            bookTarget.author = editAuthor.value;
            bookTarget.year = parseInt(editYear.value);

            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        })

        buttonContainer.append(editSaveButton);
    }

    function findBook(bookId) {
        for (const book of books) {
            if (book.id === bookId) {
                return book;
            }
        }
        return null;
    }

    function findIndexBook(bookId) {
        for (const i in books) {
            if (books[i].id === bookId) {
                return i;
            }
        }
        return -1;
    }

    document.addEventListener(RENDER_EVENT, function () {
        const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
        incompleteBookshelfList.innerHTML = '';
        const completeBookshelfList = document.getElementById('completeBookshelfList');
        completeBookshelfList.innerHTML = '';
        for (const book of books) {
            const bookElement = makeBook(book);
            if (book.isComplete) {
                completeBookshelfList.append(bookElement);
            } else {
                incompleteBookshelfList.append(bookElement);
            }
        }
        searchBook();
    });

    const findingBook = document.getElementById('searchBook');

    findingBook.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBook();
    })

    function searchBook() {
        const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase()
        for (const book of books) {
            const bookContainer = document.getElementById(`book${book.id}`)
            if (book.title.toLowerCase().includes(searchTitle) || searchTitle === '') {
                bookContainer.style.display = 'block';
            } else {
                bookContainer.style.display = 'none';
            }
        }
    }

    const STORAGE_KEY = 'bookshelf-apps';

    function isStorageExist() {
        if (typeof (Storage) === undefined) {
            alert('browser tidak mendukung local storage')
            return false;
        }
        return true;
    }

    function saveData() {
        if (isStorageExist()) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
        }
    }

    function loadDataFromStorage() {
        let data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (data !== null) {
            for (const book of data) {
                books.push(book)
            }
        }
        document.dispatchEvent(new Event(RENDER_EVENT))
    }

    if (isStorageExist()) {
        loadDataFromStorage();
    }
})