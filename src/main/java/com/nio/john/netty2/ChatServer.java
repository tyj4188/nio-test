/*
 *
 * 项目名：	com.nio.john.netty2
 * 文件名：	ChatServer
 * 模块说明：
 * 修改历史：
 * 2018/3/29 - JOHN - 创建。
 */

package com.nio.john.netty2;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;

/**
 * @author JOHN
 * @date 2018/3/29
 */
public class ChatServer {
    public static void main(String[] args) {

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

                    }
                });

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
