import serial

a=serial.Serial()
a.port='/dev/ttyUSB0'
a.baudrate=9600
a.open()

#opens the relay
a.write("A00101A2".decode('hex'))