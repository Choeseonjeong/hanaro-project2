// components/TodoInput.tsx
interface TodoInputProps {
  input: string;
  setInput: (value: string) => void;
  addTodo: () => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ input, setInput, addTodo }) => {
  return (
    <div className="flex justify-center mb-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="할 일을 입력하세요"
        className="border rounded-l px-4 py-2 w-1/2"
      />
      <button
        onClick={addTodo}
        className="bg-blue-500 text-white rounded-r px-4 py-2"
      >
        추가
      </button>
    </div>
  );
};

export default TodoInput;
