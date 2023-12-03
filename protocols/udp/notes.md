Reference: https://www.ibm.com/docs/en/zos/2.3.0?topic=programs-c-socket-udp-server

Run the netcat server to send tcp/udp requests: nc -u 127.0.0.1 PORT



Look for the resource usage by process ID:
Rough: ps -up 16721

More infor using: 
ls -la /proc/[pid]/status (Explore this more)