type PageTitleProps = {
  children: string;
};

export function PageTitle({ children }: PageTitleProps) {
  return (
    <header className="page-header container">
      <h1>{children}</h1>
    </header>
  );
}
