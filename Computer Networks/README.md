# Computer Networks: A Visual Learning Journey

This workspace builds a practical picture of how network communication works: how data travels between hosts, how transport protocols deliver it to applications, and how network tools reveal what happens along the way.

## Follow the sequence

### 1. Start with the journey across networks

[Data Routing Journey](data-routing-journey.md) explains what happens when a packet stays on a local network or crosses routers to reach a remote host. Start here to understand the difference between an end-to-end IP address and the link-layer addresses used for each local hop.

### 2. See how UDP delivers data to an application

[UDP](udp.md) introduces the transport layer, ports, connectionless communication, and the trade-off between low overhead and built-in reliability.

#### Read the UDP datagram

![UDP datagram structure](images/udp_datagram.png)

Read the header from top to bottom:

1. **Source port** identifies the sending application endpoint.
2. **Destination port** identifies the receiving application endpoint. The operating system uses it to deliver the payload to the appropriate socket.
3. **Length** gives the size of the complete UDP datagram: its 8-byte header plus its payload.
4. **Checksum** helps detect corruption in the datagram. It does not make UDP retransmit damaged or missing data.

The application data follows the header. UDP's fixed header is only 8 bytes; the ports provide application-to-application delivery, while IP handles delivery between hosts.

### 3. Use ICMP to inspect network behavior

[ICMP, TTL, Ping & Traceroute](icmp-traceroute.md) shows how diagnostic messages and the IP time-to-live field can reveal reachability, delay, and the routers along a path.

## Keep this layer model in mind

```text
Application data
       ↓
UDP header + data = UDP datagram
       ↓
IP header + UDP datagram = IP packet
       ↓
Link-layer header + IP packet = frame for the next hop
```

Each note focuses on one part of this sequence, so the concepts connect from the application down to the network and link layers.