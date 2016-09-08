#!/bin/bash

echo "testing"

# create hotspot wireless network

# 		check and install hostapd

sudo apt-get install hostapd dnsmasq

zcat /usr/share/doc/hostapd/examples/hostapd.conf.gz | sudo tee -a /etc/hostapd/hostapd.conf

# determine the wireless interface here


# echo all this to /etc/hostapd/hostapd.conf

interface=wlan0
ssid=Example-WLAN
hw_mode=g
wpa=2
wpa_passphrase=PASS
wpa_key_mgmt=WPA-PSK WPA-EAP WPA-PSK-SHA256 WPA-EAP-SHA256

# replace /etc/network/interfaces with this

# interfaces(5) file used by ifup(8) and ifdown(8)
auto lo
iface lo inet loopback

auto wlan0
iface wlan0 inet static
hostapd /etc/hostapd/hostapd.conf
address 192.168.8.1
netmask 255.255.255.0

# echo this to /etc/dnsmasq.conf

interface=lo,wlan0
no-dhcp-interface=lo
dhcp-range=192.168.8.20,192.168.8.254,255.255.255.0,12h

# echo this to /etc/sysctl.conf

net.ipv4.ip_forward=1

# append this to /etc/rc.local
# setup IP tables rule to route all traffic to express server
#iptables -t nat -A OUTPUT -p tcp -j DNAT --to 192.168.0.1:80

iptables -t nat -A POSTROUTING -s 192.168.8.0/24 ! -d 192.168.8.0/24  -j MASQUERADE

# just cuz

sudo rfkill unblock 0

# replace /etc/NetworkManager/NetworkManager.conf with this

[main]
plugins=ifupdown,keyfile,ofono
dns=dnsmasq
 
[ifupdown]
managed=false

# now echo to the user a reboot

# make the express server launch on startup
#