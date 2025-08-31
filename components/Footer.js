export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 md:px-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-xl font-bold">Follow us</h3>
          <div className="flex gap-4 mt-2">
            <a href="https://www.instagram.com/ankit_kumarkairo/" className="hover:text-green-300">Instagram</a>
            <a href="#" className="hover:text-green-300">Twitter</a>
            <a href="https://www.linkedin.com/in/ankit-kumar-kero-b86764281" className="hover:text-green-300">Linkdin</a>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold">Quick Links</h3>
          <div className="flex gap-4 mt-2">
            <a href="/about" className="hover:text-green-300">About</a>
            <a href="#" className="hover:text-green-300">Terms</a>
            <a href="#" className="hover:text-green-300">Privacy</a>
          </div>
        </div>
        <div className="text-sm text-gray-400 mt-4 md:mt-0">© 2025 Hello Inc.</div>
      </div>
    </footer>
  );
}
