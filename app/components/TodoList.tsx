// components/TodoList.tsx
interface TodoListProps {
  todos: string[];
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  return (
    <ul className="list-disc mx-auto w-1/2">
      {todos.map((todo, index) => (
        <li key={index} className="border-b py-2">
          {todo}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
