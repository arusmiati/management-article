export default function Footer() {
  return (
    <footer className="bg-[#0029FF] text-white py-4 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
        <img src="/assets/logo3.png" alt="Logo" width={100} height={100} />
        <p className="text-sm">
          © {new Date().getFullYear()} Blog Genzet. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
