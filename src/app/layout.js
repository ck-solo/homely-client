import "./globals.css";

export const metadata = {
  title: "Homely - Find Your Perfect Rental and Roommate",
  description: "A modern rental and roommate finder application.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
