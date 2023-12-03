#include <stdio.h>
// #include <bsdtypes.h>
// #include <in.h>
// #include <socket.h>
#include <stdlib.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <string.h>
#include <unistd.h>

#define PORT 8081

void error_message(const char* message){
    fprintf(stderr, "\n[error] %s\n", message);
}


int establish_tcp_conn(int * sock_fd, int* sock_fd_new, 
                        struct sockaddr_in* server, 
                        struct sockaddr_in* client)
{
    printf("\nTrying to open a TCP Socket\n");
    
    
    socklen_t client_addr_len = 0;

    /* Create a stream socket (SOCK Stream) */
    if((*sock_fd = socket(AF_INET, SOCK_STREAM, 0)) < 0 )
    {
        error_message("socket()");
        exit(1);
    }
    printf("\n Sock FD passive: %d\n", *sock_fd);

    
    /* socket fd by default doesnt have an address. Bind adds the address to sock_fd */
    (*server).sin_addr.s_addr = inet_addr("127.0.0.1");
    (*server).sin_port = htons(PORT); // converts unsigned short int from host byte order to network order
    (*server).sin_family = AF_INET;

    if( bind(*sock_fd, (struct sockaddr *) server, sizeof(*server)) < 0)
    {
        error_message("bind()");
        exit(2);
    }

    printf("\nServer info: %s, %d\n", 
    inet_ntoa((*server).sin_addr), (*server).sin_port);


    /* Listen for n connection requests before further requests are refused. 
    It will mark the existing sock_fd as passive, 
    which means that socket will be used to accept connections and nothing else
    This is what starts the handshake. 
    Second argument is the queue size for pending connections. If it's full ECONNREFUSED */
    if(listen(*sock_fd, 1) < 0)
    {
        error_message("listen()");
        exit(3);
    }

    /* Accept the connection on returning a new socket for further comms, and store the address of peer(client) */
    
    if((*sock_fd_new = accept(*sock_fd, (struct sockaddr*)client, &client_addr_len)) < 0)
    {
        error_message("accept()");
        exit(3);
    }

    printf("\nAccepted TCP conn. Client SOCKET: (%s, %d) , ADDR_len: %d\n", 
                inet_ntoa((*client).sin_addr), 
                ntohs((*client).sin_port), 
                client_addr_len );
    
    return 1;

}



void close_fd(int fd)
{
    if((shutdown(fd, SHUT_RDWR)) < 0)
    {
        error_message("shutdown()");
        exit(6);
    }
    
}



int main()
{
    /* Declare vars */
    int sock_fd, sock_fd_new;
    struct sockaddr_in server, client;

    /* create, bind, connect and accept*/
    if(establish_tcp_conn(&sock_fd, &sock_fd_new, &server, &client) != 1)
    {
        error_message("establish_tcp_conn()");
        exit(7);
    }

    /* Send and receive message on the socket */
    char send_buf[32];
    strcpy(send_buf, "Hello From Server!");
    if( send(sock_fd_new, (void *) send_buf, sizeof(send_buf), 0) < 0 )
    {
        error_message("send()");
        exit(8);
    }

    /* Receive message. Here using recv() instead of recvfrom() as the socket is already connected*/
    char recv_buf[32];
    if(recv(sock_fd_new, (void*) recv_buf, sizeof(recv_buf), 0) < 0)
    {
        error_message("receive()");
        exit(9);
    }

    printf("\nReceived %d byte with value %s\n", (int) sizeof(recv_buf), recv_buf);
    

    /* Shutdown connections to both FD*/
    close_fd(sock_fd_new);
    close_fd(sock_fd);
    
    return 0;     
}