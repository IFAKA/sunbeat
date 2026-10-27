# Wi-Fi survey on a Pico 2 W (MicroPython): scans 2.4 GHz networks, logs strength to log.csv on the Pico.
# Prints: networks seen, strongest, and the summed power of all beacons in microwatts (what a rectenna could catch at best).
import network, time
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
SCANS = 5
rows = []
for s in range(SCANS):
    r = wlan.scan()  # (ssid, bssid, channel, rssi, security, hidden)
    rows.append(r)
    with open("log.csv", "a") as f:
        for ap in r:
            f.write("%d,%d,%d,%s\n" % (time.time(), ap[2], ap[3], ap[0].decode("utf-8", "ignore")))
    time.sleep_ms(500)
best = {}
for r in rows:
    for ap in r:
        best[ap[1]] = max(best.get(ap[1], -200), ap[3])
mw = sum(10 ** (v / 10) for v in best.values())  # mW at the antenna, 0 dBi
print("networks:", len(best), " strongest:", max(best.values()) if best else None, "dBm")
print("sum of all beacons: %.4f uW (before rectifier loss)" % (mw * 1000))
print("sorted dBm:", sorted(best.values(), reverse=True)[:10])
