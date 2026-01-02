const Message = ({ msg }) => {
  return (
    <div className={`my-2 ${msg.self ? "text-right" : "text-left"}`}>
      <span className="bg-blue-500 text-white px-3 py-1 rounded">
        {msg.message}
      </span>
    </div>
  );
};

export default Message;
