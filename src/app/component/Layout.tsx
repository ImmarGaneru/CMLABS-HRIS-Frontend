import React from "react";

type LayoutProps = {
  children: React.ReactNode;
  pageId: string;
};

export default function Layout({ children, pageId }: LayoutProps) {
  return (
    <div id={pageId}>
      <header>Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
}
