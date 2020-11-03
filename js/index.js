document.addEventListener("DOMContentLoaded", function() {
    const bookList = document.querySelector("#list")
    const showPanel = document.querySelector("#show-panel")
    const booksURL = 'http://localhost:3000/books'
    const myUsername = "pouros"
    const myId = 1
    
    //get books from db.json
    fetch(booksURL).then(response => response.json())
    .then(books => {
        books.forEach(book => {
            renderBook(book)
        })
    })

    const renderBook = bookObj => {
        const bookLi = document.createElement("li")
        bookLi.innerText = bookObj.title
        bookLi.id = bookObj.id
        bookList.append(bookLi)
    }

    //add event listener to each book list item
    bookList.addEventListener("click", event =>{
        getBookShowPage(event.target.id)
    })

    
    
    const getBookShowPage = bookId => {
        //fetch book show page
        fetch(booksURL+`/${bookId}`)
        .then(response => response.json())
        .then(book => {
            renderBookShowPage(book)
        })
    }

    const renderBookShowPage = bookObj => {
        // debugger
        showPanel.innerHTML = ""
        
        //image thumbnail
        const thumbnail = document.createElement("img")
        thumbnail.src = bookObj.img_url

        //book title
        const bookTitle = document.createElement("h2")
        bookTitle.innerText= bookObj.title

        //subtitle
        const bookSubtitle = document.createElement("h3")
        bookSubtitle.innerText = bookObj.subtitle

        const bookAuthor = document.createElement("h4")
        bookAuthor.innerText = `By: ${bookObj.author}`
        
        //book description
        const bookDescription = document.createElement("p")
        bookDescription.innerText = bookObj.description

        //users
        const bookUsers = document.createElement("ul")
        const userList = users =>{
            users.forEach(user =>{
                const userLi = document.createElement('li')
                userLi.innerText = user.username
                userLi.id = user.id
                bookUsers.append(userLi)
            })
        }
        userList(bookObj.users)

        //like button
        const likeButton = document.createElement("button")
        likeButton.innerText = 'Like'
        likeButton.id = bookObj.id
        // const data = [{username: myUsername, id: myId}]
        const data = { "users": bookObj.users}


        likeButton.addEventListener("click", event => {
            //post request
            bookObj.users.push({username: myUsername, id: myId})
            fetch(booksURL+`/${likeButton.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(bookObj =>{
                renderBookShowPage(bookObj)
            })
        })



        showPanel.append(thumbnail,bookTitle,bookSubtitle,bookAuthor,bookDescription,bookUsers,likeButton)

    }

});
