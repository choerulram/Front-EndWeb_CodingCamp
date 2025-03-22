// get elemen-elemen
const bookForm = document.getElementById('bookForm');
const searchForm = document.getElementById('searchBook');
const searchInput = document.getElementById('searchBookTitle');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');
const editBookModal = document.getElementById('editBookModal');
const closeModal = document.getElementById('closeModal');
const editBookForm = document.getElementById('editBookForm');

// simpan buku ke localstorage
function saveBooks(books) {
    localStorage.setItem('books', JSON.stringify(books));
}

// ambil buku dari localstorage
function getBooks() {
    const books = localStorage.getItem('books');
    return books ? JSON.parse(books) : [];
}

// variabel data untk diedit
let currentBook;

// tampilkan buku
function displayBooks(books = null) {
    if (books === null) {
        books = getBooks();
    }
    
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('card');
        bookItem.setAttribute('data-bookid', book.id);
        bookItem.setAttribute('data-testid', 'bookItem');

        bookItem.innerHTML = `
            <h3 data-testid="bookItemTitle">${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div class="button_book_shelf">
                <button class="${book.isComplete ? 'undone' : 'done'}" data-testid="bookItemIsCompleteButton">
                    ${book.isComplete ? 'Belum Selesai Dibaca' : 'Selesai Dibaca'}
                </button>
                <button class="delete" data-testid="bookItemDeleteButton">Hapus Buku</button>
                <button class="edit" data-testid="bookItemEditButton">Edit Buku</button>
            </div>
        `;

        // event listener tombol 'Belum Selesai Dibaca' / 'Selesai Dib aca'
        bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => {
            book.isComplete = !book.isComplete;
            saveBooks(books);
            displayBooks();
        });

        // event listener tombol delete
        bookItem.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', () => {
            const confirmDelete = confirm("Apakah Anda yakin ingin menghapus buku ini?");
            if (confirmDelete) {
                const index = books.indexOf(book);
                books.splice(index, 1);
                saveBooks(books);
                displayBooks();
            }
        });

        // event listener tombol edit
        bookItem.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', () => {
            // isi form data buku yang akan diedit
            document.getElementById('editBookFormTitle').value = book.title;
            document.getElementById('editBookFormAuthor').value = book.author;
            document.getElementById('editBookFormYear').value = book.year;
            document.getElementById('editBookFormIsComplete').checked = book.isComplete;

            currentBook = book;

            // tampil modal
            editBookModal.style.display = "block";
        });

        // tambahkan buku ke rak masingmasing
        if (book.isComplete) {
            completeBookList.appendChild(bookItem);
        } else {
            incompleteBookList.appendChild(bookItem);
        }
    });
}

// event listener tambah buku
bookForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    const newBook = {
        id: Date.now(),
        title,
        author,
        year,
        isComplete
    };

    const books = getBooks();
    books.push(newBook);
    saveBooks(books);
    displayBooks();

    bookForm.reset();
});

// event listener input search
searchInput.addEventListener('input', () => {
    const searchQuery = searchInput.value.toLowerCase();
    if (searchQuery === '') {
        displayBooks();
    }
});

// event listener tombol search
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchQuery = searchInput.value.toLowerCase();
    const books = getBooks();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchQuery));
    displayBooks(filteredBooks);
});

// event listener untuk menutup modal
closeModal.onclick = function() {
    editBookModal.style.display = "none";
}

// event listener form edit buku
editBookForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // ambil nilai dari form
    const title = document.getElementById('editBookFormTitle').value;
    const author = document.getElementById('editBookFormAuthor').value;
    const year = parseInt(document.getElementById('editBookFormYear').value);
    const isComplete = document.getElementById('editBookFormIsComplete').checked;

    // update data buku
    currentBook.title = title;
    currentBook.author = author;
    currentBook.year = year;
    currentBook.isComplete = isComplete;

    const books = getBooks();

    // cari index buku yang sedang diedit
    const index = books.findIndex(book => book.id === currentBook.id);
    if (index !== -1) {
        books[index] = currentBook;
    }

    // simpan buku ke localstorage
    saveBooks(books);
    displayBooks();

    // tutup modal edit
    editBookModal.style.display = "none";
});

// tutup modal jika mengklik di luar modal
window.onclick = function(event) {
    if (event.target === editBookModal) {
        editBookModal.style.display = "none";
    }
};

// tampil buku saat halaman dimuat
displayBooks();