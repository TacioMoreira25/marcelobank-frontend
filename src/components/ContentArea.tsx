interface ContentProps {
  children: React.ReactNode;
}

const ContentArea: React.FC<ContentProps> = ({ children }) => {
  return (
    <div className="flex-1 overflow-auto bg-gray-100">
      <div className="p-8">{children}</div>
    </div>
  );
};

export default ContentArea;
