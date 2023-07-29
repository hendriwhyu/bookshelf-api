const { nanoid } = require("../node_modules/nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validasi jika nama buku tidak terdefinisi
  if (name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  // Validasi jika readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  // Proses penambahan buku baru
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  // Validasi keberhasilan penambahan buku baru
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201); // Kode status 201 menandakan resource berhasil dibuat
    return response;
  }

  // Response ketika gagal menambahkan buku
  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500); // Kode status 500 menandakan ada kesalahan server
  return response;
};

// Handler mengambil semua buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // Inisialisasi variabel filterBooks dengan nilai awal dari array books
  let filterBooks = books;

  // Filter berdasarkan nama buku jika parameter name diberikan
  if (name !== undefined) {
    filterBooks = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter berdasarkan status membaca buku jika parameter reading diberikan
  if (reading !== undefined) {
    filterBooks = filterBooks.filter(
      (book) => book.reading === !!Number(reading)
    );
  }

  // Filter berdasarkan status selesai membaca buku jika parameter finished diberikan
  if (finished !== undefined) {
    filterBooks = filterBooks.filter(
      (book) => book.finished === !!Number(finished)
    );
  }

  // Jika jumlah buku yang difilter lebih dari 2, ambil hanya 2 buku pertama
  if (filterBooks.length > 2) {
    filterBooks = filterBooks.slice(0, 2);
  }

  // Menyiapkan respon dengan status "success" dan data berisi array buku yang telah difilter
  const response = h.response({
    status: "success",
    data: {
      books: filterBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);

  return response; // Mengembalikan respon sebagai hasil dari handler
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  // Mencari buku berdasarkan id dalam array books
  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    // Jika buku ditemukan, kirim respons dengan status "success" dan data buku
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200); // Mengatur kode status menjadi 200 (OK)
    return response;
  } else {
    // Jika buku tidak ditemukan, kirim respons dengan status "fail" dan pesan kesalahan
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404); // Mengatur kode status menjadi 404 (Not Found)
    return response;
  }
};


const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  // Mendapatkan data buku yang akan diedit dari payload request
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Mendapatkan tanggal saat ini
  const updatedAt = new Date().toISOString();

  // Mencari indeks buku berdasarkan id yang diberikan
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    // Jika buku ditemukan, lakukan validasi dan perbarui data buku
    if (name === undefined) {
      // Validasi jika nama buku tidak diisi, kirimkan respon gagal dengan status code 400
      const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    }

    if (pageCount < readPage) {
      // Validasi jika readPage lebih besar dari pageCount, kirimkan respon gagal dengan status code 400
      const response = h.response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    }

    // Hitung status finished berdasarkan nilai pageCount dan readPage
    const finished = pageCount === readPage;

    // Perbarui data buku pada indeks yang ditemukan
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    // Kirimkan respon berhasil dengan status code 200
    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  // Jika buku tidak ditemukan, kirimkan respon gagal dengan status code 404
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
