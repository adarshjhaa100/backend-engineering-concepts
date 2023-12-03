#include <stdio.h>
// #include <bsdtypes.h>
// #include <in.h>
// #include <socket.h>
#include <stdlib.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <string.h>
#include <threads.h>
#include <unistd.h>

void error_message(const char* message){
    fprintf(stderr, "%s", message);
}

// int create_udp_socket(){



// }

int main()
{   

    
    int fd;
    socklen_t namelen;

    struct sockaddr_in server, client;

    printf("\nGETPID: %d, GETPPID: %d\n", getpid(), getppid());


    /* Create (datagram socket) in (Internet domain) and use default UDP 
    protocol */   
    if((fd = socket(AF_INET, SOCK_DGRAM, 0)) < 0){
        error_message("socket()");
        exit(1);
    }



    /* Init DS for server. Listening Port, IP Address to listen to from 
    network interface, Address Family */
    server.sin_addr.s_addr = INADDR_ANY; //Note: Make this a fixed address when in production. IF want a static IP, make it like: inet_addr("127.0.0.1")
    server.sin_family = AF_INET;
    server.sin_port = 0;                 // Dynamically allocate a port

    
    /* Bind name to socket so that clients can send messages, Allows 
    OS to demux messages to correct server */
    if ( bind(fd, (struct sockaddr *)&server, sizeof(server)) < 0 )
    {
        error_message("bind()");
        exit(2);
    }


    /* Find port assigned */
    namelen = sizeof(server);
    printf("\nnamelen: %d, filedesc: %d\n", namelen, fd);
    if(getsockname(fd, (struct sockaddr *)&server, &namelen) < 0)
    {
        error_message("getsockname()");
        exit(3);
    }
    char server_address[100];
    socklen_t slen = sizeof(server_address);
    const char* babu = inet_ntop(AF_INET, (void *)&server.sin_addr.s_addr,server_address, slen);
    
    printf("\nPort assigned: %d, Server address %s\n", 
    ntohs(server.sin_port), babu);
    


    /* Receive message to socket in buffer */
    char buff[50];
    socklen_t client_adr_len = sizeof(client);
    uint32_t end = 0;


    while(end == 0)
    {
        if(recvfrom(fd, buff, sizeof(buff), 0, (struct sockaddr *)&client, &client_adr_len) < 0)
        {
            error_message("\nrecvfrom()\n");
            exit(4);
        }

        printf("Received message %s from domain %s port %d internet\
        address %s\n",
        buff,
        (client.sin_family == AF_INET?"AF_INET":"UNKNOWN"),
        ntohs(client.sin_port),
        inet_ntoa(client.sin_addr));
        
        if(strcmp(buff, "END") == 0) end = 1;

        buff[0] = '\0';
        
    }

    if(close(fd) < 0)
    {
        error_message("\nclose()\n");
        exit(5);
    }

    printf("\nUDP Server Closed \n");





    return 0;
}