/*
 *
 * 项目名：	com.nio.john.netty2
 * 文件名：	ChatServer
 * 模块说明：
 * 修改历史：
 * 2018/3/29 - JOHN - 创建。
 */

package com.nio.john.netty2;

import com.nio.john.netty2.handler.SFPHandler;
import com.nio.john.netty2.handler.WebSocketHandler;
import com.nio.john.netty2.protocol.SFPDecoder;
import com.nio.john.netty2.protocol.SFPEncoder;
import com.nio.john.util.CONSTANT;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;

/**
 * @author JOHN
 * @date 2018/3/29
 */
public class ChatServer {
    public static void main(String[] args) {
        new ChatServer().bind(CONSTANT.port);
    }

    private void bind(int port) {
        // 创建工作线程组
        EventLoopGroup acceptorGroup = new NioEventLoopGroup();
        EventLoopGroup workGroup = new NioEventLoopGroup();

        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(acceptorGroup, workGroup)
                .channel(NioServerSocketChannel.class)
                .option(ChannelOption.SO_BACKLOG, 1024)
                .childOption(ChannelOption.SO_KEEPALIVE, true)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel socketChannel) throws Exception {
                        socketChannel.pipeline().addLast(new SFPEncoder())
                            .addLast(new SFPDecoder())
                            .addLast(new SFPHandler())
                            .addLast(new WebSocketServerProtocolHandler("/im"))
                            .addLast(new WebSocketHandler());
                    }
                });
            ChannelFuture future = bootstrap.bind(port).sync();
            System.out.println("服务端已启动，监听" + port);
            future.channel().closeFuture().sync();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
