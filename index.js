class Book {
    name;
    pages;
    author;
    id;
    constructor(name, pages, author, id) {
        this.name = name;
        this.pages = pages;
        this.author = author;
        this.id = id;
    }
}
class UI {
    static displayBooks() {
        const books = Store.getBooksS();

        books.forEach((book) => UI.addBookToList(book));

    }
    static addBookToList(book) {
        //main container
        const container = document.querySelector('#bookcontainer');

        //parent container
        const book_container = document.createElement('div');
        //add class 
        book_container.classList.add('col-lg-6');
        book_container.classList.add('col-md-6');
        book_container.classList.add('col-sm-12');
        const content = `
     
      <div class="book">
      <h1 class="bookname">Name: ${book.name}</h1>
      <h1 class="pages">Pages: ${book.pages}</h1>
      <h1 class="bookauthor">author: ${book.author}</h1>
      <h6 class="bookid">${book.id}</h6>
      <div class="buttons">
          <button type="button" class="edit">Edit</button>
          <button typr="button" class="Delete">Delete</button>
      </div>
      </div>
        `;

        book_container.innerHTML = content;
        container.append(book_container);



    }
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.setAttribute('position', 'fixed')
        div.className = `alert alert-${className} mt-3`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        container.append(div);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 1500);
    }

    static clearallfields() {
        document.querySelector('#book-name').value = '';
        document.querySelector('#book-pagecount').value = '';
        document.querySelector('#book-author').value = '';
    }
    static deleteBook(el) {
        if (el.classList.contains('Delete')) {
            el.parentElement.parentElement.parentElement.remove();
        }
    }
    static sidebarnumber() {
        const books = Store.getBooksS();
        document.querySelector('.booksnumber').innerHTML = books.length;

    }
    static modfybook(id, author, pages, name) {
        const idnum = Number(id)
        Store.editBookinS(idnum, name, author, pages);

    }

}

// Store Class: Handles Storage
class Store {
    //get books from storage
    static getBooksS() {

            let books;
            if (localStorage.getItem('books') === null) {
                books = [];
            } else {
                books = JSON.parse(localStorage.getItem('books'));
            }

            return books;
        }
        //add books from storage
    static addBooktoS(book) {
            const books = Store.getBooksS();
            //add stiky class to add book
            if (books.length >= 3) {
                document.querySelector('.add-book').classList.add('stiky');
            } else if (books.length < 3) { document.querySelector('.add-book').classList.remove('stiky'); }

            books.push(book);
            localStorage.setItem('books', JSON.stringify(books));
        }
        //remove boook from storage
    static removeBookfromS(id) {

            const books = Store.getBooksS();
            books.forEach((book, index) => {
                if (book.id === id) {
                    books.splice(index, 1);
                }
            });


            //add stiky class to add book
            if (books.length >= 3) {
                document.querySelector('.add-book').classList.add('stiky');
            } else if (books.length < 3) { document.querySelector('.add-book').classList.remove('stiky'); }


            localStorage.setItem('books', JSON.stringify(books));
        }
        //edit boook in storage
    static editBookinS(id, name, author, pages) {
        const books = Store.getBooksS();
        books.forEach((book) => {
            if (book.id === id) {
                {
                    book.name = name;
                    book.pages = pages;
                    book.author = author;
                }

            }
            localStorage.setItem('books', JSON.stringify(books));

        });
    }

    static id() {
        let id = 1;
        const books = Store.getBooksS();
        books.forEach((book) => {
            if (id === book.id) {
                id += 1;
            } else if (book.id === null) {
                id = 1;
            }
        })
        return id;
    }

}

$(document).ready(function() {
    //hide delete nification on start app

    $('.delete_nif').hide();

    //hide add bookinfo in start 
    $("#book_info").hide();
    //hide add bookinfo in start 
    $("#book_edit").hide();
    //add stiky class to add book
    const books = Store.getBooksS();
    if (books.length >= 3) {
        document.querySelector('.add-book').classList.add('stiky');
    } else if (books.length < 3) { document.querySelector('.add-book').classList.remove('stiky'); }


});
// run-in
// Event: Display Books  on start app
document.addEventListener('DOMContentLoaded', UI.displayBooks);
//setup siedebar on start app
document.addEventListener('DOMContentLoaded', UI.sidebarnumber);

// Event: Add a Book
document.querySelector('#bookinfo').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const name = document.querySelector('#book-name').value;
    const pages = document.querySelector('#book-pagecount').value;
    const author = document.querySelector('#book-author').value;
    id = 0;

    // Validate
    if (name === '' || author === '' || pages === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {

        id = Store.id();
        // Instatiate book
        const book = new Book(name, pages, author, id);
        // Add Book to UI
        UI.addBookToList(book);

        // Add book to store
        Store.addBooktoS(book);

        // Show success message
        UI.showAlert('Book Added', 'success');

        // Clear fields
        UI.clearallfields();
        //update sidebar number
        UI.sidebarnumber();

        setTimeout(() => {
            $(document).ready(function() {
                $("#book_info").fadeOut(800);

            });
        }, 200);

    }
});

//add event to show book add tabel
document.querySelector('#btn-addbook').addEventListener('click', (e) => {

    $(document).ready(function() {
        $("#book_info").fadeIn(1500);
    });


})

//add event to hide tabel
document.querySelector('#cancel').addEventListener('click', () => {

    $(document).ready(function() {
        $("#book_info").fadeOut(1000);

    });


})

// Event: Remove or edit a Book 
document.querySelector('#bookcontainer').addEventListener('click', (e) => {

    ////////////////////////////////////////////////////////////////////////////////////////
    if (e.target.classList.contains('Delete')) {
        //show delete nification
        $(document).ready(function() {
            $('.delete_nif').fadeIn(1000);

        });
        document.querySelector('.delete_nif').addEventListener('click', (c) => {

            if (c.target.classList.contains('ok')) {

                //remove the book from ui
                UI.deleteBook(e.target);

                //remove the book from store
                num = e.target.parentElement.previousElementSibling.textContent;
                Store.removeBookfromS(Number(num));


                //update sidebar number
                UI.sidebarnumber();
                $(document).ready(function() {
                    $('.delete_nif').fadeOut(500);

                });
            } else if (c.target.classList.contains('cancel')) {
                //show delete nification
                $(document).ready(function() {
                    $('.delete_nif').fadeOut(500);

                });
            }
        });
    } else if (e.target.classList.contains('edit')) {

        const id = e.target.parentElement.previousElementSibling.textContent;
        // console.log(id);
        const author = e.target.parentElement.previousElementSibling.previousElementSibling.textContent.slice(8);
        // console.log(author);
        const pages = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent.slice(7);
        //  console.log(pages);
        const name = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent.slice(6);
        //  console.log(name);
        $(document).ready(function() {
            $("#book_edit").fadeIn(700);
        });

        setTimeout(() => {
            document.querySelector('#eidtbook-name').value = name;
            document.querySelector('#eidtbook-pagecount').value = pages;
            document.querySelector('#eidtbook-author').value = author;

        }, 100);
        document.querySelector('#book_edit').addEventListener('click', (e) => {
            if (e.target.classList.contains('eidtok')) {
                let name = document.querySelector('#eidtbook-name').value;
                let pages = document.querySelector('#eidtbook-pagecount').value;
                let author = document.querySelector('#eidtbook-author').value;
                // console.log({ name, pages, author });
                if (name === '' || author === '' || pages === '') {
                    UI.showAlert('Please fill in all fields', 'danger');
                } else {
                    UI.modfybook(id, author, pages, name);
                    name = '';
                    pages = '';
                    author = '';
                    UI.showAlert('edited', 'primary');
                    $(document).ready(function() {
                        $("#book_edit").fadeOut(700);
                    });
                }

            } else if (e.target.classList.contains('eidtcancel')) {
                $(document).ready(function() {
                    $("#book_edit").fadeOut(700);
                });


            }
        });






    }
});