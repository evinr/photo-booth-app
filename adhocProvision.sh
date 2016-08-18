#!/bin/bash

echo "testing"

# create adhoc wireless network
#

# setup IP tables rule to route all traffic to express server
#iptables -t nat -A OUTPUT -p tcp -j DNAT --to 192.168.0.1:80


# make the express server launch on startup
#