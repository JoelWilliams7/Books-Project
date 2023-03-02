import { useContext } from "react";
import BooksContext from "../Context/books";

export default function useBooksContext() {
    return useContext(BooksContext);
}