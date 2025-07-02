export default function Footer() {
  return (
    <footer className="flex-item bg-[#0029FF] text-white text-center py-4 mt-12">
      <img src="/assets/logo2.png" alt="" width={40} height={40} />
      <p className="text-sm">© {new Date().getFullYear()} My Blog. All rights reserved.</p>
    </footer>
  )
}
