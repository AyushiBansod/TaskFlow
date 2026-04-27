export default function FloatingAddButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add task"
      className="fixed right-5 bottom-5 z-40 h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition md:absolute md:right-0 md:bottom-0"
    >
      <span className="text-2xl leading-none">+</span>
    </button>
  );
}
