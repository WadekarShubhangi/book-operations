const express = require("express");
const app = express();
app.use(express.json());
const Books = require("./models/book.models");
const { initializeDatabase } = require("./db/db.connect");
initializeDatabase();

// const newBook = {
//   title: "Lean In",
//   author: "Sheryl Sandberg",
//   publishedYear: 2012,
//   genre: ["Non-fiction", "Business"],
//   language: "English",
//   country: "United States",
//   rating: 4.1,
//   summary:
//     "A book about empowering women in the workplace and achieving leadership roles.",
//   coverImageUrl: "https://example.com/lean_in.jpg",
// };

// {
//   "title": "Shoe Dog",
//   "author": "Phil Knight",
//   "publishedYear": 2016,
//   "genre": ["Autobiography", "Business"],
//   "language": "English",
//   "country": "United States",
//   "rating": 4.5,
//   "summary": "An inspiring memoir by the co-founder of Nike, detailing the journey of building a global athletic brand.",
//   "coverImageUrl": "https://example.com/shoe_dog.jpg"
// }

async function addNewBook(newBook) {
  try {
    const book = new Books(newBook);
    const saveBook = await book.save();
    return saveBook;
  } catch (error) {
    console.error("Error while saving book:", error.message);
    throw error;
  }
}

app.post("/books", async (req, res) => {
  try {
    const selectedBook = await addNewBook(req.body);
    if (selectedBook) {
      res
        .status(200)
        .json({ message: "Book added successfully.", book: selectedBook });
    } else {
      res.status(404).json({ error: "failed to add book." });
    }
  } catch (error) {
    res.status(500).json({ error: " Server error." });
  }
});

async function readAllBooks() {
  try {
    const selectedBooks = await Books.find();
    return selectedBooks;
  } catch (error) {
    throw error;
  }
}

app.get("/books", async (req, res) => {
  try {
    const allBooks = await readAllBooks();
    if (allBooks) {
      res.json(allBooks);
    } else {
      res.status(404).json({ error: "No book found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

async function getBookByTitle(bookTitle) {
  try {
    const selectedBook = await Books.findOne({ title: bookTitle });
    return selectedBook;
  } catch (error) {
    throw error;
  }
}

app.get("/books/:title", async (req, res) => {
  try {
    const selectedBook = await getBookByTitle(req.params.title);
    if (selectedBook) {
      res.json(selectedBook);
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(404).json({ error: "Failed to fetch book." });
  }
});

async function getBooksByAuthor(bookAuthor) {
  try {
    const allBooks = await Books.find({ author: bookAuthor });
    return allBooks;
  } catch (error) {
    throw error;
  }
}

app.get("/books/author/:bookAuthor", async (req, res) => {
  try {
    const selectedBooks = await getBooksByAuthor(req.params.bookAuthor);
    if (selectedBooks && selectedBooks.length > 0) {
      res.json(selectedBooks);
    } else {
      res.status(404).json({ error: "No Books found for this author." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

async function getBooksByGenre(bookGenre) {
  try {
    const allBooks = await Books.find({ genre: bookGenre });
    return allBooks;
  } catch (error) {
    throw error;
  }
}

app.get("/books/genre/:genre", async (req, res) => {
  try {
    const allBooks = await getBooksByGenre(req.params.genre);

    if (allBooks && allBooks.length > 0) {
      res.json(allBooks);
    } else {
      res.status(404).json({ message: "Books not found.", books: allBooks });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load books, server error." });
  }
});

async function getBooksByReleaseYear(bookYear) {
  try {
    const allBooks = await Books.find({ publishedYear: bookYear });
    return allBooks;
  } catch (error) {
    throw error;
  }
}

app.get("/books/publishedYear/:year", async (req, res) => {
  try {
    const allBooks = await getBooksByReleaseYear(req.params.year);

    if (allBooks && allBooks.length > 0) {
      res.json(allBooks);
    } else {
      res.status(404).json({ message: "Books not found.", books: allBooks });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load books, server error." });
  }
});

async function updateRatingById(bookId, dataToUpdate) {
  try {
    const book = await Books.findByIdAndUpdate(bookId, dataToUpdate, {
      new: true,
    });
    return book;
  } catch (error) {
    throw error;
  }
}

app.post("/books/:bookId", async (req, res) => {
  try {
    const selectedBook = await updateRatingById(req.params.bookId, req.body);
    if (selectedBook) {
      res.status(200).json({
        message: "Book updated successfully.",
        updatedBook: selectedBook,
      });
    } else {
      res.json(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.json(500).json({ error: "Failed to update book, server error." });
  }
});

async function updateBookByTitle(bookTitle, dataToUpdate) {
  try {
    const updatedBook = await Books.findOneAndUpdate(
      { title: bookTitle },
      dataToUpdate,
      {
        new: true,
      }
    );
    return updatedBook;
  } catch (error) {
    throw error;
  }
}

app.post("/books/title/:title", async (req, res) => {
  try {
    const selectedBook = await updateBookByTitle(req.params.title, req.body);
    if (selectedBook) {
      res.status(200).json({
        message: "Book updated successfully.",
        book: selectedBook,
      });
    } else {
      res.status(404).json({ error: "Book Not Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update Book." });
  }
});

async function deleteBookById(bookId) {
  try {
    const getBook = await Books.findByIdAndDelete(bookId);
    return getBook;
  } catch (error) {
    throw error;
  }
}

app.delete("/books/:bookId", async (req, res) => {
    try {
        const deletedBook = await deleteBookById(req.params.bookId)
        if (deletedBook) {
            res.status(200).json({message: "Book deleted successfully.", book : deletedBook})
        } else {
            res.status(404).json({error: "Book not found."})
        }
    } catch (error) {
    res.status(500).json({ error: "Failed to delete Book, server error." });
        
    }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
