import EmptyState from '@/components/EmptyState';

const EmptyList = ({
  title,
  message,
  src,
}: {
  title: string;
  message: string;
  src: string;
}) => {
  return <EmptyState title={title} description={message} illustration={src} />;
};

export default EmptyList;
