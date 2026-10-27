// Logs nearby Wi-Fi signal strength from this Mac to log.csv.
// Run: swift wifi_survey_mac.swift [interval_s=5] [scans=12]
// Columns: time,ssid,bssid,channel,band,rssi_dbm,noise_dbm
// Last line printed: one-line summary (APs seen, strongest dBm, summed power in nW).
import CoreWLAN
import Foundation

let args = CommandLine.arguments
let interval = args.count > 1 ? Double(args[1]) ?? 5 : 5
let scans = args.count > 2 ? Int(args[2]) ?? 12 : 12

guard let iface = CWWiFiClient.shared().interface() else {
    print("FAIL no Wi-Fi interface")
    exit(1)
}

let logPath = FileManager.default.currentDirectoryPath + "/log.csv"
if !FileManager.default.fileExists(atPath: logPath) {
    try? "time,ssid,bssid,channel,band,rssi_dbm,noise_dbm\n".write(toFile: logPath, atomically: true, encoding: .utf8)
}
let handle = FileHandle(forWritingAtPath: logPath)!
handle.seekToEndOfFile()

let fmt = ISO8601DateFormatter()
var seen = Set<String>()
var strongest = -200
var lastSumNW = 0.0

for i in 0..<scans {
    let now = fmt.string(from: Date())
    guard let nets = try? iface.scanForNetworks(withSSID: nil) else {
        print("FAIL scan (location permission? run once from Terminal and allow)")
        exit(1)
    }
    var sumNW = 0.0
    for n in nets {
        let ssid = (n.ssid ?? "hidden").replacingOccurrences(of: ",", with: " ")
        let bssid = n.bssid ?? "?"
        let ch = n.wlanChannel?.channelNumber ?? 0
        let band: String
        switch n.wlanChannel?.channelBand {
        case .band2GHz: band = "2.4"
        case .band5GHz: band = "5"
        case .band6GHz: band = "6"
        default: band = "?"
        }
        let line = "\(now),\(ssid),\(bssid),\(ch),\(band),\(n.rssiValue),\(n.noiseMeasurement)\n"
        handle.write(line.data(using: .utf8)!)
        seen.insert("\(ssid)/\(ch)")
        strongest = max(strongest, n.rssiValue)
        // dBm -> nW: 10^(dBm/10) mW * 1e6 nW/mW
        sumNW += pow(10.0, Double(n.rssiValue) / 10.0) * 1e6
    }
    lastSumNW = sumNW
    if i < scans - 1 { Thread.sleep(forTimeInterval: interval) }
}
handle.closeFile()
print(String(format: "OK scans=%d aps=%d strongest=%d dBm last_sum=%.2f nW (%.4f uW) log=%@",
             scans, seen.count, strongest, lastSumNW, lastSumNW / 1000.0, logPath))
