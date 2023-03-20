import { createContext, useState, useCallback } from "react";

import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_PUBLIC_KEY
);

const BooksContext = createContext({});

function Provider({ children }) {
  const [books, setBooks] = useState([]);

  const fetchBooks = useCallback(async () => {
    const { error, data } = await supabase.from("books").select("title, id");
    if (error) {
      console.log(error);
      return;
    }
    setBooks(data);
  }, []);

  const editBookById = async (id, newTitle) => {
    const response = await supabase
      .from("books")
      .update({ title: newTitle })
      .eq("id", id);

    if (response.status === 204) {
      await fetchBooks();
    }
  };

  const deleteBookById = async (id) => {
    const response = await supabase.from("books").delete().eq("id", id);

    if (response.status === 204) {
      await fetchBooks();
    }
  };

  const createBook = async (newTitle) => {
    const response = await supabase.from("books").insert({ title: newTitle });
    if (response.status === 201) {
      await fetchBooks();
    }
  };

  const valueToShare = {
    books,
    deleteBookById,
    editBookById,
    createBook,
    fetchBooks,
  };

  return (
    <BooksContext.Provider value={valueToShare}>
      {children}
    </BooksContext.Provider>
  );
}

export { Provider };
export default BooksContext;
