/*
 *
 * 项目名：	com.nio.john.netty2.client
 * 文件名：	ChatClient
 * 模块说明：
 * 修改历史：
 * 2018/4/9 - JOHN - 创建。
 */

package com.nio.john.netty2.client;

import com.nio.john.netty2.protocol.SFPDecoder;
import com.nio.john.netty2.protocol.SFPEncoder;
import com.nio.john.util.CONSTANT;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;

/**
 * @author JOHN
 * @date 2018/4/9
 */
public class ChatClient {
    public static void main(String[] args) {
        try {
            new ChatClient().connect(CONSTANT.host, CONSTANT.port);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void connect(String host, int port) throws Exception {
        EventLoopGroup group = new NioEventLoopGroup();
        try {
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(group).channel(NioSocketChannel.class)
                .option(ChannelOption.TCP_NODELAY, true)
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        ch.pipeline().addLast(new SFPDecoder());
                        ch.pipeline().addLast(new SFPEncoder());
                        ch.pipeline().addLast(new ChatClientHandler());
                    }
                });
            // 同步连接
            ChannelFuture future = bootstrap.connect(host, port).sync();
            // 等待客户端链路关闭
            future.channel().closeFuture().sync();
        } finally {
            // 释放资源
            group.shutdownGracefully();
        }
    }
}
