<div className="flex h-screen">
  {/* 📍 Left: Users List */}
  <div className="w-[350px] bg-gray-900 text-white flex flex-col p-4 overflow-y-auto">
    <h2 className="text-2xl font-bold mb-4">Available Users</h2>
    {/* Map all users */}
    {users.map((user) => (
      <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded">
        <img src={user.avatar} className="w-10 h-10 rounded-full" />
        <div>
          <div className="font-semibold">{user.name}</div>
          <div className="text-xs text-gray-400">Online</div>
        </div>
      </div>
    ))}
  </div>

  {/* 🗨️ Right: Chat/Video Area */}
  <div className="flex-1 bg-chat-dark bg-cover bg-center relative">
    <div className="flex justify-between items-center px-6 py-4 bg-black/70 text-white">
      <div className="font-semibold">{activeUser.name}</div>
      <div className="flex gap-4">
        <button className="hover:text-green-400">📹</button>
        <button className="hover:text-green-400">📞</button>
        <button className="hover:text-green-400">🔍</button>
      </div>
    </div>

    {/* Chat body */}
    <div className="p-6 overflow-y-auto h-[calc(100%-100px)]">
      {/* Messages Here */}
    </div>
  </div>
</div>
