const PageIntro = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="text-2xl font-medium text-resin-black mb-[25px]">
      {children}
    </h1>
  );
};

export default PageIntro;
