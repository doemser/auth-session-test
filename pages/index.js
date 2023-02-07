import { useSession, signIn, signOut } from "next-auth/react";
import useSWR from "swr";
import { fetchToDo } from "@/services/fetch";

export default function Home() {
  const url = "/api/to-dos";
  const { data: todos } = useSWR(url);
  const { data: session } = useSession();
  console.log(session);

  return (
    <div style={{ fontSize: "x-large" }}>
      <h1>to-do-inator</h1>

      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <button
          type="button"
          onClick={() => {
            if (session) {
              signOut();
            } else {
              signIn();
            }
          }}
        >
          {session ? "logout" : "login"}
        </button>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.target);
          const { todoInput } = Object.fromEntries(formData);

          fetchToDo("POST", url, { content: todoInput });

          event.target.reset();
        }}
      >
        <label htmlFor="todoInput">add to-do:</label>
        <input required type="text" id="todoInput" name="todoInput" />
        <button disabled={!session} type="submit">
          add
        </button>
      </form>

      <ul>
        {todos?.map((todo) => {
          return (
            <li key={todo._id}>
              {todo.content}
              <button
                type="button"
                onClick={() => {
                  fetchToDo("DELETE", url, { id: todo._id });
                }}
              >
                delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
