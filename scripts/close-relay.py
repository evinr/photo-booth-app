import serial

a=serial.Serial()
a.port='/dev/ttyUSB0'
a.baudrate=9600
a.open()

# closes the relay
a.write("A00100A1".decode('hex'))