const UserInforCol = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="space-y-3 ">
      <p className="text-xs text-gray-3">{title}</p>
      <h5>{value}</h5>
    </div>
  );
};

export default UserInforCol;
