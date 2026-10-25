--[[
  CerdasBareng — Lobby Place (ServerScriptService)
  REFERENSI untuk Roblox dev (scope #3). Belum dites di Studio — sesuaikan dengan backend final.

  Alur:
    1. Siswa klik "Masuk Kelas" di web -> backend buat join token -> browser buka
       roblox.com/games/start?placeId=<LOBBY>&launchData=<joinToken>
    2. Saat player masuk Lobby, server membaca LaunchData (join token)
    3. Server menukar token ke backend CB (server-to-server, pakai API key rahasia)
    4. Backend mengembalikan sessionId + accessCode reserved server (jika sudah ada)
    5. Jika belum ada accessCode -> Lobby memanggil ReserveServer lalu melaporkan
       accessCode ke backend (backend menyimpan yang PERTAMA masuk, lalu mengembalikan
       accessCode kanonik, supaya semua siswa satu sesi masuk server yang sama)
    6. TeleportAsync ke reserved server dengan TeleportData { sessionId, role }

  Catatan penting:
    - Game Settings > Security > "Allow HTTP Requests" harus ON.
    - API key disimpan via Secrets Store / tidak di-hardcode di repo publik.
    - ReserveServer hanya bisa dipanggil dari server game Roblox (bukan dari web),
      karena itu reservasi dilakukan di Lobby.
]]

local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")
local TeleportService = game:GetService("TeleportService")

local API_BASE = "https://api.cerdasbareng.id/api/v1/roblox/game" -- TODO: ganti
local API_KEY = "REPLACE_WITH_SECRET" -- TODO: ambil dari HttpService:GetSecret()
local CLASSROOM_PLACE_ID = 0 -- TODO: placeId world kelas (mis. Neo-Beijing)

local function post(path: string, body: { [string]: any })
	local ok, res = pcall(function()
		return HttpService:RequestAsync({
			Url = API_BASE .. path,
			Method = "POST",
			Headers = { ["Content-Type"] = "application/json", ["x-api-key"] = API_KEY },
			Body = HttpService:JSONEncode(body),
		})
	end)
	if not ok then
		return nil, "HTTP_ERROR"
	end
	if not res.Success then
		return nil, res.StatusCode
	end
	return HttpService:JSONDecode(res.Body), nil
end

local function kick(player: Player, msg: string)
	player:Kick("CerdasBareng: " .. msg .. "\nSilakan kembali ke dashboard dan klik Masuk Kelas lagi.")
end

Players.PlayerAdded:Connect(function(player)
	local joinData = player:GetJoinData()
	local token = joinData and joinData.LaunchData
	if not token or token == "" then
		return kick(player, "Masuk lewat tombol di website CerdasBareng ya.")
	end

	-- 3. tukar token (sekali pakai) -> data sesi
	local data, err = post("/redeem-token", { token = token, robloxUserId = player.UserId })
	if not data or not data.allowed then
		return kick(player, (data and data.message) or ("Token tidak valid (" .. tostring(err) .. ")"))
	end

	-- 5. siapkan reserved server bila belum ada
	local accessCode = data.accessCode
	if not accessCode then
		local okR, code = pcall(function()
			return TeleportService:ReserveServer(data.placeId or CLASSROOM_PLACE_ID)
		end)
		if not okR then
			return kick(player, "Gagal menyiapkan ruang kelas.")
		end
		local saved = post("/sessions/" .. data.sessionId .. "/access-code", { accessCode = code })
		accessCode = (saved and saved.accessCode) or code
	end

	-- 6. teleport
	local options = Instance.new("TeleportOptions")
	options.ReservedServerAccessCode = accessCode
	options:SetTeleportData({ sessionId = data.sessionId, role = data.role }) -- role: "tutor" | "student"

	local okT, tErr = pcall(function()
		TeleportService:TeleportAsync(data.placeId or CLASSROOM_PLACE_ID, { player }, options)
	end)
	if not okT then
		warn("Teleport gagal:", tErr)
		kick(player, "Teleport gagal, coba lagi.")
	end
end)
