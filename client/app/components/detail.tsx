interface InfoDetailProps {
  title: string;
  value: string;
}

const InfoDetail = ({ title, value }: InfoDetailProps) => {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="font-medium text-raisin capitalize">{value}</p>
    </div>
  );
};

export default InfoDetail;
