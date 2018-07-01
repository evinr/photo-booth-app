#!/bin/bash

echo "testing"

# create adhoc wireless network
# ./wireless-setup.sh

# setup IP tables rule to route all traffic to express server
#iptables -t nat -A OUTPUT -p tcp -j DNAT --to 192.168.0.1:80


# make the express server launch on startup
#

# setup Chrome to
	# launch on startup
	# homepage to /capture.html
	# chromium --homepage "localhost:8081/capture.html"
	# launch in Kiosk mode